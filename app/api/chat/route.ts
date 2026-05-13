import { anthropic } from '@ai-sdk/anthropic';
import { streamText, generateText } from 'ai';
import { createClient as createSb } from '@supabase/supabase-js';
import { SYSTEM_PROMPT } from '@/lib/prompts/system';
import { tools } from '@/lib/tools';
import {
  createSaveUserContextTool,
  getUserContext,
  formatUserContext,
} from '@/lib/tools/user-context';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function getAdmin() {
  return createSb(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function generateTitle(userText: string, aiText: string): Promise<string | null> {
  try {
    const res = await generateText({
      model: anthropic('claude-haiku-4-5'),
      prompt: `根据下面这轮对话，生成一个 8-15 字的中文标题，总结用户在问什么。只返回标题文字，不要引号、不要解释。\n\n用户：${userText}\n\nAI：${aiText.slice(0, 500)}`,
      maxTokens: 50,
    });
    const t = res.text.trim().replace(/^["「『](.*)["」』]$/u, '$1').trim();
    if (!t || t.length > 40) return null;
    return t;
  } catch (err) {
    console.warn('[chat] generateTitle failed:', err);
    return null;
  }
}

export async function POST(req: Request) {
  const { messages, conversationId: clientConvId } = await req.json();

  const authSb = await createClient();
  const {
    data: { user },
  } = await authSb.auth.getUser();
  const userId = user?.id ?? 'anonymous';

  const admin = getAdmin();

  // 校验 conversationId 归属：防止用户传他人的 conversationId 污染历史
  let conversationId: string;
  if (clientConvId) {
    const { data: conv } = await admin
      .from('conversations')
      .select('id, user_id')
      .eq('id', clientConvId)
      .maybeSingle();

    if (conv && conv.user_id !== userId) {
      return Response.json({ error: 'forbidden' }, { status: 403 });
    }

    if (!conv) {
      // conversations 表里查不到，再看 chat_messages 是否已有他人写入
      const { count } = await admin
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', clientConvId);

      if ((count ?? 0) > 0) {
        return Response.json({ error: 'forbidden' }, { status: 403 });
      }
      // count === 0：全新 ID，允许使用
    }

    conversationId = clientConvId;
  } else {
    conversationId = crypto.randomUUID();
  }

  // 写入新的用户消息（仅当最后一条是 user 时——避免重复写历史消息）
  const lastMessage = messages?.[messages.length - 1];
  const lastUserText: string | null =
    lastMessage?.role === 'user' && typeof lastMessage.content === 'string'
      ? lastMessage.content
      : null;
  if (lastUserText) {
    const { error } = await admin.from('chat_messages').insert({
      user_id: userId,
      conversation_id: conversationId,
      role: 'user',
      content: { text: lastUserText },
    });
    if (error) console.warn('[chat] insert user msg failed:', error.message);
  }

  const userCtx = await getUserContext(userId);
  const systemWithCtx = SYSTEM_PROMPT + formatUserContext(userCtx);

  const result = await streamText({
    model: anthropic('claude-sonnet-4-5'),
    system: systemWithCtx,
    messages,
    maxTokens: 2048,
    tools: {
      ...tools,
      save_user_context: createSaveUserContextTool(userId),
    },
    maxSteps: 5,
    onFinish: async ({ text, toolCalls, toolResults, usage }) => {
      // 1. 写 assistant 消息
      const { error: insErr } = await admin.from('chat_messages').insert({
        user_id: userId,
        conversation_id: conversationId,
        role: 'assistant',
        content: { text, toolCalls, toolResults },
        tokens_input: usage?.promptTokens,
        tokens_output: usage?.completionTokens,
      });
      if (insErr) console.warn('[chat] insert assistant msg failed:', insErr.message);

      // 2. 判断是不是首轮——count 这个 conversation 的消息数
      const { count } = await admin
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId);

      const isFirstTurn = count === 2; // 1 user + 1 assistant 刚插完

      if (isFirstTurn) {
        // 异步生成标题，失败 fallback 到 user 消息前 30 字
        const title =
          (lastUserText && (await generateTitle(lastUserText, text))) ??
          (lastUserText ? lastUserText.slice(0, 30) : '新对话');

        const { error: upErr } = await admin.from('conversations').upsert(
          {
            id: conversationId,
            user_id: userId,
            title,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' },
        );
        if (upErr) console.warn('[chat] upsert conversation failed:', upErr.message);
      } else {
        // 续聊：只更新 updated_at（不动 title）
        const { error: updErr } = await admin
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId)
          .eq('user_id', userId);
        if (updErr)
          console.warn('[chat] update conversation updated_at failed:', updErr.message);
      }
    },
  });

  return result.toDataStreamResponse({
    headers: { 'x-conversation-id': conversationId },
  });
}

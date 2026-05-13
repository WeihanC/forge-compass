import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
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

export async function POST(req: Request) {
  const { messages, conversationId: clientConvId } = await req.json();

  const authSb = await createClient();
  const {
    data: { user },
  } = await authSb.auth.getUser();
  const userId = user?.id ?? 'anonymous';

  const conversationId: string = clientConvId ?? crypto.randomUUID();
  const admin = getAdmin();

  // 写入新的用户消息（仅当最后一条是 user 时——避免重复写历史消息）
  const lastMessage = messages?.[messages.length - 1];
  if (lastMessage?.role === 'user' && typeof lastMessage.content === 'string') {
    const { error } = await admin.from('chat_messages').insert({
      user_id: userId,
      conversation_id: conversationId,
      role: 'user',
      content: { text: lastMessage.content },
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
      const { error } = await admin.from('chat_messages').insert({
        user_id: userId,
        conversation_id: conversationId,
        role: 'assistant',
        content: { text, toolCalls, toolResults },
        tokens_input: usage?.promptTokens,
        tokens_output: usage?.completionTokens,
      });
      if (error) console.warn('[chat] insert assistant msg failed:', error.message);
    },
  });

  return result.toDataStreamResponse({
    headers: { 'x-conversation-id': conversationId },
  });
}

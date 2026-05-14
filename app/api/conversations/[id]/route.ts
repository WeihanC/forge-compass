import { createClient as createSb } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function getAdmin() {
  return createSb(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const authSb = await createClient();
  const {
    data: { user },
  } = await authSb.auth.getUser();
  if (!user) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const admin = getAdmin();
  const { data, error } = await admin
    .from('chat_messages')
    .select('id, role, content, created_at, user_id')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return Response.json({ error: 'not found' }, { status: 404 });
  }

  // 校验所有消息都属于当前用户
  const owner = data[0].user_id;
  if (owner !== user.id || data.some((m) => m.user_id !== user.id)) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  // 映射为 ai-sdk Message 格式；assistant 消息额外保留 toolCalls / toolResults
  // 给前端用于还原 toolInvocations（用于来源 pill 摘录显示）
  const messages = data
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => {
      const c = m.content as
        | { text?: string; toolCalls?: unknown[]; toolResults?: unknown[] }
        | null;
      const base = {
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: c?.text ?? '',
      };
      if (m.role === 'assistant') {
        return {
          ...base,
          toolCalls: Array.isArray(c?.toolCalls) ? c!.toolCalls : [],
          toolResults: Array.isArray(c?.toolResults) ? c!.toolResults : [],
        };
      }
      return base;
    });

  return Response.json({ messages });
}

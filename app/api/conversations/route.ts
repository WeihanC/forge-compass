import { createClient as createSb } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function getAdmin() {
  return createSb(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

type RawMsg = {
  conversation_id: string;
  role: string;
  content: unknown;
  created_at: string;
};

export async function GET() {
  const authSb = await createClient();
  const {
    data: { user },
  } = await authSb.auth.getUser();
  if (!user) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const admin = getAdmin();

  // 拉 chat_messages 做分组（fallback 标题用）
  const { data: msgs, error: msgErr } = await admin
    .from('chat_messages')
    .select('conversation_id, role, content, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (msgErr) {
    return Response.json({ error: msgErr.message }, { status: 500 });
  }

  // 拉 conversations 拿 AI 生成的标题
  const { data: convsRow } = await admin
    .from('conversations')
    .select('id, title, updated_at')
    .eq('user_id', user.id);

  const titleMap = new Map<string, string>();
  for (const c of convsRow ?? []) {
    if (c.title) titleMap.set(c.id, c.title);
  }

  // 按 conversation_id 分组：第一条 user 消息做 fallback 标题，max created_at 做时间
  const map = new Map<
    string,
    { id: string; title: string; last_active: string }
  >();
  for (const m of (msgs as RawMsg[]) ?? []) {
    const text =
      (m.content as { text?: string } | null)?.text?.toString().trim() ?? '';
    if (!map.has(m.conversation_id)) {
      if (m.role !== 'user') continue;
      map.set(m.conversation_id, {
        id: m.conversation_id,
        title: titleMap.get(m.conversation_id) ?? (text.slice(0, 30) || '新对话'),
        last_active: m.created_at,
      });
    } else {
      map.get(m.conversation_id)!.last_active = m.created_at;
    }
  }

  const conversations = Array.from(map.values())
    .sort((a, b) => b.last_active.localeCompare(a.last_active))
    .slice(0, 50);

  return Response.json({ conversations });
}

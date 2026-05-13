import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient as createSb } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getAdmin() {
  return createSb(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default async function AdminConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const authSb = await createClient();
  const {
    data: { user },
  } = await authSb.auth.getUser();
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!user || !adminEmails.includes(user.email ?? '')) {
    redirect('/');
  }

  const admin = getAdmin();

  const { data: conv } = await admin
    .from('conversations')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  const { data: messages } = await admin
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true });

  const msgs = messages ?? [];
  const ownerId = conv?.user_id ?? msgs[0]?.user_id;

  let ownerEmail = ownerId ?? '(未知)';
  if (ownerId) {
    const { data: u } = await admin.auth.admin.getUserById(ownerId);
    if (u?.user?.email) ownerEmail = u.user.email;
  }

  const tokensIn = msgs.reduce((s, m) => s + (m.tokens_input ?? 0), 0);
  const tokensOut = msgs.reduce((s, m) => s + (m.tokens_output ?? 0), 0);

  return (
    <div className="min-h-[100dvh] bg-bg text-ink">
      <header className="border-b border-line bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link
            href="/admin"
            className="text-[12.5px] text-ink-mute hover:text-ink"
          >
            ← 管理后台
          </Link>
          <span className="text-[12px] text-ink-faint">/</span>
          <span className="text-[14.5px] font-semibold truncate">
            {conv?.title || '(无标题)'}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6 flex flex-col gap-6">
        {/* 顶部信息 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Info label="用户" value={ownerEmail} />
          <Info label="消息数" value={msgs.length} />
          <Info label="输入 tokens" value={tokensIn.toLocaleString()} />
          <Info label="输出 tokens" value={tokensOut.toLocaleString()} />
        </div>

        {/* 消息时间线 */}
        <div className="flex flex-col gap-3">
          {msgs.length === 0 && (
            <div className="text-ink-faint text-[13px] text-center py-12">
              没有消息
            </div>
          )}
          {msgs.map((m) => {
            const text = (m.content as { text?: string } | null)?.text ?? '';
            const toolCalls =
              (m.content as { toolCalls?: unknown[] } | null)?.toolCalls ?? [];
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`border rounded-lg p-3.5 ${
                  isUser ? 'border-line bg-bubble/40' : 'border-line bg-surface'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 text-[11.5px] text-ink-faint">
                  <span
                    className="font-semibold uppercase tracking-[0.06em]"
                    style={{
                      color: isUser ? 'var(--ink-2)' : 'var(--accent)',
                    }}
                  >
                    {m.role}
                  </span>
                  <span>·</span>
                  <span>{fmtTime(m.created_at)}</span>
                  {(m.tokens_input || m.tokens_output) && (
                    <>
                      <span>·</span>
                      <span>
                        {m.tokens_input ?? 0} in / {m.tokens_output ?? 0} out
                      </span>
                    </>
                  )}
                  {Array.isArray(toolCalls) && toolCalls.length > 0 && (
                    <>
                      <span>·</span>
                      <span>
                        工具：
                        {toolCalls
                          .map(
                            (tc) =>
                              (tc as { toolName?: string }).toolName ?? '?',
                          )
                          .join(', ')}
                      </span>
                    </>
                  )}
                </div>
                <div className="whitespace-pre-wrap text-[13.5px] text-ink leading-[1.65]">
                  {text || (
                    <span className="text-ink-faint italic">(空消息)</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-surface border border-line rounded-lg px-3 py-2.5">
      <div className="text-[11px] text-ink-mute mb-0.5">{label}</div>
      <div className="text-[14px] font-medium truncate">{value}</div>
    </div>
  );
}

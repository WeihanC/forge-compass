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
  const d = new Date(iso);
  return d.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fmtTokens(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

export default async function AdminPage() {
  // 第二道防线：middleware 已经卡过，这里再校验一次
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

  // 今天的起始时间（UTC）
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();

  // ─── 拉所有用户邮箱 map ───
  const { data: usersList } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  const userMap = new Map<string, string>();
  for (const u of usersList?.users ?? []) {
    userMap.set(u.id, u.email ?? '(无邮箱)');
  }
  const totalUsers = usersList?.users.length ?? 0;

  // ─── DAU ───
  const { data: todayMsgs } = await admin
    .from('chat_messages')
    .select('user_id, tokens_input, tokens_output')
    .gte('created_at', todayIso);

  const dau = new Set((todayMsgs ?? []).map((m) => m.user_id)).size;
  const tokensToday = (todayMsgs ?? []).reduce(
    (sum, m) => sum + (m.tokens_input ?? 0) + (m.tokens_output ?? 0),
    0,
  );

  // ─── 今日新对话数 ───
  const { count: newConvsToday } = await admin
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayIso);

  // ─── 最近 50 条对话 ───
  const { data: recentConvs } = await admin
    .from('conversations')
    .select('id, user_id, title, updated_at, created_at')
    .order('updated_at', { ascending: false })
    .limit(50);

  // 为每条对话拿消息数（一次性查 in conversation_id）
  const convIds = (recentConvs ?? []).map((c) => c.id);
  const { data: msgCountRows } = await admin
    .from('chat_messages')
    .select('conversation_id, tokens_input, tokens_output')
    .in('conversation_id', convIds.length > 0 ? convIds : ['__none__']);

  const convStats = new Map<
    string,
    { msgCount: number; tokens: number }
  >();
  for (const m of msgCountRows ?? []) {
    const cur = convStats.get(m.conversation_id) ?? { msgCount: 0, tokens: 0 };
    cur.msgCount += 1;
    cur.tokens += (m.tokens_input ?? 0) + (m.tokens_output ?? 0);
    convStats.set(m.conversation_id, cur);
  }

  // ─── 最近 50 条用户消息 ───
  const { data: recentUserMsgs } = await admin
    .from('chat_messages')
    .select('id, user_id, conversation_id, content, created_at')
    .eq('role', 'user')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="min-h-[100dvh] bg-bg text-ink">
      {/* 顶栏 */}
      <header className="border-b border-line bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <span className="text-[18px] font-semibold">出海罗盘 · 管理后台</span>
          <span className="text-[12px] text-ink-faint">
            {user.email} · 今天数据基于 UTC
          </span>
          <Link
            href="/"
            className="ml-auto text-[12.5px] text-ink-mute hover:text-ink"
          >
            返回主站 →
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        {/* 顶部 4 个数字卡 */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="今日活跃用户" value={dau} />
          <StatCard label="今日新对话" value={newConvsToday ?? 0} />
          <StatCard label="今日 Tokens" value={fmtTokens(tokensToday)} />
          <StatCard label="累计注册用户" value={totalUsers} />
        </section>

        {/* 最近对话 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-3">最近 50 条对话</h2>
          <div className="border border-line rounded-lg overflow-x-auto bg-surface">
            <table className="w-full text-[13px]">
              <thead className="bg-hover text-ink-mute">
                <tr>
                  <Th>用户</Th>
                  <Th>对话标题</Th>
                  <Th>消息数</Th>
                  <Th>Tokens</Th>
                  <Th>最后活跃</Th>
                  <Th>操作</Th>
                </tr>
              </thead>
              <tbody>
                {(recentConvs ?? []).map((c) => {
                  const stats = convStats.get(c.id) ?? { msgCount: 0, tokens: 0 };
                  return (
                    <tr key={c.id} className="border-t border-line-soft">
                      <Td>
                        <span className="text-ink truncate inline-block max-w-[180px]">
                          {userMap.get(c.user_id) ?? c.user_id}
                        </span>
                      </Td>
                      <Td>
                        <span className="truncate inline-block max-w-[300px]">
                          {c.title || '(无标题)'}
                        </span>
                      </Td>
                      <Td>{stats.msgCount}</Td>
                      <Td>{fmtTokens(stats.tokens)}</Td>
                      <Td>{fmtTime(c.updated_at)}</Td>
                      <Td>
                        <Link
                          href={`/admin/conversations/${c.id}`}
                          className="text-[var(--accent)] hover:underline"
                        >
                          查看
                        </Link>
                      </Td>
                    </tr>
                  );
                })}
                {(recentConvs ?? []).length === 0 && (
                  <tr>
                    <Td colSpan={6}>
                      <span className="text-ink-faint">暂无对话</span>
                    </Td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 最近用户消息 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-3">最近 50 条用户消息</h2>
          <div className="border border-line rounded-lg overflow-x-auto bg-surface">
            <table className="w-full text-[13px]">
              <thead className="bg-hover text-ink-mute">
                <tr>
                  <Th>用户</Th>
                  <Th>消息</Th>
                  <Th>时间</Th>
                  <Th>对话</Th>
                </tr>
              </thead>
              <tbody>
                {(recentUserMsgs ?? []).map((m) => {
                  const text =
                    (m.content as { text?: string } | null)?.text ?? '';
                  return (
                    <tr key={m.id} className="border-t border-line-soft">
                      <Td>
                        <span className="truncate inline-block max-w-[180px]">
                          {userMap.get(m.user_id) ?? m.user_id}
                        </span>
                      </Td>
                      <Td>
                        <span className="truncate inline-block max-w-[480px]">
                          {text.slice(0, 100)}
                          {text.length > 100 ? '…' : ''}
                        </span>
                      </Td>
                      <Td>{fmtTime(m.created_at)}</Td>
                      <Td>
                        <Link
                          href={`/admin/conversations/${m.conversation_id}`}
                          className="text-[var(--accent)] hover:underline"
                        >
                          打开
                        </Link>
                      </Td>
                    </tr>
                  );
                })}
                {(recentUserMsgs ?? []).length === 0 && (
                  <tr>
                    <Td colSpan={4}>
                      <span className="text-ink-faint">暂无消息</span>
                    </Td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-surface border border-line rounded-lg px-4 py-3.5">
      <div className="text-[11.5px] text-ink-mute mb-1">{label}</div>
      <div className="text-[24px] font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left font-medium px-3 py-2 text-[11.5px] uppercase tracking-[0.04em]">
      {children}
    </th>
  );
}

function Td({
  children,
  colSpan,
}: {
  children: React.ReactNode;
  colSpan?: number;
}) {
  return (
    <td className="px-3 py-2.5 align-middle" colSpan={colSpan}>
      {children}
    </td>
  );
}

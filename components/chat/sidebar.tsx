'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, Sun, Moon, LogOut, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SidebarProps {
  userEmail: string;
  currentConversationId: string | null;
  refreshKey: number;
  open: boolean;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
}

type Conv = { id: string; title: string; last_active: string };

function groupByTime(convs: Conv[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const todayList: Conv[] = [];
  const weekList: Conv[] = [];
  const olderList: Conv[] = [];
  for (const c of convs) {
    const t = new Date(c.last_active);
    if (t >= today) todayList.push(c);
    else if (t >= weekAgo) weekList.push(c);
    else olderList.push(c);
  }
  return { todayList, weekList, olderList };
}

export function Sidebar({
  userEmail,
  currentConversationId,
  refreshKey,
  open,
  onSelectConversation,
  onNewChat,
}: SidebarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [conversations, setConversations] = useState<Conv[]>([]);

  useEffect(() => setMounted(true), []);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations');
      if (!res.ok) return;
      const data = (await res.json()) as { conversations?: Conv[] };
      setConversations(data.conversations ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations, refreshKey]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const initial = (userEmail || '?').trim().charAt(0).toUpperCase();
  const isDark = mounted && resolvedTheme === 'dark';
  const { todayList, weekList, olderList } = groupByTime(conversations);

  return (
    <aside
      className={`w-[260px] shrink-0 flex flex-col gap-1.5 p-2.5 bg-sb-bg border-r border-line
        fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-out
        md:relative md:translate-x-0 md:z-auto md:transition-none
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* 顶部：logo + brand + 主题切换 */}
      <div className="flex items-center gap-2 p-2">
        <div
          className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-white"
          style={{
            background: 'var(--accent)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)',
          }}
        >
          <Sparkles size={14} />
        </div>
        <span className="text-[14.5px] font-semibold tracking-[0.01em] flex-1">
          出海罗盘
        </span>
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label="切换深色模式"
          className="w-[26px] h-[26px] rounded-md flex items-center justify-center text-ink-faint hover:bg-hover hover:text-ink"
          suppressHydrationWarning
        >
          {mounted ? isDark ? <Sun size={15} /> : <Moon size={15} /> : null}
        </button>
      </div>

      {/* 新对话 */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-2.5 w-full px-2.5 py-2.5 rounded-lg text-[13.5px] font-medium text-ink border border-line bg-surface hover:bg-hover"
      >
        <Plus size={15} />
        新对话
      </button>

      {/* 搜索对话 */}
      <button className="flex items-center gap-2 px-2.5 py-2 text-ink-mute text-[13px] rounded-lg hover:bg-hover hover:text-ink">
        <Search size={15} />
        <span>搜索对话</span>
      </button>

      {/* 历史列表 */}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
        {conversations.length === 0 ? (
          <div className="px-2.5 pt-4 text-[12px] text-ink-faint">
            还没有对话历史
          </div>
        ) : (
          <>
            {todayList.length > 0 && (
              <>
                <SectionTitle>今天</SectionTitle>
                <ItemList
                  items={todayList}
                  activeId={currentConversationId}
                  onSelect={onSelectConversation}
                />
              </>
            )}
            {weekList.length > 0 && (
              <>
                <SectionTitle>本周</SectionTitle>
                <ItemList
                  items={weekList}
                  activeId={currentConversationId}
                  onSelect={onSelectConversation}
                />
              </>
            )}
            {olderList.length > 0 && (
              <>
                <SectionTitle>更早</SectionTitle>
                <ItemList
                  items={olderList}
                  activeId={currentConversationId}
                  onSelect={onSelectConversation}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* 底部用户区 */}
      <div className="border-t border-line pt-2 mt-1.5">
        <div className="flex items-center gap-2.5 p-2 rounded-lg">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11.5px] font-semibold shrink-0"
            style={{
              background: 'var(--accent)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)',
            }}
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-ink truncate">
              {userEmail || '未登录'}
            </div>
            <div className="text-[10.5px] text-ink-faint">内测用户</div>
          </div>
          <button
            onClick={handleSignOut}
            title="退出登录"
            className="w-7 h-7 rounded-md flex items-center justify-center text-ink-faint hover:bg-hover hover:text-ink"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 pt-3.5 pb-1 text-[11px] font-semibold text-ink-faint uppercase tracking-[0.04em]">
      {children}
    </div>
  );
}

function ItemList({
  items,
  activeId,
  onSelect,
}: {
  items: Conv[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[1px]">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            title={item.title}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-[7px] text-[13px] truncate text-left ${
              isActive
                ? 'bg-surface text-ink font-medium shadow-[0_0_0_1px_var(--line)]'
                : 'text-ink-2 hover:bg-hover'
            }`}
          >
            <span className="truncate">{item.title}</span>
          </button>
        );
      })}
    </div>
  );
}

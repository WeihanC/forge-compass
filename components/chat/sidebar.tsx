'use client';

import { Plus, Search, Sun, Moon, LogOut, Sparkles, PanelLeft } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SidebarProps {
  userEmail: string;
}

const HISTORY_TODAY = [
  { id: '1', t: 'Amazon vs Chewy 哪个先做？' },
  { id: '2', t: '宠物饮水机类目竞争分析' },
  { id: '3', t: 'FDA 标签合规自查' },
];
const HISTORY_WEEK = [
  { id: '4', t: '美西仓 vs FBA 成本对比' },
  { id: '5', t: '如何避免价格战？' },
];

export function Sidebar({ userEmail }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const initial = (userEmail || '?').trim().charAt(0).toUpperCase();
  const isDark = theme === 'dark';

  return (
    <aside className="w-[260px] shrink-0 flex flex-col gap-1.5 p-2.5 bg-sb-bg border-r border-line">
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
        <span className="text-[14.5px] font-semibold tracking-[0.01em] flex-1">出海罗盘</span>
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label="切换深色模式"
          className="w-[26px] h-[26px] rounded-md flex items-center justify-center text-ink-faint hover:bg-hover hover:text-ink"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {/* 新对话 */}
      <button
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

      {/* 今天 */}
      <div className="px-2.5 pt-3.5 pb-1 text-[11px] font-semibold text-ink-faint uppercase tracking-[0.04em]">
        今天
      </div>
      <div className="flex flex-col gap-[1px]">
        {HISTORY_TODAY.map((item) => (
          <button
            key={item.id}
            className="flex items-center gap-2 px-2.5 py-2 rounded-[7px] text-[13px] text-ink-2 truncate text-left hover:bg-hover"
          >
            <span className="truncate">{item.t}</span>
          </button>
        ))}
      </div>

      {/* 本周 */}
      <div className="px-2.5 pt-3.5 pb-1 text-[11px] font-semibold text-ink-faint uppercase tracking-[0.04em]">
        本周
      </div>
      <div className="flex flex-col gap-[1px] flex-1 overflow-y-auto min-h-0">
        {HISTORY_WEEK.map((item) => (
          <button
            key={item.id}
            className="flex items-center gap-2 px-2.5 py-2 rounded-[7px] text-[13px] text-ink-2 truncate text-left hover:bg-hover"
          >
            <span className="truncate">{item.t}</span>
          </button>
        ))}
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

'use client';

import { Plus, User, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';

interface SidebarProps {
  userEmail: string;
}

const MOCK_HISTORY = [
  { id: '1', title: 'Amazon vs Chewy 哪个先做？' },
  { id: '2', title: '宠物饮水机类目竞争分析' },
  { id: '3', title: 'FDA 标签合规自查' },
  { id: '4', title: '美西仓 vs FBA 成本对比' },
  { id: '5', title: '如何避免价格战？' },
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

  return (
    <aside className="w-[260px] flex flex-col border-r border-border bg-muted/30 shrink-0">
      {/* 顶部 logo 区 */}
      <div className="h-14 flex items-center px-4">
        <span className="text-lg font-semibold tracking-tight">🧭 出海罗盘</span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="切换深色模式"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
      </div>

      <Separator />

      {/* 新对话按钮 */}
      <div className="px-3 py-2">
        <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
          <Plus size={16} />
          新对话
        </Button>
      </div>

      <Separator />

      {/* 对话历史列表 */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {MOCK_HISTORY.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="w-full justify-start text-sm truncate px-2 h-9 text-muted-foreground"
          >
            {item.title}
          </Button>
        ))}
      </div>

      {/* 底部用户区 */}
      <div className="border-t border-border px-3 py-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
          <User size={14} />
          <span className="truncate">{userEmail || '未登录'}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-xs text-muted-foreground h-8"
          onClick={handleSignOut}
        >
          <LogOut size={14} />
          退出登录
        </Button>
      </div>
    </aside>
  );
}

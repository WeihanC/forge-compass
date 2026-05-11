'use client';

import { Plus, User, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  userId: string;
}

const MOCK_HISTORY = [
  { id: '1', title: 'Amazon vs Chewy 哪个先做？' },
  { id: '2', title: '宠物饮水机类目竞争分析' },
  { id: '3', title: 'FDA 标签合规自查' },
  { id: '4', title: '美西仓 vs FBA 成本对比' },
  { id: '5', title: '如何避免价格战？' },
];

export function Sidebar({ userId }: SidebarProps) {
  const { theme, setTheme } = useTheme();

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

      {/* 底部用户名 */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User size={14} />
          <span>{userId}</span>
        </div>
      </div>
    </aside>
  );
}

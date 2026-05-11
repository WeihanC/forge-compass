'use client';

interface EmptyStateProps {
  onPromptSelect: (prompt: string) => void;
}

const QUICK_PROMPTS = [
  {
    emoji: '🏪',
    title: '渠道决策',
    subtitle: 'Amazon vs Chewy vs TikTok Shop 怎么选？',
    prompt: '我想了解 Amazon、Chewy、TikTok Shop 三个渠道的区别，哪个更适合中国宠物用品品牌冷启动？',
  },
  {
    emoji: '⚖️',
    title: '合规风险',
    subtitle: '"natural"、"organic" 这些词能不能写？',
    prompt: '我的产品包装上想写 natural、organic、non-toxic、antibacterial，这些词在美国有没有法律风险？',
  },
  {
    emoji: '📊',
    title: '市场情报',
    subtitle: 'cat water fountain 类目现在谁在做？',
    prompt: '帮我查一下 Amazon 上 cat water fountain 类目的现状，Top 卖家是谁，价格带和评分情况如何？',
  },
  {
    emoji: '💰',
    title: '利润核算',
    subtitle: '扣完所有成本我还赚多少？',
    prompt: '我想算清楚在 Amazon 上卖宠物用品，扣掉广告、FBA 费用、退货、平台佣金后，真实利润是多少？',
  },
];

export function EmptyState({ onPromptSelect }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-2">要问出海罗盘什么？</h1>
      <p className="text-muted-foreground text-base mb-10">专为中国宠物用品出海企业家</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {QUICK_PROMPTS.map((item) => (
          <div
            key={item.title}
            onClick={() => onPromptSelect(item.prompt)}
            className="cursor-pointer rounded-xl border border-border p-4 hover:border-primary/50 hover:bg-muted/50 transition-colors"
          >
            <div className="text-2xl mb-2">{item.emoji}</div>
            <div className="font-medium text-sm mb-1">{item.title}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{item.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

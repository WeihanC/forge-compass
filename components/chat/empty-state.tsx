'use client';

import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onPromptSelect: (prompt: string) => void;
}

const QUICK_PROMPTS = [
  {
    tag: '渠道决策',
    prompt:
      '我想了解 Amazon、Chewy、TikTok Shop 三个渠道的区别，哪个更适合中国宠物用品品牌冷启动？',
  },
  {
    tag: '合规风险',
    prompt:
      '我的产品包装上想写 natural、organic、non-toxic、antibacterial，这些词在美国有没有法律风险？',
  },
  {
    tag: '市场情报',
    prompt:
      '帮我查一下 Amazon 上 cat water fountain 类目的现状，Top 卖家是谁，价格带和评分情况如何？',
  },
  {
    tag: '利润核算',
    prompt:
      '我想算清楚在 Amazon 上卖宠物用品，扣掉广告、FBA 费用、退货、平台佣金后，真实利润是多少？',
  },
];

export function EmptyState({ onPromptSelect }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <div
        className="w-10 h-10 md:w-12 md:h-12 rounded-[14px] flex items-center justify-center text-white mb-[18px]"
        style={{
          background: 'var(--accent)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,.25), 0 8px 24px color-mix(in oklab, var(--accent) 25%, transparent)',
        }}
      >
        <Sparkles size={20} className="md:hidden" />
        <Sparkles size={22} className="hidden md:block" />
      </div>

      <h1 className="m-0 mb-2 text-[22px] md:text-[26px] font-semibold tracking-[-0.01em]">
        有什么可以帮你？
      </h1>
      <p className="m-0 mb-7 text-ink-mute text-[14px]">
        聚焦海外市场情报、政策与渠道决策。试试这些起手式：
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-[640px]">
        {QUICK_PROMPTS.map((item) => (
          <button
            key={item.tag}
            onClick={() => onPromptSelect(item.prompt)}
            className="text-left rounded-xl border border-line bg-surface px-4 py-3.5 hover:bg-hover hover:-translate-y-px transition-all"
          >
            <div
              className="uppercase tracking-[0.06em] mb-1.5"
              style={{
                fontSize: '10.5px',
                fontWeight: 500,
                color: 'var(--accent)',
              }}
            >
              {item.tag}
            </div>
            <div className="text-[13.5px] text-ink leading-[1.55]">{item.prompt}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { useSearchParams } from 'next/navigation';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Message } from '@/components/chat/message';
import { cn } from '@/lib/utils';

export function ChatWindow() {
  // 从 URL 参数读取 user_id，例如 ?u=wilson，没有则默认 'default'
  const searchParams = useSearchParams();
  const userId = searchParams.get('u') ?? 'default';

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    // 把 user_id 传给后端，后端可以用来记录日志
    body: { userId },
  });

  // 自动滚动到最新消息
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Ctrl+Enter 提交，普通 Enter 换行
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 消息列表区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-4">
          {/* 空状态：欢迎文字 */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="mb-3">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">出海罗盘</span>
              </div>
              <p className="text-slate-500 text-[15px] leading-relaxed max-w-sm">
                你好，我是出海罗盘。<br />
                请告诉我你的问题，我会帮你做出更好的出海决策。
              </p>
            </div>
          )}

          {/* 消息列表 */}
          {messages.map((msg) => (
            <Message key={msg.id} role={msg.role as 'user' | 'assistant'} content={msg.content} />
          ))}

          {/* 加载中的"思考"指示器 */}
          {isLoading && (
            <div className="flex justify-start mb-5">
              <div className="flex items-center gap-1.5 text-slate-400 text-[14px]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              </div>
            </div>
          )}

          {/* 自动滚动锚点 */}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 固定底部输入区 */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="输入问题…（Ctrl+Enter 发送）"
              disabled={isLoading}
              rows={1}
              className={cn(
                'flex-1 min-h-[44px] max-h-[200px] text-[15px] leading-[1.6]',
                'border-slate-200 focus-visible:ring-slate-400',
                // 自适应高度：让 textarea 随内容增高
                'resize-none overflow-y-auto',
              )}
              // 自适应高度
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className={cn(
                'h-[44px] w-[44px] shrink-0',
                'bg-slate-900 hover:bg-slate-700 text-white',
                'disabled:opacity-40',
              )}
              aria-label="发送"
            >
              <SendHorizonal size={18} />
            </Button>
          </form>

          {/* 底部提示 */}
          <p className="text-center text-[11px] text-slate-400 mt-2">
            出海罗盘可能犯错，重要决策请核实来源
          </p>
        </div>
      </div>
    </div>
  );
}

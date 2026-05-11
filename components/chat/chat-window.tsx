'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { useSearchParams } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/components/chat/message';
import { Sidebar } from '@/components/chat/sidebar';
import { EmptyState } from '@/components/chat/empty-state';
import { InputArea } from '@/components/chat/input-area';

export function ChatWindow() {
  // 从 URL 参数读取 user_id，例如 ?u=wilson，没有则默认 'default'
  const searchParams = useSearchParams();
  const userId = searchParams.get('u') ?? 'default';

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    body: { userId },
  });

  // 自动滚动到最新消息
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // 快捷卡片点击：直接 append 发送
  function handlePromptSelect(prompt: string) {
    append({ role: 'user', content: prompt });
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar userId={userId} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {isEmpty ? (
          <EmptyState onPromptSelect={handlePromptSelect} />
        ) : (
          <ScrollArea className="flex-1 overflow-hidden">
            <div className="max-w-3xl mx-auto px-6 py-6">
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  role={msg.role as 'user' | 'assistant'}
                  content={msg.content}
                />
              ))}

              {/* 加载中指示器 */}
              {isLoading && (
                <div className="flex items-center gap-1.5 py-2 px-1 mb-5">
                  <span className="text-sm text-muted-foreground">出海罗盘正在查询…</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                </div>
              )}

              {/* 自动滚动锚点 */}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        )}

        <InputArea
          input={input}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}

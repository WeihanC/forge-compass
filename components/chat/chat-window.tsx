'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { ChevronDown, Share2, MoreHorizontal, Sparkles } from 'lucide-react';
import { Message } from '@/components/chat/message';
import { Sidebar } from '@/components/chat/sidebar';
import { EmptyState } from '@/components/chat/empty-state';
import { InputArea } from '@/components/chat/input-area';

interface ChatWindowProps {
  userId: string;
  userEmail: string;
}

const TOOL_LABELS: Record<string, string> = {
  web_search: '正在搜索网络…',
  search_knowledge_base: '正在查询知识库…',
  save_user_context: '正在记录你的信息…',
};

export function ChatWindow({ userId, userEmail }: ChatWindowProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function handlePromptSelect(prompt: string) {
    append({ role: 'user', content: prompt });
  }

  const isEmpty = messages.length === 0;

  // Loading 占位逻辑：isLoading 且最后一条是 user → 显示 ai-head + thinking
  const lastMessage = messages[messages.length - 1];
  const showPlaceholder = isLoading && lastMessage?.role === 'user';

  // 工具调用状态文字：检查最后一条 assistant 消息的 toolInvocations
  let toolStatus: string | null = null;
  if (isLoading && lastMessage?.role === 'assistant') {
    const invocations = lastMessage.toolInvocations as
      | { toolName: string; state: string }[]
      | undefined;
    const pending = invocations?.find((inv) => inv.state !== 'result');
    if (pending) toolStatus = TOOL_LABELS[pending.toolName] ?? '正在思考…';
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-ink">
      <Sidebar userEmail={userEmail} />

      <main className="flex-1 flex flex-col min-w-0 h-screen bg-surface">
        {/* 顶栏 */}
        <header className="flex items-center gap-2.5 px-[18px] py-2.5 border-b border-line-soft">
          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] text-[12.5px] text-ink-mute hover:bg-hover hover:text-ink">
            <span className="font-semibold text-ink">出海罗盘</span>
            <span className="text-ink-faint">· 情报版</span>
            <ChevronDown size={14} />
          </button>
          <div className="ml-auto flex items-center gap-1">
            <button
              title="分享"
              className="w-8 h-8 rounded-[7px] text-ink-mute flex items-center justify-center hover:bg-hover hover:text-ink"
            >
              <Share2 size={16} />
            </button>
            <button
              title="更多"
              className="w-8 h-8 rounded-[7px] text-ink-mute flex items-center justify-center hover:bg-hover hover:text-ink"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        </header>

        {/* 对话流 */}
        <div ref={streamRef} className="flex-1 overflow-y-auto py-6">
          {isEmpty ? (
            <div className="h-full flex">
              <EmptyState onPromptSelect={handlePromptSelect} />
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  role={msg.role as 'user' | 'assistant'}
                  content={msg.content}
                />
              ))}

              {showPlaceholder && (
                <div className="py-3.5">
                  <div className="max-w-[740px] mx-auto px-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-white"
                        style={{
                          background: 'var(--accent)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)',
                        }}
                      >
                        <Sparkles size={14} />
                      </div>
                      <span className="text-[13px] font-semibold text-ink">出海罗盘</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-ink-mute text-[13.5px]">
                      <span>正在思考</span>
                      <span className="inline-flex items-center gap-1">
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {toolStatus && (
                <div className="py-2">
                  <div className="max-w-[740px] mx-auto px-6 flex items-center gap-1.5 text-ink-mute text-[13.5px]">
                    <span>{toolStatus}</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* 输入区 */}
        <div className="px-6 pt-2 pb-[18px]">
          <InputArea
            input={input}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
          <div className="max-w-[740px] mx-auto mt-2 text-[11px] text-ink-faint text-center">
            内容由 AI 生成，重要决策请核实信息来源。
          </div>
        </div>
      </main>

      <style jsx>{`
        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          animation: bb 1.2s ease-in-out infinite;
          display: inline-block;
        }
        .dot:nth-child(2) {
          animation-delay: 0.15s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes bb {
          0%,
          80%,
          100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { ArrowUp, Paperclip, Globe, Sparkles } from 'lucide-react';

interface InputAreaProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function InputArea({ input, isLoading, onInputChange, onSubmit }: InputAreaProps) {
  const [focused, setFocused] = useState(false);
  const hasText = input.trim().length > 0;
  const canSend = hasText && !isLoading;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-[740px] mx-auto">
      <div
        className="flex items-end gap-1.5"
        style={{
          background: 'var(--surface)',
          border: `1px solid ${
            focused
              ? 'color-mix(in oklab, var(--accent) 35%, var(--line))'
              : 'var(--line)'
          }`,
          borderRadius: '22px',
          padding: '6px 6px 6px 18px',
          boxShadow: focused
            ? '0 1px 4px rgba(0,0,0,.04), 0 0 0 4px color-mix(in oklab, var(--accent) 12%, transparent)'
            : '0 1px 4px rgba(0,0,0,.04)',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        <textarea
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="问出海罗盘任何关于宠物用品出海的问题…"
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent border-0 outline-none resize-none text-ink placeholder:text-ink-faint"
          style={{
            fontSize: '14.5px',
            lineHeight: 1.55,
            padding: '12px 0',
            maxHeight: '200px',
          }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
          }}
        />

        {/* 左下角工具按钮（仅 UI） */}
        <div className="flex items-center gap-0.5 pb-1.5">
          <button
            type="button"
            title="附件（即将开放）"
            disabled
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-mute opacity-40"
          >
            <Paperclip size={16} />
          </button>
          <button
            type="button"
            title="联网搜索（默认开启）"
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-hover"
            style={{
              color: 'var(--accent)',
              background: 'color-mix(in oklab, var(--accent) 10%, transparent)',
            }}
          >
            <Globe size={16} />
          </button>
          <button
            type="button"
            title="深度思考"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-mute hover:bg-hover hover:text-ink"
          >
            <Sparkles size={16} />
          </button>
        </div>

        {/* 右下角发送按钮 */}
        <button
          type="submit"
          disabled={!canSend}
          title="发送（Enter）"
          className="rounded-[9px] flex items-center justify-center transition-all"
          style={{
            width: '34px',
            height: '34px',
            marginBottom: '6px',
            background: canSend ? 'var(--accent)' : 'var(--send-ink)',
            color: canSend ? '#fff' : 'var(--surface)',
            opacity: canSend ? 1 : 0.25,
          }}
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </form>
  );
}

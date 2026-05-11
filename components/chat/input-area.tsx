'use client';

import { Paperclip, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InputAreaProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onValueChange?: (value: string) => void;
}

export function InputArea({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: InputAreaProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  }

  return (
    <TooltipProvider>
      <div className="border-t border-border bg-background px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={onSubmit}>
            <div className="relative rounded-xl border border-border bg-background focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
              <Textarea
                value={input}
                onChange={onInputChange}
                onKeyDown={handleKeyDown}
                placeholder="输入问题…"
                disabled={isLoading}
                rows={3}
                className="min-h-[80px] max-h-[300px] resize-none border-0 shadow-none focus-visible:ring-0 pr-12 pl-3 pt-3 pb-10 text-[15px] leading-[1.6]"
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = `${Math.min(el.scrollHeight, 300)}px`;
                }}
              />

              {/* 左下角：附件按钮（disabled） */}
              <div className="absolute bottom-2 left-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled
                      className="h-7 w-7 text-muted-foreground opacity-40"
                    >
                      <Paperclip size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>附件（即将开放）</TooltipContent>
                </Tooltip>
              </div>

              {/* 右下角：发送按钮 */}
              <div className="absolute bottom-2 right-2">
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="h-7 w-7 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </Button>
              </div>
            </div>
          </form>

          <p className="text-center text-[11px] text-muted-foreground mt-2">
            Enter 换行 · Ctrl+Enter 发送
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}

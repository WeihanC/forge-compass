'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
}

// 把文本节点里的 [N] 替换成蓝色 <sup> 标签
// 递归处理 ReactNode，让 [N] 在任何文本位置都能生效
function renderWithCitations(node: React.ReactNode): React.ReactNode {
  if (typeof node === 'string') {
    const parts = node.split(/(\[\d+\])/g);
    if (parts.length === 1) return node; // 没有 [N]，直接返回

    return parts.map((part, i) => {
      const match = part.match(/^\[(\d+)\]$/);
      if (match) {
        return (
          <sup
            key={i}
            className="text-blue-500 cursor-pointer hover:text-blue-700 text-[11px] font-medium ml-0.5"
            title={`来源 ${match[1]}`}
          >
            [{match[1]}]
          </sup>
        );
      }
      return part;
    });
  }

  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    const children = element.props.children;
    if (children == null) return node;

    const processedChildren = React.Children.map(children, renderWithCitations);
    return React.cloneElement(element, {}, ...(processedChildren ?? []));
  }

  if (Array.isArray(node)) {
    return node.map((child, i) =>
      React.isValidElement(child)
        ? React.cloneElement(renderWithCitations(child) as React.ReactElement, { key: i })
        : renderWithCitations(child),
    );
  }

  return node;
}

// 把 children 里的 citation 标记处理掉，返回 ReactNode
function CitationChildren({ children }: { children?: React.ReactNode }) {
  return <>{renderWithCitations(children)}</>;
}

export function Message({ role, content }: MessageProps) {
  const isUser = role === 'user';

  // 用户消息：普通文本气泡
  if (isUser) {
    return (
      <div className="flex justify-end mb-5">
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl rounded-tr-sm',
            'bg-muted text-foreground',
            'text-[15px] leading-[1.6] whitespace-pre-wrap',
            'max-w-[90%] sm:max-w-[75%]',
          )}
        >
          {content}
        </div>
      </div>
    );
  }

  // assistant 消息：Markdown 渲染 + citation 解析 + 🧭 图标
  return (
    <div className="flex justify-start mb-5 gap-3">
      <span className="text-xl mt-0.5 shrink-0">🧭</span>
      <div className={cn('text-foreground text-[15px] leading-[1.6]', 'max-w-[95%] sm:max-w-[85%]')}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // 段落：在此处处理 citation
            p: ({ children }) => (
              <p className="mb-3 last:mb-0">
                <CitationChildren>{children}</CitationChildren>
              </p>
            ),
            // 列表项也处理 citation
            li: ({ children }) => (
              <li className="text-foreground">
                <CitationChildren>{children}</CitationChildren>
              </li>
            ),
            // 表格
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full text-sm border-collapse border border-border rounded-lg overflow-hidden">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
            th: ({ children }) => (
              <th className="border border-border px-3 py-2 text-left font-semibold text-foreground text-[13px]">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-border px-3 py-2 text-muted-foreground text-[13px]">
                <CitationChildren>{children}</CitationChildren>
              </td>
            ),
            // 代码块
            // react-markdown v9 把 inline code 和 block code 分开处理：
            // - <code> 在 <pre> 里时是 block，否则是 inline
            // 用 className 判断（remark-gfm 给 block code 加 language-* class）
            code: ({ node, children, className, ...props }: {
              node?: unknown;
              children?: React.ReactNode;
              className?: string;
            }) => {
              // 有 language-* className 的是 block code
              const isBlock = className?.startsWith('language-');
              if (isBlock) {
                return (
                  <pre className="bg-muted text-foreground rounded-lg p-4 overflow-x-auto my-3 text-[13px] font-mono leading-relaxed">
                    <code className={className}>{children}</code>
                  </pre>
                );
              }
              return (
                <code
                  className="bg-muted text-foreground px-1 py-0.5 rounded text-[13px] font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            // 无序列表
            ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
            // 有序列表
            ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
            // 标题
            h1: ({ children }) => (
              <h1 className="text-xl font-bold mb-3 mt-5 text-foreground">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold mb-2 mt-4 text-foreground">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-semibold mb-2 mt-3 text-foreground">{children}</h3>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">{children}</strong>
            ),
            // 分割线
            hr: () => <hr className="border-border my-4" />,
            // 块引用
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-border pl-4 py-1 my-3 text-muted-foreground italic">
                {children}
              </blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

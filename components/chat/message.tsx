'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, Copy, ThumbsUp, ThumbsDown, RotateCw, ExternalLink } from 'lucide-react';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
}

type Source = { n: number; title: string; url?: string };

// 把 AI 输出末尾的 "**来源** ..." 块拆出来，返回 { main, sources }
function splitSources(content: string): { main: string; sources: Source[] } {
  // 容忍三种分隔：\n---\n**来源**\n、\n**来源**\n、\n## 来源\n
  const match = content.match(/\n(?:---\s*\n)?(?:\*\*来源\*\*|## 来源|来源)\s*\n([\s\S]*)$/);
  if (!match) return { main: content, sources: [] };

  const block = match[1];
  const sources: Source[] = [];
  for (const line of block.split('\n')) {
    const m = line.match(/^\s*\[(\d+)\]\s*(.+?)(?:\s+[—\-–]\s+(https?:\/\/\S+))?\s*$/);
    if (m) {
      sources.push({
        n: parseInt(m[1], 10),
        title: m[2].trim(),
        url: m[3],
      });
    }
  }

  if (sources.length === 0) return { main: content, sources: [] };
  return { main: content.slice(0, match.index).trimEnd(), sources };
}

// 递归把 [N] 替换为 accent 上标
function renderWithCitations(node: React.ReactNode): React.ReactNode {
  if (typeof node === 'string') {
    const parts = node.split(/(\[\d+\])/g);
    if (parts.length === 1) return node;
    return parts.map((part, i) => {
      const match = part.match(/^\[(\d+)\]$/);
      if (match) {
        return (
          <sup
            key={i}
            className="text-[10.5px] font-semibold ml-0.5 cursor-pointer"
            style={{ color: 'var(--accent)' }}
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
    const processed = React.Children.map(children, renderWithCitations);
    return React.cloneElement(element, {}, ...(processed ?? []));
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

function CitationChildren({ children }: { children?: React.ReactNode }) {
  return <>{renderWithCitations(children)}</>;
}

export function Message({ role, content }: MessageProps) {
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className="py-3.5">
        <div className="max-w-[740px] mx-auto px-6 flex justify-end">
          <div
            className="inline-block max-w-[85%] whitespace-pre-wrap text-ink"
            style={{
              background: 'var(--bubble)',
              borderRadius: '18px',
              padding: '11px 16px',
              fontSize: '14.5px',
              lineHeight: 1.65,
            }}
          >
            {content}
          </div>
        </div>
      </div>
    );
  }

  const { main, sources } = splitSources(content);

  return (
    <div className="py-3.5 group">
      <div className="max-w-[740px] mx-auto px-6">
        {/* ai-head */}
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

        {/* ai-content */}
        <div className="text-ink" style={{ fontSize: '14.5px', lineHeight: 1.75 }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p className="mb-3">
                  <CitationChildren>{children}</CitationChildren>
                </p>
              ),
              h1: ({ children }) => (
                <h3
                  className="font-semibold text-ink"
                  style={{ fontSize: '15.5px', margin: '18px 0 8px' }}
                >
                  <CitationChildren>{children}</CitationChildren>
                </h3>
              ),
              h2: ({ children }) => (
                <h3
                  className="font-semibold text-ink"
                  style={{ fontSize: '15.5px', margin: '18px 0 8px' }}
                >
                  <CitationChildren>{children}</CitationChildren>
                </h3>
              ),
              h3: ({ children }) => (
                <h3
                  className="font-semibold text-ink"
                  style={{ fontSize: '15.5px', margin: '18px 0 8px' }}
                >
                  <CitationChildren>{children}</CitationChildren>
                </h3>
              ),
              ul: ({ children }) => (
                <ul className="list-disc" style={{ paddingLeft: '22px', margin: '0 0 14px' }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol
                  className="list-decimal marker:text-ink-mute marker:font-medium"
                  style={{ paddingLeft: '22px', margin: '0 0 14px' }}
                >
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="marker:text-ink-faint" style={{ marginBottom: '4px' }}>
                  <CitationChildren>{children}</CitationChildren>
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-ink-2">{children}</strong>
              ),
              hr: () => <hr className="border-line my-4" />,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-line pl-4 py-1 my-3 text-ink-mute italic">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full text-[13px] border-collapse border border-line rounded-lg overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-hover">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="border border-line px-3 py-2 text-left font-semibold text-ink text-[13px]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-line px-3 py-2 text-ink-mute text-[13px]">
                  <CitationChildren>{children}</CitationChildren>
                </td>
              ),
              code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
                const isBlock = className?.startsWith('language-');
                if (isBlock) {
                  return (
                    <pre className="bg-hover rounded-lg p-4 overflow-x-auto my-3 text-[13px] font-mono leading-relaxed">
                      <code className={className}>{children}</code>
                    </pre>
                  );
                }
                return (
                  <code className="bg-hover px-1.5 py-0.5 rounded text-[13px] font-mono">
                    {children}
                  </code>
                );
              },
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-[var(--accent)]"
                  style={{ color: 'var(--ink-2)' }}
                >
                  {children}
                </a>
              ),
            }}
          >
            {main}
          </ReactMarkdown>
        </div>

        {/* sources pill 行 */}
        {sources.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-1.5 mt-3.5 pt-3"
            style={{ borderTop: '1px solid var(--line-soft)' }}
          >
            <span className="text-[11.5px] text-ink-faint mr-1">信息来源</span>
            {sources.map((s) => {
              const inner = (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] text-[11.5px] text-ink-mute hover:bg-hover hover:text-ink"
                  style={{
                    border: '1px solid var(--line)',
                    background: 'var(--surface)',
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center font-semibold"
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: 'var(--bubble)',
                      color: 'var(--ink-mute)',
                      fontSize: '9.5px',
                    }}
                  >
                    {s.n}
                  </span>
                  <span className="truncate max-w-[200px]">{s.title}</span>
                  {s.url && <ExternalLink size={10} className="text-ink-faint" />}
                </span>
              );
              if (s.url) {
                return (
                  <a
                    key={s.n}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.url}
                  >
                    {inner}
                  </a>
                );
              }
              return (
                <span key={s.n} title={s.title}>
                  {inner}
                </span>
              );
            })}
          </div>
        )}

        {/* ai-actions（hover 显现） */}
        <AiActions content={main} />
      </div>
    </div>
  );
}

function AiActions({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="flex gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        title={copied ? '已复制' : '复制'}
        onClick={handleCopy}
        className="w-7 h-7 rounded-md text-ink-faint flex items-center justify-center hover:bg-hover hover:text-ink"
      >
        <Copy size={14} />
      </button>
      <button
        title="赞"
        className="w-7 h-7 rounded-md text-ink-faint flex items-center justify-center hover:bg-hover hover:text-ink"
      >
        <ThumbsUp size={14} />
      </button>
      <button
        title="踩"
        className="w-7 h-7 rounded-md text-ink-faint flex items-center justify-center hover:bg-hover hover:text-ink"
      >
        <ThumbsDown size={14} />
      </button>
      <button
        title="重新生成"
        className="w-7 h-7 rounded-md text-ink-faint flex items-center justify-center hover:bg-hover hover:text-ink"
      >
        <RotateCw size={14} />
      </button>
    </div>
  );
}

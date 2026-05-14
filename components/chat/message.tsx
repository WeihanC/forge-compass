'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, Copy, ThumbsUp, ThumbsDown, RotateCw } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type ToolInvocation = { toolName: string; state: string; result?: unknown };
type StoredToolCall = { toolCallId?: string; toolName: string; args?: unknown };
type StoredToolResult = { toolCallId?: string; toolName?: string; result?: unknown };

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  // 实时流式：ai-sdk 直接给的 toolInvocations
  toolInvocations?: ToolInvocation[];
  // 历史回放：从 chat_messages.content 还原的原始 toolCalls / toolResults 对
  toolCalls?: StoredToolCall[];
  toolResults?: StoredToolResult[];
}

// 把 DB 存的 (toolCalls, toolResults) 对还原成 ai-sdk 风格的 toolInvocations
function buildToolInvocations(
  toolCalls?: StoredToolCall[],
  toolResults?: StoredToolResult[],
): ToolInvocation[] {
  if (!toolCalls || toolCalls.length === 0) return [];
  return toolCalls.map((call) => {
    const matched =
      call.toolCallId &&
      toolResults?.find((r) => r.toolCallId && r.toolCallId === call.toolCallId);
    return {
      toolName: call.toolName,
      state: matched ? 'result' : 'call',
      result: matched ? matched.result : undefined,
    };
  });
}

type SourceData = {
  n: number;
  title: string;
  url?: string;
  excerpt?: string;
};

// ─────────────────────────── 工具：从 toolInvocations 里抽 URL→excerpt 映射
function buildExcerptMap(
  invocations?: ToolInvocation[],
): Map<string, { title?: string; excerpt?: string }> {
  const map = new Map<string, { title?: string; excerpt?: string }>();
  if (!invocations) return map;

  for (const inv of invocations) {
    if (inv.state !== 'result' || !inv.result) continue;
    const r = inv.result as { results?: unknown };
    if (!Array.isArray(r.results)) continue;

    if (inv.toolName === 'web_search') {
      for (const item of r.results as Array<{
        title?: string;
        url?: string;
        content?: string;
      }>) {
        if (item.url) {
          map.set(item.url, { title: item.title, excerpt: item.content });
        }
      }
    } else if (inv.toolName === 'search_knowledge_base') {
      for (const item of r.results as Array<{
        title?: string;
        source_url?: string;
        chunk?: string;
      }>) {
        if (item.source_url) {
          map.set(item.source_url, { title: item.title, excerpt: item.chunk });
        }
      }
    }
  }
  return map;
}

// ─────────────────────────── 拆 "**来源** ..." 块
function splitSources(
  content: string,
  excerptMap: Map<string, { title?: string; excerpt?: string }>,
): { main: string; sources: SourceData[] } {
  const match = content.match(
    /\n(?:---\s*\n)?(?:\*\*来源\*\*|## 来源|来源)\s*\n([\s\S]*)$/,
  );
  if (!match) return { main: content, sources: [] };

  const block = match[1];
  const sources: SourceData[] = [];
  for (const line of block.split('\n')) {
    const m = line.match(/^\s*\[(\d+)\]\s*(.+?)(?:\s+[—\-–]\s+(https?:\/\/\S+))?\s*$/);
    if (m) {
      const url = m[3];
      const enriched = url ? excerptMap.get(url) : undefined;
      sources.push({
        n: parseInt(m[1], 10),
        title: enriched?.title ?? m[2].trim(),
        url,
        excerpt: enriched?.excerpt,
      });
    }
  }
  if (sources.length === 0) return { main: content, sources: [] };
  return { main: content.slice(0, match.index).trimEnd(), sources };
}

// ─────────────────────────── 来源预览卡（HoverCard 桌面 / Popover 移动）
function CitePreview({
  source,
  children,
}: {
  source: SourceData;
  children: React.ReactNode;
}) {
  const [canHover, setCanHover] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanHover(window.matchMedia('(hover: hover)').matches);
    }
  }, []);

  if (!source.url) return <>{children}</>;

  const card = (
    <div className="text-left">
      <div className="font-semibold text-ink text-[13px] mb-1.5 leading-snug">
        {source.title || source.url}
      </div>
      {source.excerpt && (
        <div className="text-[12px] text-ink-mute leading-relaxed mb-2">
          {source.excerpt.slice(0, 80)}
          {source.excerpt.length > 80 ? '…' : ''}
        </div>
      )}
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-[11.5px] text-[var(--accent)] hover:underline truncate"
      >
        {source.url}
      </a>
    </div>
  );

  const openUrl = () => {
    if (source.url) window.open(source.url, '_blank', 'noopener,noreferrer');
  };

  // 桌面：hover 弹卡，click 直接开 URL
  if (canHover) {
    return (
      <HoverCard openDelay={150} closeDelay={120}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            onClick={openUrl}
            className="inline-block align-middle cursor-pointer p-0 border-0 bg-transparent"
          >
            {children}
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-3" sideOffset={6}>
          {card}
        </HoverCardContent>
      </HoverCard>
    );
  }

  // 移动：tap 弹 popover（不直接开 URL，卡里有 URL 链接）
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-block align-middle cursor-pointer p-0 border-0 bg-transparent"
        >
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" sideOffset={6}>
        {card}
      </PopoverContent>
    </Popover>
  );
}

// ─────────────────────────── 行内 [N] badge
function InlineCitation({ source }: { source: SourceData }) {
  return (
    <CitePreview source={source}>
      <span
        className="inline-flex items-center justify-center font-semibold align-middle mx-0.5 cursor-pointer transition-transform duration-150 hover:scale-110"
        style={{
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: 'var(--bubble)',
          color: 'var(--ink-mute)',
          fontSize: '9.5px',
        }}
      >
        {source.n}
      </span>
    </CitePreview>
  );
}

// ─────────────────────────── 递归处理 [N] 为 InlineCitation
function renderWithCitations(
  node: React.ReactNode,
  sources: SourceData[],
): React.ReactNode {
  if (typeof node === 'string') {
    const parts = node.split(/(\[\d+\])/g);
    if (parts.length === 1) return node;
    return parts.map((part, i) => {
      const match = part.match(/^\[(\d+)\]$/);
      if (match) {
        const n = parseInt(match[1], 10);
        const source = sources.find((s) => s.n === n);
        if (!source) return part;
        return <InlineCitation key={i} source={source} />;
      }
      return part;
    });
  }
  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    const children = element.props.children;
    if (children == null) return node;
    const processed = React.Children.map(children, (c) =>
      renderWithCitations(c, sources),
    );
    return React.cloneElement(element, {}, ...(processed ?? []));
  }
  if (Array.isArray(node)) {
    return node.map((c, i) =>
      React.isValidElement(c)
        ? React.cloneElement(
            renderWithCitations(c, sources) as React.ReactElement,
            { key: i },
          )
        : renderWithCitations(c, sources),
    );
  }
  return node;
}

// ─────────────────────────── 主组件
export function Message({
  role,
  content,
  toolInvocations,
  toolCalls,
  toolResults,
}: MessageProps) {
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

  // 优先用流式提供的 toolInvocations；历史消息回放时从 toolCalls/toolResults 还原
  const invocations =
    toolInvocations && toolInvocations.length > 0
      ? toolInvocations
      : buildToolInvocations(toolCalls, toolResults);
  const excerptMap = buildExcerptMap(invocations);
  const { main, sources } = splitSources(content, excerptMap);

  const wrap = (children: React.ReactNode) => (
    <>{renderWithCitations(children, sources)}</>
  );

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
              p: ({ children }) => <p className="mb-3">{wrap(children)}</p>,
              h1: ({ children }) => (
                <h3
                  className="font-semibold text-ink"
                  style={{ fontSize: '15.5px', margin: '18px 0 8px' }}
                >
                  {wrap(children)}
                </h3>
              ),
              h2: ({ children }) => (
                <h3
                  className="font-semibold text-ink"
                  style={{ fontSize: '15.5px', margin: '18px 0 8px' }}
                >
                  {wrap(children)}
                </h3>
              ),
              h3: ({ children }) => (
                <h3
                  className="font-semibold text-ink"
                  style={{ fontSize: '15.5px', margin: '18px 0 8px' }}
                >
                  {wrap(children)}
                </h3>
              ),
              ul: ({ children }) => (
                <ul
                  className="list-disc"
                  style={{ paddingLeft: '22px', margin: '0 0 14px' }}
                >
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
                <li
                  className="marker:text-ink-faint"
                  style={{ marginBottom: '4px' }}
                >
                  {wrap(children)}
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
                  {wrap(children)}
                </td>
              ),
              code: ({
                children,
                className,
              }: {
                children?: React.ReactNode;
                className?: string;
              }) => {
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
            {sources.map((s) => (
              <CitePreview key={s.n} source={s}>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] text-[11.5px] text-ink-mute hover:bg-hover hover:text-ink cursor-pointer transition-colors"
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
                </span>
              </CitePreview>
            ))}
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

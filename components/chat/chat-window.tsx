'use client';

import { useCallback, useState } from 'react';
import type { Message as AiMessage } from 'ai/react';
import { Sidebar } from '@/components/chat/sidebar';
import { ChatMain } from '@/components/chat/chat-main';

interface ChatWindowProps {
  userId: string;
  userEmail: string;
}

export function ChatWindow({ userId, userEmail }: ChatWindowProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<AiMessage[]>([]);
  const [switchKey, setSwitchKey] = useState(0);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNewChat = useCallback(() => {
    setConversationId(null);
    setInitialMessages([]);
    setSwitchKey((k) => k + 1);
    setSidebarOpen(false);
  }, []);

  const handleSelectConversation = useCallback(async (id: string) => {
    setSidebarOpen(false);
    if (id === conversationId) return;
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (!res.ok) return;
      const { messages } = (await res.json()) as { messages: AiMessage[] };
      setInitialMessages(messages ?? []);
      setConversationId(id);
      setSwitchKey((k) => k + 1);
    } catch (err) {
      console.warn('load conversation failed:', err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const handleConversationIdAssigned = useCallback((id: string) => {
    setConversationId((prev) => prev ?? id);
    setSidebarRefreshKey((k) => k + 1);
  }, []);

  const handleAssistantFinished = useCallback(() => {
    setSidebarRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-bg text-ink">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <Sidebar
        userEmail={userEmail}
        currentConversationId={conversationId}
        refreshKey={sidebarRefreshKey}
        open={sidebarOpen}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />
      <ChatMain
        key={switchKey}
        conversationId={conversationId}
        initialMessages={initialMessages}
        onConversationIdAssigned={handleConversationIdAssigned}
        onAssistantFinished={handleAssistantFinished}
        onSidebarOpen={() => setSidebarOpen(true)}
      />
    </div>
  );
}

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

  const handleNewChat = useCallback(() => {
    setConversationId(null);
    setInitialMessages([]);
    setSwitchKey((k) => k + 1);
  }, []);

  const handleSelectConversation = useCallback(async (id: string) => {
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
    // 新对话首次拿到 id 后，刷新一次侧栏（让新建对话立刻出现）
    setSidebarRefreshKey((k) => k + 1);
  }, []);

  const handleAssistantFinished = useCallback(() => {
    setSidebarRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-ink">
      <Sidebar
        userEmail={userEmail}
        currentConversationId={conversationId}
        refreshKey={sidebarRefreshKey}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />
      <ChatMain
        key={switchKey}
        conversationId={conversationId}
        initialMessages={initialMessages}
        onConversationIdAssigned={handleConversationIdAssigned}
        onAssistantFinished={handleAssistantFinished}
      />
    </div>
  );
}

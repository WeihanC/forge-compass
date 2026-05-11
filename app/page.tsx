import { Suspense } from 'react';
import { ChatWindow } from '@/components/chat/chat-window';

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-muted-foreground text-[15px]">
          加载中…
        </div>
      }
    >
      <ChatWindow />
    </Suspense>
  );
}

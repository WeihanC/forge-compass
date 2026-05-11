import { Suspense } from 'react';
import { ChatWindow } from '@/components/chat/chat-window';

// useSearchParams 在 App Router 里需要 Suspense 边界
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-slate-400 text-[15px]">
          加载中…
        </div>
      }
    >
      <ChatWindow />
    </Suspense>
  );
}

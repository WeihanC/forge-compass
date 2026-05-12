import { Suspense } from 'react';
import { ChatWindow } from '@/components/chat/chat-window';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-muted-foreground text-[15px]">
          加载中…
        </div>
      }
    >
      <ChatWindow
        userId={user?.id ?? 'anonymous'}
        userEmail={user?.email ?? ''}
      />
    </Suspense>
  );
}

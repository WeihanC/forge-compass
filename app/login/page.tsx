'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm flex flex-col items-center">
        <span className="text-5xl mb-3">🧭</span>
        <h1 className="text-2xl font-bold tracking-tight">出海罗盘</h1>
        <p className="text-sm text-muted-foreground mt-1.5 text-center">
          专为中国宠物用品出海企业家
        </p>

        <div className="w-full mt-10">
          {sent ? (
            <div className="text-sm text-center text-foreground/80 leading-relaxed">
              ✅ 请检查邮箱，点击登录链接进入
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <Button type="submit" disabled={loading || !email} className="w-full">
                {loading ? '发送中…' : '发送登录链接'}
              </Button>
              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

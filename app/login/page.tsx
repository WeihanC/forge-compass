'use client';

import { useState, useEffect } from 'react';
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { NetworkBg } from '@/components/login/network-bg';

const TICKER_POOL = [
  { tag: '情报', text: '亚马逊宠物 Top 100 中国品牌占比同比 +12%', src: 'Helium10' },
  { tag: '合规', text: '加州 Prop 65 新增 3 项化学品', src: 'OEHHA' },
  { tag: '财报', text: 'Chewy Q3 Autoship 收入占比 80.3%', src: 'SEC 10-Q' },
  { tag: '市场', text: '美国宠物食品市场 2024 CAGR 6.2%', src: 'APPA' },
  { tag: '政策', text: 'FDA 加强 FSMA 设施注册抽查', src: 'FDA' },
  { tag: '渠道', text: 'TikTok Shop 美区宠物 GMV 月环比 +18%', src: 'eMarketer' },
  { tag: '竞品', text: 'Petlibro 智能饮水机美国新店上线', src: 'Amazon' },
  { tag: '关税', text: 'HTS 4202 部分子目税率调整', src: 'USITC' },
  { tag: '供应链', text: '山东宠物零食出口同比 +24%', src: '海关总署' },
  { tag: '趋势', text: 'Chewy 推出 vet care 业务，TAM 扩大', src: 'Chewy IR' },
];
const VISIBLE_COUNT = 3;
const ROTATE_MS = 3200;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [tickerBase, setTickerBase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTickerBase((b) => (b + 1) % TICKER_POOL.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const visibleItems = Array.from({ length: VISIBLE_COUNT }, (_, i) =>
    TICKER_POOL[(tickerBase + i) % TICKER_POOL.length],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setLoading(false);
    if (err) setError(err.message);
    else setSent(true);
  }

  return (
    <div className="login-page relative min-h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] bg-[var(--bg)] text-[var(--ink)]">
      {/* 背景：网络节点动画 + vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <NetworkBg color="#4F8EF7" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 22% 35%, color-mix(in oklab, var(--accent) 10%, transparent), transparent 70%), radial-gradient(80% 60% at 100% 100%, rgba(0,0,0,.7), transparent 60%)',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* 左侧：品牌区（移动端隐藏） */}
      <aside className="relative z-10 hidden lg:flex flex-col gap-10 px-14 py-10 min-h-screen">
        {/* 顶部 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
              style={{
                background: 'var(--accent)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)',
              }}
            >
              🧭
            </div>
            <span className="text-base font-semibold tracking-[0.02em]">出海罗盘</span>
          </div>
        </div>

        {/* 中部 */}
        <div className="flex-1 flex flex-col justify-center gap-7 max-w-[600px]">
          <div
            className="inline-flex items-center gap-2.5 font-mono uppercase"
            style={{
              fontSize: '11.5px',
              letterSpacing: '0.16em',
              color: 'var(--ink-mute)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--accent)',
                boxShadow: '0 0 12px var(--accent)',
              }}
            />
            Overseas · Intelligence · AI
          </div>

          <h1
            className="m-0 flex flex-col gap-1.5"
            style={{
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              fontSize: 'clamp(40px, 4.2vw, 64px)',
            }}
          >
            <span style={{ color: 'var(--ink)' }}>把握全球商机</span>
            <span
              style={{
                background:
                  'linear-gradient(110deg, var(--ink) 0%, var(--accent) 60%, var(--ink) 110%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                backgroundSize: '200% 100%',
                animation: 'hero-shine 7s ease-in-out infinite',
              }}
            >
              打破信息差
            </span>
          </h1>

          <p
            className="m-0 max-w-[520px]"
            style={{ color: 'var(--ink-mute)', fontSize: '15px', lineHeight: 1.7 }}
          >
            专为中国宠物用品出海企业家。问 AI 一次决策——市场、合规、渠道、竞品，全部带可验证来源。
          </p>

          {/* Intel ticker（滚动情报） */}
          <div
            className="rounded-[14px] px-4 py-3.5"
            style={{
              border: '1px solid var(--line)',
              background:
                'linear-gradient(180deg, color-mix(in oklab, var(--accent) 4%, transparent), transparent)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* 顶部 meta */}
            <div
              className="flex items-center gap-2.5 pb-2.5"
              style={{ borderBottom: '1px dashed var(--line)' }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: 'var(--accent)',
                  animation: 'intel-pulse 1.6s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: 'var(--ink)',
                }}
              >
                实时情报
              </span>
              <span
                className="ml-auto font-mono uppercase"
                style={{
                  fontSize: '11px',
                  color: 'var(--ink-faint)',
                  letterSpacing: '0.08em',
                }}
              >
                LIVE
              </span>
            </div>

            {/* 滚动条目 */}
            <div className="flex flex-col pt-3 gap-2.5" style={{ minHeight: '108px' }}>
              {visibleItems.map((item, i) => (
                <div
                  key={`${tickerBase}-${i}`}
                  className="grid items-center gap-3"
                  style={{
                    gridTemplateColumns: 'auto 1fr auto',
                    animation: 'intel-fadein 0.55s ease both',
                    animationDelay: `${i * 0.08}s`,
                  }}
                >
                  <span
                    className="font-mono uppercase rounded-md"
                    style={{
                      color: 'var(--accent)',
                      border: '1px solid var(--accent)',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.tag}
                  </span>
                  <span
                    className="truncate"
                    style={{
                      color: 'var(--ink)',
                      fontSize: '13px',
                      lineHeight: 1.5,
                    }}
                  >
                    {item.text}
                  </span>
                  <span
                    className="whitespace-nowrap"
                    style={{
                      color: 'var(--ink-faint)',
                      fontSize: '11.5px',
                      fontWeight: 500,
                    }}
                  >
                    {item.src}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* 右侧：登录卡 */}
      <main className="relative z-10 flex items-center justify-center px-6 sm:px-14 py-10 min-h-screen">
        <div
          className="relative w-full max-w-[440px]"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: '20px',
            padding: '36px 36px 28px',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            boxShadow:
              '0 1px 0 rgba(255,255,255,.06) inset, 0 30px 80px rgba(0,0,0,.45)',
          }}
        >
          {sent ? (
            <div className="flex flex-col items-center text-center py-2">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  border: '1.5px solid var(--accent)',
                  color: 'var(--accent)',
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3 className="m-0 mb-1.5" style={{ fontSize: '20px', fontWeight: 700 }}>
                登录链接已发送
              </h3>
              <p
                className="m-0 mb-5"
                style={{ color: 'var(--ink-mute)', fontSize: '13.5px' }}
              >
                请到 <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{email}</span> 邮箱查收，点击链接即可登录。
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setEmail('');
                }}
                className="rounded-lg"
                style={{
                  background: 'var(--field)',
                  border: '1px solid var(--line)',
                  color: 'var(--ink-mute)',
                  padding: '9px 18px',
                  fontSize: '12.5px',
                }}
              >
                换一个邮箱
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <h2
                  className="m-0 mb-1.5"
                  style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.01em' }}
                >
                  登录
                </h2>
                <p className="m-0" style={{ color: 'var(--ink-mute)', fontSize: '13.5px' }}>
                  输入邮箱，我们给你发一个登录链接。无密码、无注册。
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                <div className="flex flex-col gap-1.5">
                  <label
                    style={{
                      fontSize: '12px',
                      color: 'var(--ink-mute)',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                    }}
                  >
                    邮箱
                  </label>
                  <div
                    className="flex items-center gap-2 rounded-[10px]"
                    style={{
                      background: focused ? 'var(--field-focus)' : 'var(--field)',
                      border: `1px solid ${
                        focused
                          ? 'color-mix(in oklab, var(--accent) 45%, transparent)'
                          : 'var(--line)'
                      }`,
                      padding: '0 12px',
                      boxShadow: focused
                        ? '0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent)'
                        : 'none',
                      transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <Mail size={16} style={{ color: 'var(--ink-faint)' }} />
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      disabled={loading}
                      autoFocus
                      className="flex-1 bg-transparent border-0 outline-none"
                      style={{
                        color: 'var(--ink)',
                        padding: '11px 0',
                        fontSize: '14px',
                        letterSpacing: '0.01em',
                      }}
                    />
                  </div>
                </div>

                {error && (
                  <p
                    style={{
                      fontSize: '11.5px',
                      color: '#EF4444',
                      marginTop: '6px',
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="rounded-[10px] inline-flex items-center justify-center gap-2"
                  style={{
                    background: 'var(--accent)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '14.5px',
                    padding: '13px 16px',
                    marginTop: '14px',
                    boxShadow:
                      '0 8px 24px color-mix(in oklab, var(--accent) 35%, transparent), 0 1px 0 rgba(255,255,255,.18) inset',
                    opacity: loading || !email ? 0.45 : 1,
                    transition: 'transform .15s, box-shadow .2s, opacity .2s',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      发送中…
                    </>
                  ) : (
                    <>
                      发送登录链接
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div
                className="mt-6 pt-4 text-center"
                style={{
                  borderTop: '1px solid var(--line)',
                  fontSize: '12.5px',
                  color: 'var(--ink-mute)',
                }}
              >
                登录即表示同意 <span style={{ color: 'var(--ink)' }}>服务条款</span> 与 <span style={{ color: 'var(--ink)' }}>隐私政策</span>
              </div>
            </>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes hero-shine {
          0%,
          100% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 0%;
          }
        }
        @keyframes intel-pulse {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes intel-fadein {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

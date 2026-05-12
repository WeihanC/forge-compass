import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // Forge Compass 设计 tokens（与 DESIGN.md 一一对应）
        accent: 'var(--accent)',
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'sb-bg': 'var(--sb-bg)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-mute': 'var(--ink-mute)',
        'ink-faint': 'var(--ink-faint)',
        line: 'var(--line)',
        'line-soft': 'var(--line-soft)',
        hover: 'var(--hover)',
        bubble: 'var(--bubble)',
        'send-ink': 'var(--send-ink)',

        // shadcn 兼容（Button、ScrollArea 等）
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};

export default config;

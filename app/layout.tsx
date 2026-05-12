import type { Metadata } from 'next';
import { Inter, Noto_Sans_SC, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '出海罗盘',
  description: '为中国宠物用品出海企业家提供决策辅助的 AI 助手',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${notoSansSC.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header, Footer } from '@/components/layout';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'NOVA FLOW',
  description: 'Production-ready modern blog platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header />
          <main className="mx-auto w-full max-w-7xl px-4 py-8">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

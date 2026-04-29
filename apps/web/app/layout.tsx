import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header, Footer } from '@/components/layout';

const Toaster = dynamic(() => import('sonner').then((mod) => mod.Toaster), { ssr: false });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'NOVA FLOW',
  description: 'Production-ready modern blog platform',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'NOVA FLOW',
    title: 'NOVA FLOW',
    description: 'Production-ready modern blog platform',
    locale: 'vi_VN'
  },
  twitter: {
    card: 'summary_large_image'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
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

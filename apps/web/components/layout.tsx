import Link from 'next/link';
import { Search } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { HeaderAuthActions } from './auth/header-auth-actions';
import { MobileMenu } from './mobile-menu';

const navItems = [
  { href: '/', label: 'Khám phá' },
  { href: '/categories/engineering', label: 'Chủ đề' },
  { href: '/search', label: 'Tìm kiếm' },
  { href: '/about', label: 'Giới thiệu' }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/70">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 md:gap-6">
        <Link href="/" className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-lg font-extrabold text-transparent md:text-2xl">
          NOVA FLOW
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-zinc-600 transition hover:text-blue-600 dark:text-zinc-300">
              {item.label}
            </Link>
          ))}
        </nav>

        <form action="/search" method="GET" className="ml-auto hidden items-center gap-2 rounded-2xl border border-blue-100 bg-white/90 px-3 py-2 md:flex dark:border-zinc-800 dark:bg-zinc-900">
          <Search size={16} className="text-zinc-400" />
          <input
            aria-label="Search"
            name="q"
            className="w-56 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            placeholder="Tìm bài viết, chủ đề..."
          />
        </form>

        <MobileMenu navItems={navItems} />
        <ThemeToggle />
        <HeaderAuthActions />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-200/80 bg-white/70 dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent">NOVA FLOW</p>
          <p className="mt-2 text-sm text-zinc-500">Nền tảng blog hiện đại cho Engineering, Product, Lifestyle.</p>
        </div>
        <div className="text-sm text-zinc-500">
          <p className="mb-2 font-semibold text-zinc-700 dark:text-zinc-200">Quick links</p>
          <div className="space-y-1">
            <Link href="/" className="block transition hover:text-blue-600">Home</Link>
            <Link href="/categories/engineering" className="block transition hover:text-blue-600">Categories</Link>
            <Link href="/about" className="block transition hover:text-blue-600">About</Link>
            <Link href="/search" className="block transition hover:text-blue-600">Search</Link>
          </div>
        </div>
        <div className="text-sm text-zinc-500">
          <p className="mb-2 font-semibold text-zinc-700 dark:text-zinc-200">Social</p>
          <p>X / LinkedIn / GitHub</p>
          <p className="mt-4">© {new Date().getFullYear()} Nova Flow.</p>
        </div>
      </div>
    </footer>
  );
}

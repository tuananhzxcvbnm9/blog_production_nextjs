'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { HeaderAuthActions } from './auth/header-auth-actions';

export function MobileMenu({ navItems }: { navItems: Array<{ href: string; label: string }> }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="md:hidden">
      <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-xl border border-zinc-200 p-2 dark:border-zinc-700" aria-label="Toggle menu">
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      {open && (
        <div className="absolute left-4 right-4 top-16 z-50 rounded-2xl border bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-1 text-sm">
                {item.label}
              </Link>
            ))}
          </nav>
          <form action="/search" method="GET" className="mt-3 flex items-center gap-2 rounded-xl border px-3 py-2">
            <Search size={14} className="text-zinc-400" />
            <input name="q" className="w-full bg-transparent text-sm outline-none" placeholder="Tìm kiếm..." />
          </form>
          <div className="mt-3">
            <HeaderAuthActions />
          </div>
        </div>
      )}
    </div>
  );
}

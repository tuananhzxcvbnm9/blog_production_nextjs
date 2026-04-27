import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/posts/new', label: 'New post' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/tags', label: 'Tags' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/settings', label: 'Settings' }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || !['ADMIN', 'EDITOR'].includes(session.role)) redirect('/forbidden');

  return (
    <div className="grid gap-6 md:grid-cols-[260px_1fr]">
      <aside className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Admin navigation</p>
        {navItems.map((item) => (
          <Link
            className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}

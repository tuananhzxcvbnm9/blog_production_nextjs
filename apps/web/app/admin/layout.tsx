import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || !['ADMIN', 'EDITOR'].includes(session.role)) redirect('/forbidden');

  return <div className="grid gap-6 md:grid-cols-[240px_1fr]"><aside className="space-y-2 rounded-2xl border p-4">{['/admin','/admin/posts','/admin/posts/new','/admin/categories','/admin/tags','/admin/media','/admin/users','/admin/settings'].map((path)=><Link className="block rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" href={path} key={path}>{path.split('/').pop() || 'dashboard'}</Link>)}</aside><div>{children}</div></div>;
}

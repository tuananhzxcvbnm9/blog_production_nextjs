import { FilePenLine, FileText, Image as ImageIcon, Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [totalPosts, published, draft, categories, media] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.category.count(),
    prisma.media.count()
  ]);

  const stats = [
    { label: 'Total posts', value: totalPosts },
    { label: 'Published', value: published },
    { label: 'Draft', value: draft },
    { label: 'Categories', value: categories },
    { label: 'Media', value: media }
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-zinc-500">Quản trị nội dung, workflow biên tập và tối ưu SEO cho toàn bộ blog.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white">5</div>
          <FilePenLine className="text-indigo-600" size={24} />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Content & Editor</h2>
        </div>

        <ul className="mt-4 space-y-3 text-base text-zinc-700 dark:text-zinc-300">
          <li className="flex items-center gap-3"><FileText size={18} className="text-indigo-500" />Markdown / MDX hoặc Rich text editor</li>
          <li className="flex items-center gap-3"><ImageIcon size={18} className="text-indigo-500" />Image upload</li>
          <li className="flex items-center gap-3"><FileText size={18} className="text-indigo-500" />Draft / Publish workflow</li>
          <li className="flex items-center gap-3"><Search size={18} className="text-indigo-500" />SEO metadata</li>
        </ul>
      </section>
    </div>
  );
}

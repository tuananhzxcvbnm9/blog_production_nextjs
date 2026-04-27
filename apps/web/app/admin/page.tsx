import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [totalPosts, published, draft, categories, media] = await Promise.all([
    prisma.post.count(), prisma.post.count({ where: { status: 'PUBLISHED' } }), prisma.post.count({ where: { status: 'DRAFT' } }), prisma.category.count(), prisma.media.count()
  ]);
  return <div className="space-y-4"><h1 className="text-3xl font-bold">Dashboard</h1><div className="grid gap-3 md:grid-cols-3">{[{l:'Total posts',v:totalPosts},{l:'Published',v:published},{l:'Draft',v:draft},{l:'Categories',v:categories},{l:'Media',v:media},{l:'Views',v:0}].map((c)=><div key={c.l} className="rounded-xl border p-4"><p className="text-sm">{c.l}</p><p className="text-2xl font-bold">{c.v}</p></div>)}</div></div>;
}

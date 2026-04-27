import { prisma } from '@/lib/prisma';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q || '';
  const results = q
    ? await prisma.post.findMany({ where: { status: 'PUBLISHED', OR: [{ title: { contains: q, mode: 'insensitive' } }, { excerpt: { contains: q, mode: 'insensitive' } }] }, include: { category: true, author: true }, take: 20 })
    : [];
  return <div><h1 className="text-3xl font-bold">Search</h1><form className="my-4"><input name="q" defaultValue={q} className="w-full rounded-xl border px-4 py-2" placeholder="Search posts..."/></form><p className="mb-3 text-sm">{results.length} results</p><div className="grid gap-3">{results.map((r)=><a key={r.id} href={`/posts/${r.slug}`} className="rounded-xl border p-4">{r.title}</a>)}</div></div>;
}

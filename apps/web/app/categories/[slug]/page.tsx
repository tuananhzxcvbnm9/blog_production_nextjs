import { cache } from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/post-card';
import { publicPostSelect } from '@/lib/queries';
import { getReadingTime } from '@/lib/reading-time';
import { Breadcrumbs } from '@/components/breadcrumbs';

const getCategory = cache(async (slug: string) => prisma.category.findUnique({ where: { slug } }));

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> { const category = await getCategory(params.slug); if (!category) return { title: 'Category not found — NOVA FLOW' }; const description = category.description || `Posts in ${category.name}`; const title = `${category.name} — NOVA FLOW`; return { title, description, openGraph: { title, description } }; }

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug); if (!category) notFound();
  const posts = await prisma.post.findMany({ where: { categoryId: category.id, status: 'PUBLISHED' }, select: publicPostSelect, orderBy: { publishedAt: 'desc' } });
  const mapped = posts.map((post) => ({ ...post, readingTime: getReadingTime(post.content) }));
  return <div className="space-y-6"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Categories', href: '/categories/engineering' }, { label: category.name }]} /><h1 className="text-3xl font-bold">{category.name}</h1><p className="text-zinc-500">{category.description}</p><p className="text-sm text-zinc-500">{mapped.length} bài viết</p><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{mapped.map((post) => <PostCard key={post.id} post={post} />)}</div></div>;
}

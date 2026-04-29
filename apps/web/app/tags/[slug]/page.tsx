import { cache } from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/post-card';
import { publicPostSelect } from '@/lib/queries';
import { getReadingTime } from '@/lib/reading-time';
import { Breadcrumbs } from '@/components/breadcrumbs';

const getTag = cache(async (slug: string) => prisma.tag.findUnique({ where: { slug } }));

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> { const tag = await getTag(params.slug); if (!tag) return { title: 'Tag not found — NOVA FLOW' }; const title = `#${tag.name} — NOVA FLOW`; const description = `Posts tagged ${tag.name}`; return { title, description, openGraph: { title, description } }; }

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tag = await getTag(params.slug); if (!tag) notFound();
  const posts = await prisma.post.findMany({ where: { status: 'PUBLISHED', tags: { some: { tagId: tag.id } } }, select: publicPostSelect, orderBy: { publishedAt: 'desc' } });
  const mapped = posts.map((post) => ({ ...post, readingTime: getReadingTime(post.content) }));
  return <div className="space-y-6"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Tags', href: '/tags' }, { label: `#${tag.name}` }]} /><h1 className="text-3xl font-bold">#{tag.name}</h1><p className="text-sm text-zinc-500">{mapped.length} bài viết</p><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{mapped.map((post) => <PostCard key={post.id} post={post} />)}</div></div>;
}

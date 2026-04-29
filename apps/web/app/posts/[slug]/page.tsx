import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { renderMarkdown } from '@/lib/markdown';
import { getReadingTime } from '@/lib/reading-time';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ViewTracker } from '@/components/view-tracker';

export const revalidate = 3600;

const getPost = cache(async (slug: string) => prisma.post.findUnique({ where: { slug }, include: { category: true, author: true, tags: { include: { tag: true } } } }));

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true } });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post || post.status !== 'PUBLISHED') return { title: 'Post not found' };
  return { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt, alternates: { canonical: `/posts/${post.slug}` }, openGraph: { title: post.title, description: post.seoDescription || post.excerpt, images: post.ogImageUrl ? [post.ogImageUrl] : [] } };
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post || post.status !== 'PUBLISHED') notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const image = post.ogImageUrl || post.coverImageUrl || undefined;
  const html = await renderMarkdown(post.content);
  const readingTime = getReadingTime(post.content);
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.seoDescription || post.excerpt, ...(image ? { image } : {}), datePublished: post.publishedAt, dateModified: post.updatedAt, mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/posts/${post.slug}` }, author: { '@type': 'Person', name: post.author.name }, publisher: { '@type': 'Organization', name: 'NOVA FLOW' } };
  return <article className="mx-auto max-w-3xl"><ViewTracker slug={post.slug} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: post.category.name, href: `/categories/${post.category.slug}` }, { label: post.title }]} /><p className="text-sm text-blue-600">{post.category.name}</p><h1 className="text-4xl font-bold">{post.title}</h1><p className="mt-2 text-zinc-500">{post.excerpt}</p><p className="mt-2 text-sm text-zinc-500">{readingTime} phút đọc</p><div className="prose mt-8 dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} /></article>;
}

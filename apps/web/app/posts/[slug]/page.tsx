import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.post.findUnique({ where: { slug: params.slug }, include: { author: true } });
  if (!post) return { title: 'Post not found' };
  return { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt, openGraph: { title: post.title, images: post.ogImageUrl ? [post.ogImageUrl] : [] } };
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug }, include: { category: true, author: true, tags: { include: { tag: true } } } });
  if (!post || post.status !== 'PUBLISHED') notFound();
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, datePublished: post.publishedAt, author: { '@type': 'Person', name: post.author.name } };
  return <article className="mx-auto max-w-3xl"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><p className="text-sm text-blue-600">{post.category.name}</p><h1 className="text-4xl font-bold">{post.title}</h1><p className="mt-2 text-zinc-500">{post.excerpt}</p><div className="prose mt-8" dangerouslySetInnerHTML={{__html: post.content.replaceAll('\n','<br/>')}} /></article>;
}

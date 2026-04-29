import { prisma } from '@/lib/prisma';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const [posts, categories, tags, authors] = await Promise.all([
    prisma.post.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.tag.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.user.findMany({ select: { name: true, updatedAt: true } })
  ]);

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/search`, lastModified: new Date() },
    ...posts.map((post) => ({ url: `${base}/posts/${post.slug}`, lastModified: post.updatedAt })),
    ...categories.map((category) => ({ url: `${base}/categories/${category.slug}`, lastModified: category.updatedAt })),
    ...tags.map((tag) => ({ url: `${base}/tags/${tag.slug}`, lastModified: tag.updatedAt })),
    ...authors.map((author) => ({ url: `${base}/authors/${encodeURIComponent(author.name)}`, lastModified: author.updatedAt }))
  ];
}

import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { searchQuerySchema, toValidationError } from '@/lib/validators';

const publicPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImageUrl: true,
  publishedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true
    }
  },
  author: {
    select: {
      id: true,
      name: true,
      avatarUrl: true
    }
  }
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = searchQuerySchema.safeParse({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || undefined,
    tag: searchParams.get('tag') || undefined,
    page: searchParams.get('page') || 1
  });

  if (!parsed.success) return NextResponse.json(toValidationError(parsed.error), { status: 400 });

  const { category, tag, page } = parsed.data;
  const q = parsed.data.q.trim();
  const pageSize = 10;

  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      ...(category ? { category: { slug: category } } : {}),
      ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { excerpt: { contains: q, mode: 'insensitive' } },
              { content: { contains: q, mode: 'insensitive' } }
            ]
          }
        : {})
    },
    select: publicPostSelect,
    skip: (page - 1) * pageSize,
    take: pageSize + 1,
    orderBy: { publishedAt: 'desc' }
  });

  const hasMore = posts.length > pageSize;
  return NextResponse.json({ data: hasMore ? posts.slice(0, pageSize) : posts, nextPage: hasMore ? page + 1 : null });
}

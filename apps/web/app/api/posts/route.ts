import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { paginationQuerySchema, toValidationError } from '@/lib/validators';

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
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  }
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || undefined;
  const parsed = paginationQuerySchema.safeParse({ page: searchParams.get('page') ?? 1 });
  if (!parsed.success) return NextResponse.json(toValidationError(parsed.error), { status: 400 });

  const page = parsed.data.page;
  const pageSize = 12;
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      ...(category ? { category: { name: category } } : {})
    },
    select: publicPostSelect,
    orderBy: { publishedAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize + 1
  });

  const hasMore = posts.length > pageSize;
  return NextResponse.json({ data: hasMore ? posts.slice(0, pageSize) : posts, nextPage: hasMore ? page + 1 : null });
}

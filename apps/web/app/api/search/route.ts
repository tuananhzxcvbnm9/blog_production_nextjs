import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const searchQuerySchema = z.object({
  q: z.string().max(200).default(''),
  category: z.string().max(100).optional(),
  tag: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1)
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = searchQuerySchema.safeParse({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || undefined,
    tag: searchParams.get('tag') || undefined,
    page: searchParams.get('page') || 1
  });

  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { q, category, tag, page } = parsed.data;
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
    include: { category: true, author: true },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { publishedAt: 'desc' }
  });

  return NextResponse.json({ data: posts, nextPage: posts.length === pageSize ? page + 1 : null });
}

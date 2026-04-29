import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchQuerySchema, toValidationError } from '@/lib/validators';
import { getReadingTime } from '@/lib/reading-time';
import { publicPostSelect } from '@/lib/queries';

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
  const data = (hasMore ? posts.slice(0, pageSize) : posts).map((post) => ({ ...post, readingTime: getReadingTime(post.content) }));
  return NextResponse.json({ data, nextPage: hasMore ? page + 1 : null }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
  });
}

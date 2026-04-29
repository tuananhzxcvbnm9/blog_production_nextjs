import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { paginationQuerySchema, toValidationError } from '@/lib/validators';
import { getReadingTime } from '@/lib/reading-time';
import { publicPostSelect } from '@/lib/queries';

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
  const data = (hasMore ? posts.slice(0, pageSize) : posts).map((post) => ({ ...post, readingTime: getReadingTime(post.content) }));
  return NextResponse.json({ data, nextPage: hasMore ? page + 1 : null }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
  });
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { paginationQuerySchema } from '@/lib/validators';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = paginationQuerySchema.safeParse({ page: searchParams.get('page') ?? 1 });
  if (!parsed.success) return NextResponse.json({ error: 'Invalid page query' }, { status: 400 });

  const page = parsed.data.page;
  const pageSize = 12;
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true, author: true, tags: { include: { tag: true } } },
    orderBy: { publishedAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize
  });

  return NextResponse.json({ data: posts, nextPage: posts.length === pageSize ? page + 1 : null });
}

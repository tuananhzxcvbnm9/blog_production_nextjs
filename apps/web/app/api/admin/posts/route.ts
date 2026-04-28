import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { postSchema } from '@/lib/validators';
import { requireRole } from '@/lib/auth';

export async function GET() {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    const posts = await prisma.post.findMany({
      include: { author: true, category: true, tags: { include: { tag: true } } },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireRole(['ADMIN', 'EDITOR']);
    const parsed = postSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { tagIds, publishedAt, ...payload } = parsed.data;
    const post = await prisma.post.create({
      data: {
        ...payload,
        coverImageUrl: payload.coverImageUrl || null,
        ogImageUrl: payload.ogImageUrl || null,
        authorId: session.userId,
        publishedAt: publishedAt ? new Date(publishedAt) : payload.status === 'PUBLISHED' ? new Date() : null,
        tags: { create: tagIds.map((tagId) => ({ tagId })) }
      }
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug đã tồn tại. Vui lòng đổi tiêu đề khác.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Không thể tạo bài viết. Vui lòng thử lại.' }, { status: 500 });
  }
}

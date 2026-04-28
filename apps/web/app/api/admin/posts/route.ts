import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { parseJsonBody, postSchema, toValidationError } from '@/lib/validators';
import { requireRole } from '@/lib/auth';
import { handleAdminError } from '@/app/api/admin/_helpers';

const adminPostListSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  slug: true,
  status: true,
  featured: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  author: { select: { id: true, name: true, email: true, role: true, status: true } },
  tags: { select: { tag: { select: { id: true, name: true, slug: true } } } }
});

export async function GET() {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    const posts = await prisma.post.findMany({
      select: adminPostListSelect,
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(posts);
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireRole(['ADMIN', 'EDITOR']);
    const parsed = postSchema.safeParse(await parseJsonBody(req));
    if (!parsed.success) {
      return NextResponse.json(toValidationError(parsed.error), { status: 400 });
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
    return handleAdminError(error, {
      conflictMessage: 'Slug đã tồn tại. Vui lòng đổi tiêu đề khác.',
      internalMessage: 'Không thể tạo bài viết. Vui lòng thử lại.'
    });
  }
}

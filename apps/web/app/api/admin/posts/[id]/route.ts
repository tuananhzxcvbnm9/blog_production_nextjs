import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { parseJsonBody, postSchema, toValidationError } from '@/lib/validators';
import { requireRole } from '@/lib/auth';
import { handleAdminError } from '@/app/api/admin/_helpers';

const adminPostDetailSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  status: true,
  featured: true,
  seoTitle: true,
  seoDescription: true,
  coverImageUrl: true,
  ogImageUrl: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  categoryId: true,
  authorId: true,
  tags: { select: { tagId: true } }
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      select: adminPostDetailSelect
    });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    const parsed = postSchema.partial().safeParse(await parseJsonBody(req));
    if (!parsed.success) return NextResponse.json(toValidationError(parsed.error), { status: 400 });

    const { tagIds, publishedAt, ...payload } = parsed.data as any;

    const post = await prisma.$transaction(async (tx) => {
      if (tagIds) {
        await tx.postTag.deleteMany({ where: { postId: params.id } });
        if (tagIds.length > 0) {
          await tx.postTag.createMany({ data: tagIds.map((tagId: string) => ({ postId: params.id, tagId })) });
        }
      }

      return tx.post.update({
        where: { id: params.id },
        data: { ...payload, publishedAt: publishedAt ? new Date(publishedAt) : undefined },
        select: adminPostDetailSelect
      });
    });

    return NextResponse.json(post);
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAdminError(error);
  }
}

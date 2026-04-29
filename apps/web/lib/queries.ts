import { Prisma } from '@prisma/client';

export const publicPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  content: true,
  coverImageUrl: true,
  publishedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  author: { select: { id: true, name: true, avatarUrl: true } },
  tags: { select: { tag: { select: { id: true, name: true, slug: true } } } }
});

export type PublicPost = Prisma.PostGetPayload<{ select: typeof publicPostSelect }>;

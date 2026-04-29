import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug }, select: { id: true } });
  if (!post) return NextResponse.json({ ok: true });

  const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const ipHash = createHash('sha256').update(rawIp).digest('hex');
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existing = await prisma.postView.findFirst({ where: { postId: post.id, ipHash, createdAt: { gte: since } } });

  if (!existing) {
    await prisma.postView.create({ data: { postId: post.id, ipHash, userAgent: request.headers.get('user-agent') || undefined } });
  }

  return NextResponse.json({ ok: true });
}

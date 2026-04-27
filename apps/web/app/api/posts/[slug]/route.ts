import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET(_: Request, { params }: { params: { slug: string } }) { const post = await prisma.post.findUnique({ where: { slug: params.slug }, include: { category: true, author: true, tags: { include: { tag: true } } } }); if (!post || post.status !== 'PUBLISHED') return NextResponse.json({ error: 'Not found' }, { status: 404 }); return NextResponse.json(post); }

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() { const tags = await prisma.tag.findMany({ include: { _count: { select: { posts: true } } } }); return NextResponse.json(tags, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }); }

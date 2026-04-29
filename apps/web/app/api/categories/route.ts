import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() { const categories = await prisma.category.findMany({ include: { _count: { select: { posts: true } } } }); return NextResponse.json(categories, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }); }

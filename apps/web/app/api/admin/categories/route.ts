import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { categorySchema } from '@/lib/validators';

export async function GET() {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    return NextResponse.json(await prisma.category.findMany({ include: { _count: { select: { posts: true } } } }));
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    const parsed = categorySchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    return NextResponse.json(await prisma.category.create({ data: parsed.data }), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

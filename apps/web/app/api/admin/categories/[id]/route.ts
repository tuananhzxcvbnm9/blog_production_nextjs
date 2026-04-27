import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { categorySchema } from '@/lib/validators';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    const parsed = categorySchema.partial().safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    return NextResponse.json(await prisma.category.update({ where: { id: params.id }, data: parsed.data }));
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

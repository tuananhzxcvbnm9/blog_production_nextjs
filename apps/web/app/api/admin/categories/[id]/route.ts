import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { categorySchema, parseJsonBody, toValidationError } from '@/lib/validators';
import { handleAdminError } from '@/app/api/admin/_helpers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    const parsed = categorySchema.partial().safeParse(await parseJsonBody(req));
    if (!parsed.success) return NextResponse.json(toValidationError(parsed.error), { status: 400 });
    return NextResponse.json(await prisma.category.update({ where: { id: params.id }, data: parsed.data }));
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAdminError(error);
  }
}

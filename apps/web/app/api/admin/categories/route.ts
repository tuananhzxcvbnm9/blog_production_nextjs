import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { categorySchema, parseJsonBody, toValidationError } from '@/lib/validators';
import { handleAdminError } from '@/app/api/admin/_helpers';

export async function GET() {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    return NextResponse.json(await prisma.category.findMany({ include: { _count: { select: { posts: true } } }, orderBy: { name: 'asc' } }));
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    const parsed = categorySchema.safeParse(await parseJsonBody(req));
    if (!parsed.success) return NextResponse.json(toValidationError(parsed.error), { status: 400 });
    return NextResponse.json(await prisma.category.create({ data: parsed.data }), { status: 201 });
  } catch (error) {
    return handleAdminError(error, { conflictMessage: 'Slug danh mục đã tồn tại' });
  }
}

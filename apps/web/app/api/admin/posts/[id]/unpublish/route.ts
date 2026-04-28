import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { handleAdminError } from '@/app/api/admin/_helpers';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    await prisma.post.update({
      where: { id: params.id },
      data: { status: 'DRAFT' }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAdminError(error);
  }
}

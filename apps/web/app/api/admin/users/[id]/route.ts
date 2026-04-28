import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { parseJsonBody, toValidationError, userUpdateSchema } from '@/lib/validators';
import { handleAdminError } from '@/app/api/admin/_helpers';

const adminUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  bio: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN']);
    const parsed = userUpdateSchema.safeParse(await parseJsonBody(req));
    if (!parsed.success) return NextResponse.json(toValidationError(parsed.error), { status: 400 });
    return NextResponse.json(await prisma.user.update({ where: { id: params.id }, data: parsed.data, select: adminUserSelect }));
  } catch (error) {
    return handleAdminError(error);
  }
}

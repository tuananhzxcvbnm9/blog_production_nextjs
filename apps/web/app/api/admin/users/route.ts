import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { parseJsonBody, toValidationError, userCreateSchema } from '@/lib/validators';
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

export async function GET() {
  try {
    await requireRole(['ADMIN']);
    return NextResponse.json(await prisma.user.findMany({ select: adminUserSelect, orderBy: { createdAt: 'desc' } }));
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireRole(['ADMIN']);
    const parsed = userCreateSchema.safeParse(await parseJsonBody(req));
    if (!parsed.success) return NextResponse.json(toValidationError(parsed.error), { status: 400 });

    const { password, ...rest } = parsed.data;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { ...rest, passwordHash }, select: adminUserSelect });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return handleAdminError(error, { conflictMessage: 'Email đã tồn tại' });
  }
}

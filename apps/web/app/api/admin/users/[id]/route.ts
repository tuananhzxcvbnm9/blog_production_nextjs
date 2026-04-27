import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { userUpdateSchema } from '@/lib/validators';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN']);
    const parsed = userUpdateSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    return NextResponse.json(await prisma.user.update({ where: { id: params.id }, data: parsed.data }));
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

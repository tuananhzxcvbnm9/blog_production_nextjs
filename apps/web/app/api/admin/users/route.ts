import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { userCreateSchema } from '@/lib/validators';

export async function GET() {
  try {
    await requireRole(['ADMIN']);
    return NextResponse.json(await prisma.user.findMany({ orderBy: { createdAt: 'desc' } }));
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireRole(['ADMIN']);
    const parsed = userCreateSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const { password, ...rest } = parsed.data;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { ...rest, passwordHash } });
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

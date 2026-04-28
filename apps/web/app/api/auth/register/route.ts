import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { parseJsonBody, registerSchema, toValidationError } from '@/lib/validators';

export async function POST(req: Request) {
  const parsed = registerSchema.safeParse(await parseJsonBody(req));
  if (!parsed.success) {
    return NextResponse.json(toValidationError(parsed.error), { status: 400 });
  }

  const normalizedEmail = parsed.data.email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'AUTHOR',
      status: 'ACTIVE'
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    }
  });

  return NextResponse.json({ ok: true, user }, { status: 201 });
}

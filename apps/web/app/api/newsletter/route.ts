import { NextResponse } from 'next/server';
import { z } from 'zod';
import { toValidationError } from '@/lib/validators';
import { prisma } from '@/lib/prisma';

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || '';
  let payload: unknown = {};

  if (contentType.includes('application/json')) {
    payload = await req.json().catch(() => ({}));
  } else {
    const formData = await req.formData().catch(() => null);
    payload = { email: formData?.get('email') };
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) return NextResponse.json(toValidationError(parsed.error), { status: 400 });

  const newsletter = await prisma.newsletter.upsert({
    where: { email: parsed.data.email },
    update: {},
    create: { email: parsed.data.email }
  });

  return NextResponse.json({ ok: true, subscribedAt: newsletter.createdAt.toISOString() });
}

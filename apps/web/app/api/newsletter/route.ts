import { NextResponse } from 'next/server';
import { z } from 'zod';

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
  if (!parsed.success) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });

  return NextResponse.json({ ok: true, subscribedAt: new Date().toISOString() });
}

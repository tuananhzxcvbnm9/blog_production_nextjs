import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators';
import { loginWithEmailPassword, setSessionCookie, signSession } from '@/lib/auth';

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const user = await loginWithEmailPassword(parsed.data.email, parsed.data.password);
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  await setSessionCookie(signSession({ userId: user.id, role: user.role, email: user.email }));
  return NextResponse.json({ ok: true });
}

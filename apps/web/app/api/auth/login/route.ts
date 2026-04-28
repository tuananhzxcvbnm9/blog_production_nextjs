import { NextResponse } from 'next/server';
import { loginSchema, parseJsonBody, toValidationError } from '@/lib/validators';
import { loginWithEmailPassword, setSessionCookie, signSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await parseJsonBody(req);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(toValidationError(parsed.error), { status: 400 });
    }

    const user = await loginWithEmailPassword(parsed.data.email, parsed.data.password);
    if (!user) {
      return NextResponse.json({ error: 'Sai email hoặc mật khẩu' }, { status: 401 });
    }

    await setSessionCookie(signSession({ userId: user.id, role: user.role, email: user.email }));

    return NextResponse.json({
      ok: true,
      user: {
        userId: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch {
    return NextResponse.json({ error: 'Không thể đăng nhập lúc này' }, { status: 500 });
  }
}

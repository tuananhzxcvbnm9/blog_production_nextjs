import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Không thể đăng xuất lúc này' }, { status: 500 });
  }
}

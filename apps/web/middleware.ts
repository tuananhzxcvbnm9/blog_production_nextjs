import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/admin')) return NextResponse.next();
  const token = req.cookies.get('blog_session')?.value;
  if (!token) return NextResponse.redirect(new URL('/unauthorized', req.url));
  try {
    const payload = jwt.verify(token, process.env.AUTH_SECRET || 'dev-secret') as { role?: string };
    if (!payload.role || !['ADMIN', 'EDITOR'].includes(payload.role)) return NextResponse.redirect(new URL('/forbidden', req.url));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
}

export const config = { matcher: ['/admin/:path*'] };

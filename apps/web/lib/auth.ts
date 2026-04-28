import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { UserRole } from '@prisma/client';
import { prisma } from './prisma';

const COOKIE_NAME = 'blog_session';

export type SessionPayload = { userId: string; role: UserRole; email: string };

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.trim().length > 0) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET_MISSING');
  }
  return 'dev-secret';
}

export async function loginWithEmailPassword(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user || user.status !== 'ACTIVE') return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  return user;
}

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, getAuthSecret(), {
    expiresIn: '7d'
  });
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, getAuthSecret()) as SessionPayload;
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, status: true }
    });
    if (!user || user.status !== 'ACTIVE') return null;
    return { userId: user.id, email: user.email, role: user.role };
  } catch {
    return null;
  }
}

export async function requireRole(roles: UserRole[]) {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  if (!roles.includes(session.role)) {
    throw new Error('FORBIDDEN');
  }
  return session;
}

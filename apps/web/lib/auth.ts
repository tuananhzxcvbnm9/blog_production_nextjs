import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { UserRole } from '@prisma/client';
import { prisma } from './prisma';

const COOKIE_NAME = 'blog_session';

export type SessionPayload = { userId: string; role: UserRole; email: string };

export async function loginWithEmailPassword(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user || user.status !== 'ACTIVE') return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  return user;
}

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, process.env.AUTH_SECRET || 'dev-secret', {
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
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.AUTH_SECRET || 'dev-secret') as SessionPayload;
  } catch {
    return null;
  }
}

export async function requireRole(roles: UserRole[]) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) {
    throw new Error('FORBIDDEN');
  }
  return session;
}

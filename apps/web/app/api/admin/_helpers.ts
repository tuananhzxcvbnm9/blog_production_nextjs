import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

type ErrorOptions = {
  internalMessage?: string;
  conflictMessage?: string;
  notFoundMessage?: string;
};

export function handleAdminError(error: unknown, options: ErrorOptions = {}) {
  if (error instanceof Error && error.message === 'UNAUTHORIZED') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (error instanceof Error && error.message === 'FORBIDDEN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: options.conflictMessage || 'Conflict' }, { status: 409 });
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: options.notFoundMessage || 'Not found' }, { status: 404 });
    }
  }
  return NextResponse.json({ error: options.internalMessage || 'Internal server error' }, { status: 500 });
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { mediaCompleteSchema, parseJsonBody, toValidationError } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['ADMIN', 'EDITOR', 'AUTHOR']);
    const parsed = mediaCompleteSchema.safeParse(await parseJsonBody(req));
    if (!parsed.success) return NextResponse.json(toValidationError(parsed.error), { status: 400 });

    const media = await prisma.media.create({ data: { ...parsed.data, uploadedById: session.userId } });
    return NextResponse.json(media);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

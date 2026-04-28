import { NextResponse } from 'next/server';
import { createPresignedUpload } from '@/lib/s3';
import { requireRole } from '@/lib/auth';
import { mediaPresignSchema, parseJsonBody, toValidationError } from '@/lib/validators';
export async function POST(req: Request) {
  try {
    await requireRole(['ADMIN', 'EDITOR', 'AUTHOR']);
    const parsed = mediaPresignSchema.safeParse(await parseJsonBody(req));
    if (!parsed.success) return NextResponse.json(toValidationError(parsed.error), { status: 400 });
    return NextResponse.json(await createPresignedUpload(parsed.data.filename, parsed.data.mimeType, parsed.data.size));
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

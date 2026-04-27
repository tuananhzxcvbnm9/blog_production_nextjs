import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createPresignedUpload } from '@/lib/s3';
import { requireRole } from '@/lib/auth';

const schema = z.object({ filename: z.string().min(1), mimeType: z.string().min(1), size: z.number().int().positive() });
export async function POST(req: Request) {
  try {
    await requireRole(['ADMIN', 'EDITOR', 'AUTHOR']);
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    return NextResponse.json(await createPresignedUpload(parsed.data.filename, parsed.data.mimeType, parsed.data.size));
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

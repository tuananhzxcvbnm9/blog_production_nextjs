import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { settingsPatchSchema } from '@/lib/validators';

export async function GET() {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    return NextResponse.json(await prisma.setting.findMany());
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireRole(['ADMIN']);
    const parsed = settingsPatchSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    await Promise.all(
      Object.entries(parsed.data).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

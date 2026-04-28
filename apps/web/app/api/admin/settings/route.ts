import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { parseJsonBody, settingsPatchSchema, toValidationError } from '@/lib/validators';
import { handleAdminError } from '@/app/api/admin/_helpers';

export async function GET() {
  try {
    await requireRole(['ADMIN', 'EDITOR']);
    return NextResponse.json(await prisma.setting.findMany());
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    await requireRole(['ADMIN']);
    const parsed = settingsPatchSchema.safeParse(await parseJsonBody(req));
    if (!parsed.success) return NextResponse.json(toValidationError(parsed.error), { status: 400 });

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
  } catch (error) {
    return handleAdminError(error);
  }
}

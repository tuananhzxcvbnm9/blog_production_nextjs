import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
const schema = z.object({ key: z.string(), url: z.string().url(), filename: z.string(), mimeType: z.string(), size: z.number(), width: z.number().optional(), height: z.number().optional() });
export async function POST(req: Request) { try { const session = await requireRole(['ADMIN', 'EDITOR', 'AUTHOR']); const parsed=schema.safeParse(await req.json()); if(!parsed.success) return NextResponse.json({error:'Invalid payload'},{status:400}); const media=await prisma.media.create({data:{...parsed.data, uploadedById:session.userId}}); return NextResponse.json(media);} catch { return NextResponse.json({error:'Forbidden'},{status:403}); } }

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
export async function GET(){ try { await requireRole(['ADMIN','EDITOR','AUTHOR']); const media=await prisma.media.findMany({orderBy:{createdAt:'desc'}}); return NextResponse.json(media);} catch { return NextResponse.json({error:'Forbidden'},{status:403}); } }

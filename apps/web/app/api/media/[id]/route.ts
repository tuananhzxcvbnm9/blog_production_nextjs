import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
export async function DELETE(_:Request,{params}:{params:{id:string}}){ try { await requireRole(['ADMIN','EDITOR']); await prisma.media.delete({where:{id:params.id}}); return NextResponse.json({ok:true}); } catch { return NextResponse.json({error:'Forbidden'},{status:403}); } }

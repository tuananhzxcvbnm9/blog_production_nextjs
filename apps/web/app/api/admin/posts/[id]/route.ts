import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postSchema } from '@/lib/validators';
import { requireRole } from '@/lib/auth';

export async function GET(_:Request,{params}:{params:{id:string}}){ try{ await requireRole(['ADMIN','EDITOR']); const post=await prisma.post.findUnique({where:{id:params.id},include:{tags:true}}); if(!post) return NextResponse.json({error:'Not found'},{status:404}); return NextResponse.json(post);} catch { return NextResponse.json({error:'Forbidden'},{status:403}); } }
export async function PATCH(req:Request,{params}:{params:{id:string}}){ try{ await requireRole(['ADMIN','EDITOR']); const parsed=postSchema.partial().safeParse(await req.json()); if(!parsed.success) return NextResponse.json({error:parsed.error.flatten()},{status:400}); const {tagIds,publishedAt,...payload}=parsed.data as any; if(tagIds){ await prisma.postTag.deleteMany({where:{postId:params.id}}); await prisma.postTag.createMany({data:tagIds.map((tagId:string)=>({postId:params.id,tagId}))}); } const post=await prisma.post.update({where:{id:params.id},data:{...payload,publishedAt: publishedAt ? new Date(publishedAt) : undefined}}); return NextResponse.json(post);} catch { return NextResponse.json({error:'Forbidden'},{status:403}); } }
export async function DELETE(_:Request,{params}:{params:{id:string}}){ try{ await requireRole(['ADMIN','EDITOR']); await prisma.post.delete({where:{id:params.id}}); return NextResponse.json({ok:true}); } catch { return NextResponse.json({error:'Forbidden'},{status:403}); } }

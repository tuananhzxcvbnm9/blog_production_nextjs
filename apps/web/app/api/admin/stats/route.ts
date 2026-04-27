import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
export async function GET(){ try{ await requireRole(['ADMIN','EDITOR']); const [totalPosts,publishedPosts,draftPosts,totalViews,totalCategories,totalMediaFiles]=await Promise.all([prisma.post.count(),prisma.post.count({where:{status:'PUBLISHED'}}),prisma.post.count({where:{status:'DRAFT'}}),prisma.postView.count(),prisma.category.count(),prisma.media.count()]); return NextResponse.json({totalPosts,publishedPosts,draftPosts,totalViews,totalCategories,totalMediaFiles}); } catch { return NextResponse.json({error:'Forbidden'},{status:403}); } }

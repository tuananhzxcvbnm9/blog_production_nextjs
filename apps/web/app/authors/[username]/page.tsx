import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
export default async function AuthorPage({ params }: { params: { username: string } }) { const user=await prisma.user.findFirst({where:{OR:[{email:params.username},{name:{contains:params.username,mode:'insensitive'}}]}}); if(!user) notFound(); const posts=await prisma.post.findMany({where:{authorId:user.id,status:'PUBLISHED'}}); return <div><h1 className="text-3xl font-bold">{user.name}</h1><p>{user.bio}</p><div className="mt-4">{posts.length} posts</div></div>; }

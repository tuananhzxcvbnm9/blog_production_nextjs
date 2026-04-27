import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
export default async function TagPage({ params }: { params: { slug: string } }) { const tag=await prisma.tag.findUnique({where:{slug:params.slug}}); if(!tag) notFound(); const posts=await prisma.post.findMany({where:{status:'PUBLISHED',tags:{some:{tagId:tag.id}}},include:{category:true,author:true}}); return <div><h1 className="text-3xl font-bold">#{tag.name}</h1><div className="mt-4 grid gap-3">{posts.map(p=><a key={p.id} href={`/posts/${p.slug}`} className="rounded border p-3">{p.title}</a>)}</div></div>; }

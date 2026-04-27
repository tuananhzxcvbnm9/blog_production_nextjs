import { prisma } from '@/lib/prisma';
export default async function TagsAdmin(){ const tags=await prisma.tag.findMany({include:{_count:{select:{posts:true}}}}); return <div><h1 className="text-2xl font-bold">Tags</h1><div className="mt-4 grid gap-2">{tags.map(t=><div key={t.id} className="rounded border p-3">{t.name} ({t._count.posts})</div>)}</div></div>;}

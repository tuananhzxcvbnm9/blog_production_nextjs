import { prisma } from '@/lib/prisma';
export default async function CategoriesAdmin(){ const categories=await prisma.category.findMany({include:{_count:{select:{posts:true}}}}); return <div><h1 className="text-2xl font-bold">Categories</h1><div className="mt-4 grid gap-2">{categories.map(c=><div key={c.id} className="rounded border p-3">{c.name} ({c._count.posts})</div>)}</div></div>;}

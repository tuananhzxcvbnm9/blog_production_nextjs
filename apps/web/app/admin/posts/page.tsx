import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ include: { author: true, category: true }, orderBy: { updatedAt: 'desc' }, take: 50 });
  return <div><div className="mb-4 flex justify-between"><h1 className="text-2xl font-bold">Posts</h1><Link href="/admin/posts/new" className="rounded bg-black px-3 py-2 text-white">New Post</Link></div><table className="w-full text-sm"><thead><tr><th>Title</th><th>Status</th><th>Category</th><th>Author</th></tr></thead><tbody>{posts.map((p)=><tr key={p.id} className="border-t"><td><Link href={`/admin/posts/${p.id}/edit`}>{p.title}</Link></td><td>{p.status}</td><td>{p.category.name}</td><td>{p.author.name}</td></tr>)}</tbody></table></div>;
}

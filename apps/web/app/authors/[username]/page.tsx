import { cache } from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/post-card';
import { publicPostSelect } from '@/lib/queries';
import { getReadingTime } from '@/lib/reading-time';
import Image from 'next/image';

const getUser = cache(async (username: string) => prisma.user.findFirst({ where: { OR: [{ email: username }, { name: { contains: username, mode: 'insensitive' } }] } }));

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> { const user = await getUser(params.username); if (!user) return { title: 'Author not found — NOVA FLOW' }; const title = `${user.name} — NOVA FLOW`; const description = user.bio || `Posts by ${user.name}`; return { title, description, openGraph: { title, description } }; }

export default async function AuthorPage({ params }: { params: { username: string } }) { const user = await getUser(params.username); if (!user) notFound(); const posts = await prisma.post.findMany({ where: { authorId: user.id, status: 'PUBLISHED' }, select: publicPostSelect, orderBy: { publishedAt: 'desc' } }); const mapped = posts.map((post) => ({ ...post, readingTime: getReadingTime(post.content) })); return <div className="space-y-6"><div className="rounded-2xl border p-5"><div className="flex items-center gap-4"><div className="relative h-16 w-16 overflow-hidden rounded-full">{user.avatarUrl ? <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" /> : <div className="h-full w-full bg-gradient-to-br from-blue-500 to-violet-600" />}</div><div><h1 className="text-3xl font-bold">{user.name}</h1><p className="mt-2 text-zinc-500">{user.bio}</p><p className="mt-2 text-sm text-zinc-500">{mapped.length} bài viết</p></div></div></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{mapped.map((post) => <PostCard key={post.id} post={post} />)}</div></div>; }

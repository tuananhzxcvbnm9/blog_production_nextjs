import { prisma } from '@/lib/prisma';
import { PostsManagementTable } from '@/components/admin/posts-management-table';

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: { author: true, category: true },
    orderBy: { updatedAt: 'desc' },
    take: 100
  });

  const serializedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status,
    updatedAt: post.updatedAt.toISOString(),
    category: { name: post.category.name },
    author: { name: post.author.name }
  }));

  return <PostsManagementTable initialPosts={serializedPosts} />;
}

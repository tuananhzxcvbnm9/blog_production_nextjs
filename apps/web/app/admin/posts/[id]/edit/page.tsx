import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PostEditorForm } from '@/components/admin/post-editor-form';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Chỉnh sửa bài viết</h1>
        <p className="text-sm text-zinc-500">Cập nhật nội dung và trạng thái xuất bản theo thời gian thực.</p>
      </div>

      <PostEditorForm
        mode="edit"
        postId={post.id}
        categories={categories}
        initialValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          categoryId: post.categoryId,
          status: post.status,
          featured: post.featured,
          seoTitle: post.seoTitle ?? '',
          seoDescription: post.seoDescription ?? ''
        }}
      />
    </div>
  );
}

import { PostEditorForm } from '@/components/admin/post-editor-form';
import { prisma } from '@/lib/prisma';

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Tạo bài viết mới</h1>
        <p className="text-sm text-zinc-500">Tạo nội dung, thêm metadata SEO và chọn workflow draft/publish.</p>
      </div>
      <PostEditorForm mode="create" categories={categories} />
    </div>
  );
}

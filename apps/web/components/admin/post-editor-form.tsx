'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type CategoryOption = { id: string; name: string };
type PostEditorValues = { title: string; slug: string; excerpt: string; content: string; categoryId: string; status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; featured: boolean; seoTitle: string; seoDescription: string };
type Props = { mode: 'create' | 'edit'; postId?: string; categories: CategoryOption[]; initialValues?: Partial<PostEditorValues> };

export function PostEditorForm({ mode, postId, categories, initialValues }: Props) {
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const defaultValues = useMemo<PostEditorValues>(() => ({
    title: initialValues?.title ?? '', slug: initialValues?.slug ?? '', excerpt: initialValues?.excerpt ?? '', content: initialValues?.content ?? '',
    categoryId: initialValues?.categoryId ?? categories[0]?.id ?? '', status: initialValues?.status ?? 'DRAFT', featured: initialValues?.featured ?? false,
    seoTitle: initialValues?.seoTitle ?? '', seoDescription: initialValues?.seoDescription ?? ''
  }), [initialValues, categories]);
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<PostEditorValues>({ defaultValues });
  const titleValue = watch('title');

  const onSubmit = async (values: PostEditorValues) => {
    setApiError('');
    const endpoint = mode === 'create' ? '/api/admin/posts' : `/api/admin/posts/${postId}`;
    const method = mode === 'create' ? 'POST' : 'PATCH';
    const res = await fetch(endpoint, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...values, tagIds: [] }) });
    if (!res.ok) {
      const result = (await res.json().catch(() => null)) as { error?: string } | null;
      setApiError(result?.error || 'Không thể lưu bài viết');
      return;
    }
    router.push('/admin/posts');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tiêu đề"><input {...register('title', { required: true })} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700" /></Field>
        <Field label="Slug"><input {...register('slug', { required: true })} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700" /></Field>
      </div>
      <Field label="Excerpt"><textarea {...register('excerpt', { required: true })} className="w-full min-h-20 rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700" /></Field>
      <Field label="Nội dung"><textarea {...register('content', { required: true })} className="w-full min-h-64 rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700" /></Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Danh mục">
          <select {...register('categoryId', { required: true })} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700">
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </Field>
        <Field label="Trạng thái">
          <select {...register('status')} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700">
            <option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option>
          </select>
        </Field>
        <Field label="Featured">
          <label className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-200 px-3 dark:border-zinc-700">
            <input type="checkbox" checked={watch('featured')} onChange={(e) => setValue('featured', e.target.checked)} /> Bài nổi bật
          </label>
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="SEO title"><input {...register('seoTitle')} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700" placeholder={titleValue || 'SEO title'} /></Field>
        <Field label="SEO description"><textarea {...register('seoDescription')} className="w-full min-h-20 rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700" /></Field>
      </div>
      {apiError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">{apiError}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => router.push('/admin/posts')} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold dark:border-zinc-700">Hủy</button>
        <button disabled={isSubmitting} className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">{isSubmitting ? 'Đang lưu...' : mode === 'create' ? 'Lưu bài viết' : 'Cập nhật'}</button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-200"><span>{label}</span>{children}</label>;
}

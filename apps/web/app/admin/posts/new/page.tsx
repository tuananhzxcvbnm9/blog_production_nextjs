'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type NewPostForm = { title: string; excerpt: string; content: string; categoryId: string };
type Category = { id: string; name: string };
type ApiErrorResponse = { error?: string | { fieldErrors?: Record<string, string[]> } };

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<NewPostForm>();
  const title = watch('title');

  useEffect(() => {
    async function loadCategories() {
      const res = await fetch('/api/admin/categories', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as Category[];
      setCategories(data);
      if (data[0]) setValue('categoryId', data[0].id);
    }
    loadCategories();
  }, [setValue]);

  const payloadSlug = useMemo(
    () =>
      String(title || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-'),
    [title]
  );

  const onSubmit = async (data: NewPostForm) => {
    setError('');
    if (!payloadSlug) {
      setError('Tiêu đề chưa hợp lệ để tạo slug.');
      return;
    }
    if (!data.categoryId) {
      setError('Bạn cần tạo category trước khi đăng bài.');
      return;
    }
    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: data.title,
        slug: payloadSlug,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.categoryId,
        tagIds: [],
        status: 'DRAFT',
        featured: false
      })
    });
    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as ApiErrorResponse | null;
      if (typeof payload?.error === 'string') {
        setError(payload.error);
        return;
      }
      const firstFieldError = payload?.error?.fieldErrors && Object.values(payload.error.fieldErrors)[0]?.[0];
      setError(firstFieldError || 'Tạo bài viết thất bại. Vui lòng kiểm tra dữ liệu.');
      return;
    }
    router.push('/admin/posts');
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 rounded-xl border p-4">
        <input {...register('title', { required: true, minLength: 3 })} placeholder="Title" className="rounded border px-3 py-2" />
        <textarea {...register('excerpt', { required: true, minLength: 10 })} placeholder="Excerpt" className="min-h-24 rounded border px-3 py-2" />
        <textarea {...register('content', { required: true, minLength: 20 })} placeholder="Content" className="min-h-40 rounded border px-3 py-2" />
        <select {...register('categoryId', { required: true })} className="rounded border px-3 py-2">
          {categories.length === 0 && <option value="">No category available</option>}
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={isSubmitting} className="rounded bg-black py-2 text-white disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save draft'}
        </button>
      </form>
    </div>
  );
}

'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, PencilLine, Sparkles, SplitSquareVertical } from 'lucide-react';

type CategoryOption = { id: string; name: string };

type PostEditorValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
};

type Props = {
  mode: 'create' | 'edit';
  postId?: string;
  categories: CategoryOption[];
  initialValues?: Partial<PostEditorValues>;
};

type EditorViewMode = 'edit' | 'preview' | 'split';

type CategoryOption = { id: string; name: string };
type PostEditorValues = { title: string; slug: string; excerpt: string; content: string; categoryId: string; status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; featured: boolean; seoTitle: string; seoDescription: string };
type Props = { mode: 'create' | 'edit'; postId?: string; categories: CategoryOption[]; initialValues?: Partial<PostEditorValues> };

export function PostEditorForm({ mode, postId, categories, initialValues }: Props) {
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [viewMode, setViewMode] = useState<EditorViewMode>('split');

  const defaultValues = useMemo<PostEditorValues>(
    () => ({
      title: initialValues?.title ?? '',
      slug: initialValues?.slug ?? '',
      excerpt: initialValues?.excerpt ?? '',
      content: initialValues?.content ?? '',
      categoryId: initialValues?.categoryId ?? categories[0]?.id ?? '',
      status: initialValues?.status ?? 'DRAFT',
      featured: initialValues?.featured ?? false,
      seoTitle: initialValues?.seoTitle ?? '',
      seoDescription: initialValues?.seoDescription ?? ''
    }),
    [initialValues, categories]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors }
  } = useForm<PostEditorValues>({ defaultValues });

  const titleValue = watch('title');
  const contentValue = watch('content');

  const wordCount = useMemo(() => {
    return contentValue.trim().length === 0 ? 0 : contentValue.trim().split(/\s+/).length;
  }, [contentValue]);

  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));

  const onSubmit = async (values: PostEditorValues) => {
    setApiError('');

    const payload = {
      ...values,
      tagIds: []
    };

    const endpoint = mode === 'create' ? '/api/admin/posts' : `/api/admin/posts/${postId}`;
    const method = mode === 'create' ? 'POST' : 'PATCH';

    const res = await fetch(endpoint, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });

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
        <Field label="Tiêu đề" error={errors.title?.message}>
          <input
            {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700"
            placeholder="Ví dụ: Next.js Performance Checklist"
          />
        </Field>

        <Field label="Slug" error={errors.slug?.message}>
          <div className="space-y-2">
            <input
              {...register('slug', { required: 'Vui lòng nhập slug' })}
              className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700"
              placeholder="nextjs-performance-checklist"
            />
            <button
              type="button"
              onClick={() => setValue('slug', toSlug(titleValue), { shouldValidate: true })}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
            >
              <Sparkles size={13} />
              Tạo slug từ tiêu đề
            </button>
          </div>
        </Field>
      </div>

      <Field label="Excerpt" error={errors.excerpt?.message}>
        <textarea
          {...register('excerpt', { required: 'Vui lòng nhập excerpt' })}
          className="w-full min-h-20 rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700"
          placeholder="Mô tả ngắn cho bài viết"
        />
      </Field>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Nội dung bài viết</p>
          <div className="inline-flex rounded-xl border border-zinc-200 p-1 dark:border-zinc-700">
            <ModeButton label="Edit" icon={<PencilLine size={14} />} active={viewMode === 'edit'} onClick={() => setViewMode('edit')} />
            <ModeButton label="Preview" icon={<Eye size={14} />} active={viewMode === 'preview'} onClick={() => setViewMode('preview')} onLeftBorder />
            <ModeButton label="Split" icon={<SplitSquareVertical size={14} />} active={viewMode === 'split'} onClick={() => setViewMode('split')} onLeftBorder />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span>{wordCount} từ</span>
          <span>•</span>
          <span>Khoảng {readingMinutes} phút đọc</span>
          <span>•</span>
          <span>{contentValue.length} ký tự</span>
        </div>

        <div className={`grid gap-3 ${viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
          {(viewMode === 'edit' || viewMode === 'split') && (
            <textarea
              {...register('content', { required: 'Vui lòng nhập nội dung', minLength: { value: 20, message: 'Nội dung tối thiểu 20 ký tự' } })}
              className="w-full min-h-80 rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700"
              placeholder="Markdown / rich text nội dung"
            />
          )}

          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className="min-h-80 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-700 dark:bg-zinc-950/40">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Preview</p>
              {contentValue.trim().length === 0 ? (
                <p className="text-sm text-zinc-500">Chưa có nội dung để preview.</p>
              ) : (
                <ContentPreview content={contentValue} />
              )}
            </div>
          )}
        </div>

        {errors.content?.message && <p className="text-xs text-red-500">{errors.content.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Danh mục" error={errors.categoryId?.message}>
          <select {...register('categoryId', { required: 'Vui lòng chọn danh mục' })} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Trạng thái">
          <select {...register('status')} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </Field>

        <Field label="Featured">
          <label className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-200 px-3 dark:border-zinc-700">
            <input type="checkbox" checked={watch('featured')} onChange={(e) => setValue('featured', e.target.checked)} />
            Bài nổi bật
          </label>
        </Field>
      </div>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/70 dark:bg-indigo-950/40">
        <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Content & Editor</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-indigo-700/90 dark:text-indigo-200">
          <li>Markdown / MDX hoặc Rich text editor</li>
          <li>Image upload</li>
          <li>Draft / Publish workflow</li>
          <li>SEO metadata</li>
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="SEO title">
          <input {...register('seoTitle')} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700" placeholder={titleValue || 'SEO title'} />
        </Field>
        <Field label="SEO description">
          <textarea {...register('seoDescription')} className="w-full min-h-20 rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700" placeholder="SEO description" />
        </Field>
      </div>

      {apiError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">{apiError}</p>}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => router.push('/admin/posts')} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold dark:border-zinc-700">
          Hủy
        </button>
        <button disabled={isSubmitting} className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
          {isSubmitting ? 'Đang lưu...' : mode === 'create' ? 'Lưu bài viết' : 'Cập nhật'}
        </button>
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

function ContentPreview({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <article className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={index} className="h-3" />;
        }

        if (trimmed.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-bold">{trimmed.slice(4)}</h3>;
        }

        if (trimmed.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-bold">{trimmed.slice(3)}</h2>;
        }

        if (trimmed.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-extrabold">{trimmed.slice(2)}</h1>;
        }

        if (trimmed.startsWith('- ')) {
          return (
            <p key={index} className="pl-4 before:mr-2 before:content-['•']">
              {trimmed.slice(2)}
            </p>
          );
        }

        return <p key={index}>{trimmed}</p>;
      })}
    </article>
  );
}

function ModeButton({
  label,
  icon,
  active,
  onClick,
  onLeftBorder = false
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
  onLeftBorder?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold ${
        active ? 'rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'text-zinc-600 dark:text-zinc-300'
      } ${onLeftBorder ? 'border-l border-zinc-200 dark:border-zinc-700' : ''}`}
    >
      {icon}
      {label}
    </button>
  );
}

function Field({ label, children, error }: { label: string; children: ReactNode; error?: string }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
      <span>{label}</span>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}

function toSlug(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-200"><span>{label}</span>{children}</label>;
}

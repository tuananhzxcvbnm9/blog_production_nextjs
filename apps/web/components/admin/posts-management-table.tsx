'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FilePenLine, Loader2, Search, Trash2, Upload } from 'lucide-react';

type PostRow = {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  updatedAt: string;
  category: { name: string };
  author: { name: string };
};

type Props = {
  initialPosts: PostRow[];
};

export function PostsManagementTable({ initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PostRow['status']>('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesStatus = statusFilter === 'ALL' ? true : post.status === statusFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery = q.length === 0 || post.title.toLowerCase().includes(q) || post.slug.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [posts, query, statusFilter]);

  const mutatePost = async (postId: string, action: 'delete' | 'publish' | 'unpublish') => {
    setError('');
    setProcessingId(postId);
    try {
      if (action === 'delete') {
        const res = await fetch(`/api/admin/posts/${postId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Xóa bài viết thất bại');
        setPosts((current) => current.filter((post) => post.id !== postId));
        return;
      }

      const actionPath = action === 'publish' ? 'publish' : 'unpublish';
      const res = await fetch(`/api/admin/posts/${postId}/${actionPath}`, { method: 'POST' });
      if (!res.ok) throw new Error('Cập nhật trạng thái thất bại');
      setPosts((current) =>
        current.map((post) =>
          post.id === postId ? { ...post, status: action === 'publish' ? 'PUBLISHED' : 'DRAFT' } : post
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đã có lỗi xảy ra');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Quản lý bài viết</h2>
          <p className="text-sm text-zinc-500">Tìm kiếm, chỉnh sửa, publish/unpublish và xóa bài viết nhanh chóng.</p>
        </div>
        <Link href="/admin/posts/new" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white">
          <FilePenLine size={16} />
          Tạo bài mới
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <label className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 dark:border-zinc-700">
          <Search size={16} className="text-zinc-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo tiêu đề hoặc slug..." className="w-full bg-transparent text-sm outline-none" />
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'ALL' | PostRow['status'])}
          className="rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none dark:border-zinc-700"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">{error}</p>}

      {filteredPosts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Không có bài viết phù hợp bộ lọc.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-700">
                <th className="py-3 pr-3">Tiêu đề</th>
                <th className="py-3 pr-3">Trạng thái</th>
                <th className="py-3 pr-3">Danh mục</th>
                <th className="py-3 pr-3">Tác giả</th>
                <th className="py-3 pr-3">Cập nhật</th>
                <th className="py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => {
                const isBusy = processingId === post.id;
                return (
                  <tr key={post.id} className="border-b border-zinc-100 align-top last:border-0 dark:border-zinc-800">
                    <td className="py-3 pr-3">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</p>
                      <p className="text-xs text-zinc-500">/{post.slug}</p>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold dark:bg-zinc-800">{post.status}</span>
                    </td>
                    <td className="py-3 pr-3">{post.category.name}</td>
                    <td className="py-3 pr-3">{post.author.name}</td>
                    <td className="py-3 pr-3 text-xs text-zinc-500">{new Date(post.updatedAt).toLocaleString('vi-VN')}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/posts/${post.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-semibold dark:border-zinc-700">
                          <FilePenLine size={14} />
                          Sửa
                        </Link>

                        {post.status === 'PUBLISHED' ? (
                          <button
                            onClick={() => mutatePost(post.id, 'unpublish')}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-2.5 py-1.5 text-xs font-semibold text-amber-700 disabled:opacity-70"
                          >
                            {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                            Hạ bài
                          </button>
                        ) : (
                          <button
                            onClick={() => mutatePost(post.id, 'publish')}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 disabled:opacity-70"
                          >
                            {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                            Publish
                          </button>
                        )}

                        <button
                          onClick={() => mutatePost(post.id, 'delete')}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-70"
                        >
                          {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

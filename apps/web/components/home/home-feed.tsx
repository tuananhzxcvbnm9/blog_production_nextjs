'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PostCard } from '@/components/post-card';

import type { PublicPost } from '@/lib/queries';

type Post = PublicPost & { readingTime?: number };

export function HomeFeed({ initialPosts, categoryName }: { initialPosts: Post[]; categoryName?: string | null }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(2);

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
    pageRef.current = page;
  }, [loading, hasMore, page]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(pageRef.current) });
      if (categoryName) params.set('category', categoryName);
      const res = await fetch(`/api/posts?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load');
      const json = await res.json();
      setPosts((prev) => [...prev, ...(json.data ?? [])]);
      setHasMore(Boolean(json.nextPage));
      if (json.nextPage) setPage(json.nextPage);
    } catch {
      setError('Không thể tải thêm bài viết. Vui lòng thử lại.');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '500px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  const skeletons = useMemo(() => Array.from({ length: 3 }), []);

  if (!posts.length) {
    return <div className="rounded-2xl border border-dashed p-8 text-center text-zinc-500">Chưa có bài viết nào.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id} className="animate-fade-in-up">
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {loading && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skeletons.map((_, i) => (
            <div key={i} className="overflow-hidden rounded-3xl border bg-white p-4 dark:bg-zinc-900">
              <div className="h-40 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
              <div className="mt-4 h-5 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="mt-2 h-4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      )}

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      <div ref={sentinelRef} className="flex min-h-10 items-center justify-center text-sm text-zinc-500">
        {hasMore ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 size={14} className={loading ? 'animate-spin' : ''} /> Đang tải thêm bài viết...
          </span>
        ) : (
          'Bạn đã xem hết bài viết mới nhất.'
        )}
      </div>
    </div>
  );
}

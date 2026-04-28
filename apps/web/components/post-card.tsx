import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock3, Bookmark } from 'lucide-react';
import { format } from 'date-fns';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: { name: string };
  author: { name: string; avatarUrl?: string | null };
  coverImageUrl?: string | null;
  publishedAt?: Date | string | null;
};

function PostCardBase({ post }: { post: Post }) {
  const published = post.publishedAt ? new Date(post.publishedAt) : null;

  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative h-44 w-full overflow-hidden">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-600" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700 backdrop-blur dark:bg-zinc-900/80 dark:text-blue-300">
          {post.category.name}
        </span>
      </div>

      <div className="space-y-3 p-5">
        <Link href={`/posts/${post.slug}`} className="line-clamp-2 text-xl font-semibold leading-tight text-zinc-900 dark:text-white">
          {post.title}
        </Link>
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>

        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-violet-500" />
            <span>{post.author.name}</span>
            {published && (
              <>
                <span>•</span>
                <span>{format(published, 'dd/MM/yyyy')}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Clock3 size={12} />
            <span>5 phút đọc</span>
            <Bookmark size={13} />
          </div>
        </div>
      </div>
    </article>
  );
}

export const PostCard = memo(PostCardBase);

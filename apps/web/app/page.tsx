import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { PostCard } from '@/components/post-card';
import { HomeFeed } from '@/components/home/home-feed';
import { Sparkles, TrendingUp, Users, BookOpenText } from 'lucide-react';

const topicPills = ['Tất cả', 'AI', 'Công nghệ', 'Thiết kế', 'Productivity', 'Cloud & DevOps', 'Lifestyle', 'Startup'];
const homePostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImageUrl: true,
  publishedAt: true,
  category: { select: { name: true } },
  author: { select: { name: true, avatarUrl: true } }
});

export default async function HomePage() {
  const [featured, latest, categories, totalPosts, totalAuthors] = await Promise.all([
    prisma.post.findMany({ where: { status: 'PUBLISHED', featured: true }, select: homePostSelect, orderBy: { publishedAt: 'desc' }, take: 4 }),
    prisma.post.findMany({ where: { status: 'PUBLISHED' }, select: homePostSelect, orderBy: { publishedAt: 'desc' }, take: 12 }),
    prisma.category.findMany({ include: { _count: { select: { posts: true } } }, orderBy: { posts: { _count: 'desc' } }, take: 6 }),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.user.count()
  ]);

  const heroFeatured = featured[0] ?? latest[0];

  return (
    <div className="space-y-8 pb-12">
      <section className="grid gap-6 rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-violet-50 p-6 shadow-xl shadow-blue-500/5 md:grid-cols-[1.3fr_1fr] md:p-8 dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <Sparkles size={14} /> Cảm hứng mỗi ngày
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 md:text-6xl dark:text-white">
            Nguồn cảm hứng <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">không giới hạn</span>
          </h1>
          <p className="max-w-2xl text-lg text-zinc-500 dark:text-zinc-300">Khám phá ý tưởng, xu hướng và tri thức mới nhất để bứt phá trong công việc mỗi ngày.</p>

          <div className="flex flex-wrap gap-3">
            {topicPills.map((pill, idx) => (
              <button
                key={pill}
                className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                  idx === 0
                    ? 'border-blue-200 bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-blue-200 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-xs text-zinc-500">Bài viết</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{totalPosts}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600"><TrendingUp size={12} /> +18%</p>
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-xs text-zinc-500">Authors</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{totalAuthors}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600"><Users size={12} /> Active</p>
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-xs text-zinc-500">Tuần này</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">256K</p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-violet-600"><BookOpenText size={12} /> Lượt đọc</p>
            </div>
          </div>

          {heroFeatured && (
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-lg shadow-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Nổi bật</p>
              <p className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">{heroFeatured.title}</p>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-300">{heroFeatured.excerpt}</p>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Bài viết nổi bật</h2>
          <div className="grid gap-5 md:grid-cols-2">{featured.slice(0, 4).map((post) => <PostCard key={post.id} post={post} />)}</div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Trending topics</h3>
              <span className="text-xs text-blue-600">Xem tất cả</span>
            </div>
            <div className="space-y-2">
              {categories.map((category, idx) => (
                <div key={category.id} className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800/60">
                  <span className="text-zinc-600 dark:text-zinc-200">{String(idx + 1).padStart(2, '0')} · {category.name}</span>
                  <span className="font-semibold text-blue-600">{category._count.posts}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-indigo-900 to-violet-700 p-6 text-white shadow-xl shadow-violet-500/20">
            <p className="text-sm font-semibold">Newsletter</p>
            <h3 className="mt-2 text-2xl font-bold">Nhận cảm hứng mới mỗi tuần</h3>
            <p className="mt-2 text-sm text-white/80">Không bỏ lỡ bài viết chất lượng về công nghệ, product và lifestyle.</p>
            <form action="/api/newsletter" method="post" className="mt-4 space-y-2">
              <input name="email" placeholder="you@example.com" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/60" />
              <button className="w-full rounded-xl bg-white px-4 py-2 font-semibold text-indigo-700">Đăng ký ngay</button>
            </form>
          </div>
        </aside>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Bài viết mới nhất</h2>
        <HomeFeed initialPosts={latest} />
      </section>
    </div>
  );
}

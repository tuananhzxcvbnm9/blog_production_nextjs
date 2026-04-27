import bcrypt from 'bcryptjs';
import { PrismaClient, PostStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin@123456', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@blog.local' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@blog.local',
      passwordHash,
      role: UserRole.ADMIN,
      bio: 'Senior editor of the production blog.'
    }
  });

  const categories = await Promise.all(
    [
      { name: 'Engineering', slug: 'engineering', description: 'Modern engineering practices', color: '#2563eb' },
      { name: 'DevOps', slug: 'devops', description: 'Cloud native delivery and operations', color: '#16a34a' },
      { name: 'Product', slug: 'product', description: 'Product strategy and execution', color: '#a855f7' }
    ].map((c) => prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c }))
  );

  const tags = await Promise.all(
    ['nextjs', 'typescript', 'kubernetes', 'docker', 'sre', 'frontend', 'backend', 'seo'].map((slug) =>
      prisma.tag.upsert({ where: { slug }, update: { name: slug.toUpperCase() }, create: { slug, name: slug.toUpperCase() } })
    )
  );

  for (let i = 1; i <= 12; i++) {
    const category = categories[i % categories.length];
    const post = await prisma.post.upsert({
      where: { slug: `sample-post-${i}` },
      update: {},
      create: {
        title: `Sample Post ${i}`,
        slug: `sample-post-${i}`,
        excerpt: `Production-ready sample excerpt ${i}`,
        content: `# Sample Post ${i}\n\nThis is a seeded markdown content for post ${i}.`,
        status: PostStatus.PUBLISHED,
        featured: i <= 3,
        publishedAt: new Date(Date.now() - i * 86400000),
        authorId: admin.id,
        categoryId: category.id
      }
    });

    await prisma.postTag.deleteMany({ where: { postId: post.id } });
    await prisma.postTag.createMany({
      data: [tags[i % tags.length], tags[(i + 1) % tags.length]].map((tag) => ({ postId: post.id, tagId: tag.id }))
    });
  }

  await prisma.media.createMany({
    data: [1, 2, 3].map((i) => ({
      key: `uploads/2026/04/demo-${i}.jpg`,
      url: `https://cdn.example.com/uploads/2026/04/demo-${i}.jpg`,
      filename: `demo-${i}.jpg`,
      mimeType: 'image/jpeg',
      size: 102400,
      width: 1200,
      height: 630,
      uploadedById: admin.id
    })),
    skipDuplicates: true
  });
}

main().finally(async () => prisma.$disconnect());

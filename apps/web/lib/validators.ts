import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});



export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100)
});

export const postSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(220),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(20),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  categoryId: z.string().min(1),
  tagIds: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(320).optional(),
  ogImageUrl: z.string().url().optional().or(z.literal('')),
  publishedAt: z.string().datetime().optional()
});

export const categorySchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(300).optional().nullable(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional().nullable()
});

export const tagSchema = z.object({
  name: z.string().min(2).max(60),
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/)
});

export const userCreateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['ADMIN', 'EDITOR', 'AUTHOR']).default('AUTHOR')
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.enum(['ADMIN', 'EDITOR', 'AUTHOR']).optional(),
  status: z.enum(['ACTIVE', 'DISABLED']).optional(),
  bio: z.string().max(500).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable()
});

export const settingsPatchSchema = z.record(z.string().min(1).max(120), z.string().max(2000));

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1)
});

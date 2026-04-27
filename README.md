# Blog Production (Next.js + Prisma + PostgreSQL + S3 + Helm)

Production-ready blog platform with modern public UI, protected admin, S3 direct upload, Docker local run, and Kubernetes deployment.

## Monorepo structure

- `apps/web`: Next.js app (App Router, APIs, Prisma, auth, UI)
- `packages/ui`: shared UI package placeholder
- `packages/config`: shared config package placeholder
- `deploy/helm/blog-web`: Helm chart for deployment
- `deploy/vm`: Docker + Nginx deployment assets for Ubuntu VM

## Features implemented

- Public pages: home, post detail, category, tag, author, search, about
- Modernized Nova Flow-inspired editorial UI: gradient hero, topic chips, rich cards, sticky glass header, dark-mode toggle, and client-side infinite loading with skeleton/empty/error states
- SEO: dynamic metadata for post pages, sitemap, robots, JSON-LD article schema
- Admin routes/layout: dashboard, posts, categories, tags, media, users, settings
- API routes for public/admin/auth/media/health (bao gồm đăng nhập + đăng ký tài khoản tác giả)
- API hardening update: stricter Zod validation for search/pagination/newsletter and admin CRUD payloads (categories/tags/users/settings)
- Custom JWT cookie session auth + RBAC (ADMIN/EDITOR)
- Prisma schema with indexes/relations + seed data
- S3 presigned upload flow (`/api/media/presign`, `/api/media/complete`)
- Docker multi-stage + docker-compose with Postgres + optional MinIO
- Helm chart with Deployment, Service, Ingress, ConfigMap, Secret, ServiceAccount, HPA, PDB
- GitHub Actions CI/CD pipeline

## Demo admin account

- Email: `admin@blog.local`
- Password: `Admin@123456`

## Local development

1. Install dependencies
   ```bash
   pnpm install
   ```
2. Copy env
   ```bash
   cp .env.example apps/web/.env
   ```
3. Start PostgreSQL (and optional MinIO)
   ```bash
   docker compose up -d postgres minio
   ```
4. Run migration and seed
   ```bash
   pnpm prisma:migrate
   pnpm prisma:seed
   ```
5. Start app
   ```bash
   pnpm dev
   ```

## Docker compose full stack

```bash
docker compose up --build
```

## Build production

```bash
pnpm build
```

## Kubernetes deploy with Helm

1. Update placeholders in:
   - `deploy/helm/blog-web/values.prod.yaml`
   - secret values (`DATABASE_URL`, `AUTH_SECRET`, S3)
2. Deploy:
   ```bash
   helm upgrade --install blog-web deploy/helm/blog-web -f deploy/helm/blog-web/values.prod.yaml
   ```

## Environment variables

See `.env.example`:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `AWS_REGION`
- `S3_BUCKET`
- `S3_PUBLIC_BASE_URL`
- `S3_UPLOAD_PREFIX`
- `AWS_ACCESS_KEY_ID` (optional for IRSA)
- `AWS_SECRET_ACCESS_KEY` (optional for IRSA)
- `SENTRY_DSN` (optional)

## Notes / placeholders to fill

- Domain (`NEXT_PUBLIC_SITE_URL`, ingress host)
- Real S3 bucket + CDN URL
- Container registry in workflow and Helm values
- Production DB URL and auth secret

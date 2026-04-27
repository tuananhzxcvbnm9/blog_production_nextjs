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
- API routes for public/admin/auth/media/health
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

## Deploy on Ubuntu VM (Docker + Nginx, public domain)

> Mục tiêu: chạy app public trên VM Ubuntu thông thường, dùng Docker Compose và Nginx reverse proxy.

### 1) Chuẩn bị VM

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg ufw

# Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### 2) Deploy source code

```bash
git clone <YOUR_REPO_URL> blog-production
cd blog-production
```

### 3) Chuẩn bị file môi trường production

```bash
cp deploy/vm/.env.prod.example deploy/vm/.env.prod
nano deploy/vm/.env.prod
```

Bắt buộc chỉnh:
- `AUTH_SECRET`
- `DATABASE_URL`, `POSTGRES_PASSWORD`
- `NEXT_PUBLIC_SITE_URL`
- S3 vars (`AWS_REGION`, `S3_BUCKET`, `S3_PUBLIC_BASE_URL`, `S3_UPLOAD_PREFIX`)

### 4) Cấu hình domain DNS

- Trỏ `A record` của `blog.example.com` tới public IP VM.
- Chờ DNS propagate.

### 5) Cấu hình Nginx reverse proxy trong Compose

- Sửa domain trong `deploy/vm/nginx/blog.conf` từ `blog.example.com` thành domain thật.
- Nginx container dùng config này để reverse proxy tới service `web:3000`.

### 6) SSL certificate (Let's Encrypt)

Trong lần đầu, có 2 cách:

#### Cách nhanh (tạm thời): dùng HTTP trước
1. Tạm comment block HTTPS trong `deploy/vm/nginx/blog.conf`.
2. Start stack:
   ```bash
   cd deploy/vm
   docker compose -f docker-compose.prod.yml up -d
   ```
3. Cấp cert trên host bằng certbot:
   ```bash
   sudo apt install -y certbot
   sudo certbot certonly --standalone -d blog.example.com
   ```
4. Copy cert vào thư mục mount cho nginx container:
   ```bash
   mkdir -p nginx/certs
   sudo cp /etc/letsencrypt/live/blog.example.com/fullchain.pem nginx/certs/
   sudo cp /etc/letsencrypt/live/blog.example.com/privkey.pem nginx/certs/
   sudo chown -R $USER:$USER nginx/certs
   ```
5. Bật lại HTTPS block trong `blog.conf`, reload stack:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --force-recreate nginx
   ```

#### Cách production tốt hơn
- Dùng Traefik/Caddy hoặc certbot sidecar auto-renew. (repo hiện cung cấp template Nginx cơ bản, bạn có thể mở rộng sau).

### 7) Chạy production stack

```bash
cd deploy/vm
docker compose -f docker-compose.prod.yml build web
docker compose -f docker-compose.prod.yml up -d
```

Kiểm tra:
```bash
docker compose -f docker-compose.prod.yml ps
curl -I https://blog.example.com/api/health
```

### 8) Migrate + seed database (lần đầu)

Vì image runtime standalone không chứa CLI dev tools, hãy chạy migrate/seed bằng container Node tạm thời:

```bash
cd deploy/vm

docker run --rm   --network vm_default   --env-file .env.prod   -v $(pwd)/../..:/workspace   -w /workspace   node:20-alpine   sh -lc "corepack enable && corepack prepare pnpm@9.12.3 --activate && pnpm install --frozen-lockfile=false && pnpm --filter @blog/web prisma migrate deploy"

# seed demo (optional cho production)
docker run --rm   --network vm_default   --env-file .env.prod   -v $(pwd)/../..:/workspace   -w /workspace   node:20-alpine   sh -lc "corepack enable && corepack prepare pnpm@9.12.3 --activate && pnpm install --frozen-lockfile=false && pnpm --filter @blog/web prisma db seed"
```

### 9) Update phiên bản app

```bash
cd deploy/vm
docker compose -f docker-compose.prod.yml build web
docker compose -f docker-compose.prod.yml up -d web nginx
```

### 10) Backup và vận hành

- PostgreSQL data nằm trong volume `pgdata`.
- Backup định kỳ bằng `pg_dump` hoặc snapshot disk/volume.
- Theo dõi health:
  - `https://<domain>/api/health`
  - `docker logs` cho `web`, `nginx`, `postgres`.

## Kubernetes deploy with Helm

1. Update placeholders in:
   - `deploy/helm/blog-web/values.prod.yaml`
   - secret values (`DATABASE_URL`, `AUTH_SECRET`, S3)
2. Deploy:
   ```bash
   helm upgrade --install blog-web deploy/helm/blog-web -f deploy/helm/blog-web/values.prod.yaml
   ```

## Environment variables

See `.env.example` and `deploy/vm/.env.prod.example`:

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

- Domain (`NEXT_PUBLIC_SITE_URL`, ingress host, nginx `server_name`)
- Real S3 bucket + CDN URL
- Container registry (chỉ cần cho luồng CI/CD & Helm; VM compose dùng local build)
- Production DB URL and auth secret

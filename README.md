## 🚀 HRM App – Monorepo

HRM App là hệ thống quản lý nhân sự (Human Resource Management) được phát triển theo kiến trúc Monorepo sử dụng pnpm workspaces và Turborepo, gồm nhiều ứng dụng con dùng chung tài nguyên và code.

Dự án bao gồm:

- backend — API sử dụng NestJS / Express / Prisma
- frontend-client — Web Client (Vite + React + Tailwind)
- frontend-admin — Admin Panel (Next.js 15)
- shared — Thư viện chia sẻ (types, helpers, constants…)

## 🧰 Công nghệ sử dụng

Layer Công nghệ:

- Backend Node.js 22+, NestJS / Express, Prisma ORM
- Frontend Client React 19, Vite 7, TailwindCSS 4
- Admin Next.js 15, App Router, Turbopack
- Build System pnpm Workspaces, Turborepo
- DevOps Docker, Docker Compose
- Shared TypeScript 5, Zod / Types

## 📁 Cấu trúc thư mục

```
hrm-app/
├── backend/ # Backend API (NestJS / Prisma)
├── frontend-client/ # Ứng dụng khách hàng (Vite + React)
├── frontend-admin/ # Admin Panel (Next.js)
├── shared/ # Mã dùng chung
├── docker-compose.yml # Cấu hình Docker Compose
├── pnpm-workspace.yaml # Cấu hình monorepo pnpm
└── README.md # Tài liệu dự án
```

## ⚙️ Cài đặt & chạy dự án

### 1️⃣ Clone dự án

- git clone https://github.com/<your-user>/<your-repo>.git
- cd hrm-app

### 2️⃣ Cài đặt dependencies

- pnpm install

### 3️⃣ Cấu hình ENV

- Tạo .env cho từng package:
- backend/.env
- frontend-client/.env
- frontend-admin/.env

Dựa trên file:

- .env.example

## 🐳 Chạy toàn bộ dự án bằng Docker Compose

- docker-compose up -d --build

### Sau khi chạy:

- Backend: http://localhost:3001
- Frontend Client: http://localhost:3000
- Admin Panel: http://localhost:3002

(Các cổng có thể thay đổi theo cấu hình Compose của bạn.)

## 🧪 Kiểm tra type & lint

Kiểm tra type:
pnpm --filter backend typecheck
pnpm --filter frontend-client typecheck
pnpm --filter frontend-admin typecheck

Chạy lint toàn monorepo
pnpm lint

🛠 Phát triển theo từng phần
Backend
pnpm --filter backend dev

Frontend Client
pnpm --filter frontend-client dev

Admin Panel (Next.js)
pnpm --filter frontend-admin dev

🔗 pnpm Workspace

pnpm-workspace.yaml:

packages:

- "backend"
- "frontend-client"
- "frontend-admin"
- "shared"

Tất cả package có thể chia sẻ code từ shared.

# HRM App – Monorepo

Dự án **HRM App** được xây dựng theo kiến trúc **Monorepo** sử dụng **pnpm workspaces**, bao gồm:

- `backend` — API NestJS / Express / Prisma
- `frontend-client` — Web Client (Vite + React + Tailwind)
- `frontend-admin` — Admin Panel (Next.js)
- `shared` — Mã dùng chung (types, helpers)

## 🛠 Công nghệ sử dụng

- **Node.js 22+**
- **pnpm 10+**
- **Vite 7**
- **Next.js 15**
- **TailwindCSS 4**
- **Prisma ORM**
- **Docker & Docker Compose**

---

## 🚀 1. Cài đặt & chạy dự án

### Clone repository

```sh
git clone https://github.com/<your-user>/<your-repo>.git
cd hrm-app
```

### Cấu hình biến môi trường

Tạo file `.env` trong thư mục gốc và các thư mục con `backend`, `frontend-client`, `frontend-admin` dựa trên các file mẫu `.env.example`.

#### Chạy toàn bộ dự án với Docker Compose

```sh
docker-compose up -d --build
```

### Kiểm tra type & testing

```sh
pnpm --filter backend typecheck
pnpm --filter frontend-client typecheck
pnpm --filter frontend-admin typecheck
```

## 📦 2. Cấu trúc thư mục

```hrm-app/
├── backend/               # Mã nguồn backend (NestJS + Prisma)
├── frontend-client/       # Mã nguồn frontend client (Vite + React)
├── frontend-admin/        # Mã nguồn frontend admin (Next.js)
├── shared/                # Mã dùng chung (types, helpers)
├── .env.example           # File mẫu biến môi trường
├── docker-compose.yml     # Cấu hình Docker Compose
├── pnpm-workspace.yaml    # Cấu hình pnpm workspaces
└── README.md              # Tài liệu hướng dẫn dự án
```

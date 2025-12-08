## 🚀 HRM App – Human Resource Management System

> **Status:** ✅ Authentication System Complete | 🚧 In Development

HRM App là hệ thống quản lý nhân sự (Human Resource Management) toàn diện, được xây dựng với kiến trúc Monorepo hiện đại. Dự án sử dụng pnpm workspaces và Turborepo để quản lý nhiều ứng dụng và packages dùng chung.

### 🎯 Tính năng đã hoàn thành

- ✅ **Authentication System** - Register, Login, JWT, Protected Routes
- ✅ **User Management** - Profile, Update Info, Change Password
- ✅ **Role-based Access Control** - ADMIN, HR, EMPLOYEE
- ✅ **Security** - Password hashing, JWT tokens, CORS, Helmet

### 📦 Dự án bao gồm

- **backend** — API sử dụng Express + TypeScript + Prisma
- **frontend-client** — Web Client (Vite + React 19 + Tailwind CSS 4)
- **frontend-admin** — Admin Panel (Next.js 15 + Turbopack)
- **shared** — Thư viện chia sẻ (types, utilities, constants)

## 🧰 Công nghệ sử dụng

### Backend

- Node.js 22+ với TypeScript
- Express.js framework
- Prisma ORM với PostgreSQL
- JWT authentication
- Bcrypt password hashing
- Zod validation

### Frontend Client

- React 19 với TypeScript
- Vite 7 build tool
- Tailwind CSS 4
- React Router v7
- Axios với interceptors
- shadcn/ui components

### Admin Panel

- Next.js 15 với App Router
- Turbopack (dev & build)
- TypeScript
- Tailwind CSS 4

### DevOps & Tools

- pnpm Workspaces
- Turborepo
- Docker & Docker Compose
- ESLint 9 (flat config)
- Prettier
- Husky + lint-staged

## 📁 Cấu trúc thư mục

```
hrm-app/
├── backend/                    # Backend API (Express + Prisma)
│   ├── prisma/                # Database schema & migrations
│   ├── src/
│   │   ├── config/           # App configuration
│   │   ├── controllers/      # Request handlers
│   │   ├── middlewares/      # Auth, validation middlewares
│   │   ├── routes/           # API routes
│   │   ├── types/            # TypeScript types & Zod schemas
│   │   └── utils/            # Helper functions
│   └── .env                  # Environment variables
├── frontend-client/           # Client app (Vite + React)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React contexts (Auth)
│   │   ├── lib/              # Utilities (axios)
│   │   ├── pages/            # Page components
│   │   └── types/            # TypeScript types
│   └── .env                  # Environment variables
├── frontend-admin/            # Admin panel (Next.js)
├── shared/                    # Shared code
├── docker-compose.yml        # Docker configuration
├── pnpm-workspace.yaml       # Monorepo config
├── turbo.json                # Turborepo config
├── AUTH_README.md            # 📘 Authentication docs
├── SETUP_GUIDE.md            # 📗 Detailed setup guide
├── QUICKSTART.md             # ⚡ Quick start guide
├── SUMMARY.md                # 📊 Project summary
└── README.md                 # This file
```

## ⚡ Quick Start

### 1️⃣ Prerequisites

```bash
# Install pnpm
npm install -g pnpm

# Install Docker Desktop (for database)
# https://www.docker.com/products/docker-desktop
```

### 2️⃣ Install Dependencies

```bash
pnpm install
```

### 3️⃣ Setup Database

```bash
# Start PostgreSQL with Docker
docker-compose up -d db

# Run migrations
cd backend
npx prisma migrate dev
```

### 4️⃣ Start Development

```bash
# From root directory
pnpm dev
```

**Services will run at:**

- 🌐 Frontend Client: http://localhost:5173
- 🔧 Backend API: http://localhost:5000
- 👨‍💼 Admin Panel: http://localhost:3000

### 5️⃣ Test Authentication

1. Open http://localhost:5173
2. Click "Đăng ký" to create an account
3. Login and access dashboard

---

## 📚 Documentation

- **[⚡ QUICKSTART.md](./QUICKSTART.md)** - Hướng dẫn nhanh để bắt đầu
- **[📘 AUTH_README.md](./AUTH_README.md)** - Chi tiết về authentication system
- **[📗 SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Hướng dẫn setup đầy đủ và troubleshooting
- **[📊 SUMMARY.md](./SUMMARY.md)** - Tổng quan dự án và tính năng

---

## ⚙️ Cài đặt & chạy dự án (Chi tiết)

### 1️⃣ Clone dự án

````bash
git clone https://github.com/KaitoKid1612/hrm-app.git
cd hrm-app

### 2️⃣ Cài đặt dependencies

```bash
pnpm install
````

### 3️⃣ Setup Environment Variables

Tạo file `.env` cho backend và frontend:

```bash
# Backend
cd backend
cp .env.example .env
# Chỉnh sửa DATABASE_URL nếu cần

# Frontend Client
cd ../frontend-client
cp .env.example .env
```

### 4️⃣ Setup Database

```bash
# Start PostgreSQL
docker-compose up -d db

# Run migrations
cd backend
npx prisma migrate dev --name init_auth_system
```

### 5️⃣ Start Development

```bash
# From root directory
pnpm dev
```

---

## 🐳 Chạy toàn bộ dự án với Docker Compose

```bash
docker-compose up -d --build
```

**Services:**

- Backend API: http://localhost:5000
- Frontend Client: http://localhost:5173
- Admin Panel: http://localhost:3000
- PostgreSQL: localhost:5432

---

## 🧪 Scripts

### Root level

```bash
pnpm dev          # Chạy tất cả services
pnpm build        # Build tất cả
pnpm lint         # Lint toàn bộ monorepo
pnpm lint:fix     # Fix lint issues
pnpm format       # Format với Prettier
```

### Backend

```bash
pnpm --filter backend dev
pnpm --filter backend build
pnpm --filter backend lint
```

### Frontend Client

```bash
pnpm --filter frontend-client dev
pnpm --filter frontend-client build
pnpm --filter frontend-client lint
```

### Frontend Admin

```bash
pnpm --filter frontend-admin dev
pnpm --filter frontend-admin build
pnpm --filter frontend-admin lint
```

---

## 🔐 API Endpoints

### Authentication (Public)

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập

### User Management (Protected)

- `GET /api/auth/profile` - Lấy thông tin user
- `PUT /api/auth/profile` - Cập nhật thông tin
- `PUT /api/auth/change-password` - Đổi mật khẩu

**Authentication:** Bearer Token in Authorization header

---

## 🗂️ pnpm Workspace

```yaml
# pnpm-workspace.yaml
packages:
  - 'backend'
  - 'frontend-*'
  - 'shared'
```

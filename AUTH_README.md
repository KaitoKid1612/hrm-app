# 🚀 HRM App - Authentication System

Hệ thống quản lý nhân sự với authentication hoàn chỉnh.

## 📋 Tính năng đã hoàn thành

### Backend

- ✅ Authentication API (Register, Login, Profile)
- ✅ JWT Token-based authentication
- ✅ Password hashing với bcrypt
- ✅ Validation với Zod
- ✅ Middleware xác thực & phân quyền
- ✅ Prisma ORM với PostgreSQL
- ✅ Role-based access control (ADMIN, HR, EMPLOYEE)

### Frontend Client

- ✅ React + TypeScript + Vite
- ✅ Auth Context với React Context API
- ✅ Login/Register pages
- ✅ Protected Routes
- ✅ Axios interceptors
- ✅ Dashboard với user info
- ✅ Tailwind CSS + shadcn/ui

## 🛠️ Tech Stack

**Backend:**

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Zod validation

**Frontend:**

- React 19
- TypeScript
- Vite
- React Router v7
- Axios
- Tailwind CSS
- shadcn/ui

## 📦 Cài đặt & Chạy dự án

### Prerequisites

```bash
# Cài đặt pnpm (nếu chưa có)
npm install -g pnpm

# Cài đặt PostgreSQL hoặc dùng Docker
```

### 1. Clone & Install

```bash
cd hrm-app
pnpm install
```

### 2. Setup Database

#### Option A: Sử dụng Docker Compose

```bash
docker-compose up -d db
```

#### Option B: PostgreSQL local

Tạo database tên `hrm_db`

### 3. Setup Environment Variables

**Backend (.env):**

```bash
cd backend
cp .env.example .env
# Chỉnh sửa DATABASE_URL nếu cần
```

**Frontend Client (.env):**

```bash
cd frontend-client
cp .env.example .env
```

### 4. Run Prisma Migrations

```bash
cd backend
pnpm prisma:generate
pnpm prisma migrate dev
```

### 5. Start Development

```bash
# Từ root directory, chạy tất cả services
pnpm dev
```

Services sẽ chạy ở:

- Backend: http://localhost:5000
- Frontend Client: http://localhost:5173
- Frontend Admin: http://localhost:3000

## 📚 API Endpoints

### Authentication

**POST** `/api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nguyễn Văn A",
  "phone": "0123456789",
  "address": "123 Đường ABC"
}
```

**POST** `/api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**GET** `/api/auth/profile`

- Headers: `Authorization: Bearer {token}`

**PUT** `/api/auth/profile`

- Headers: `Authorization: Bearer {token}`

```json
{
  "name": "Tên mới",
  "phone": "0987654321",
  "address": "Địa chỉ mới"
}
```

**PUT** `/api/auth/change-password`

- Headers: `Authorization: Bearer {token}`

```json
{
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

## 🔐 Roles

- **ADMIN**: Quản trị viên - full quyền
- **HR**: Nhân viên HR - quản lý nhân sự
- **EMPLOYEE**: Nhân viên - quyền cơ bản (default)

## 📱 Frontend Routes

- `/login` - Đăng nhập
- `/register` - Đăng ký
- `/dashboard` - Trang chủ (protected)
- `/` - Redirect to dashboard

## 🧪 Test Authentication

### 1. Đăng ký tài khoản mới

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "name": "Test User"
  }'
```

### 2. Đăng nhập

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

### 3. Lấy profile (cần token)

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🐳 Docker

Chạy toàn bộ app với Docker:

```bash
docker-compose up --build
```

## 🎯 Roadmap tiếp theo

- [ ] Employee Management (CRUD)
- [ ] Department Management
- [ ] Leave Request System
- [ ] Attendance Tracking
- [ ] Payroll Management
- [ ] File Upload (Avatar)
- [ ] Email notifications
- [ ] Password reset
- [ ] Admin dashboard

## 📝 Scripts

```bash
# Root level
pnpm dev          # Chạy tất cả services
pnpm build        # Build tất cả
pnpm lint         # Lint tất cả
pnpm lint:fix     # Fix lint issues
pnpm format       # Format với Prettier

# Backend
cd backend
pnpm dev          # Dev server với hot reload
pnpm build        # Build TypeScript
pnpm start        # Run production build
pnpm prisma:generate  # Generate Prisma Client
pnpm prisma:migrate   # Run migrations
pnpm prisma:studio    # Open Prisma Studio

# Frontend
cd frontend-client
pnpm dev          # Vite dev server
pnpm build        # Build production
pnpm preview      # Preview production build
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT

---

**Phát triển bởi:** VietLV  
**Ngày:** December 2025

# 🎯 SETUP INSTRUCTIONS - HRM APP

## ✅ Đã hoàn thành

### Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Prisma client setup
│   │   └── index.ts              # App config
│   ├── controllers/
│   │   └── auth.controller.ts    # Auth logic (register, login, profile)
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # JWT authentication & authorization
│   │   └── validate.middleware.ts # Zod validation
│   ├── routes/
│   │   ├── auth.routes.ts        # Auth endpoints
│   │   └── index.ts              # Route aggregator
│   ├── types/
│   │   └── auth.types.ts         # TypeScript types & Zod schemas
│   ├── utils/
│   │   ├── jwt.ts                # JWT token functions
│   │   └── password.ts           # Bcrypt functions
│   └── server.ts                 # Main server file
├── prisma/
│   └── schema.prisma             # Database schema với User model
├── .env                          # Environment variables
└── .env.example                  # Example env file
```

### Frontend Client Structure

```
frontend-client/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── button.tsx        # UI button component
│   │   ├── ProtectedRoute.tsx    # Protected route wrapper
│   │   └── PublicRoute.tsx       # Public route wrapper
│   ├── context/
│   │   └── AuthContext.tsx       # Auth state management
│   ├── lib/
│   │   ├── axios.ts              # Axios instance với interceptors
│   │   └── utils.ts              # Utility functions
│   ├── pages/
│   │   ├── Login.tsx             # Login page
│   │   ├── Register.tsx          # Register page
│   │   └── Dashboard.tsx         # Dashboard page (protected)
│   ├── types/
│   │   └── auth.ts               # TypeScript types
│   ├── App.tsx                   # Main app với routing
│   └── main.tsx                  # Entry point
├── .env                          # Environment variables
└── .env.example                  # Example env file
```

## 🚀 Cách chạy dự án

### Bước 1: Cài đặt PostgreSQL

#### Option A: Dùng Docker Desktop (Khuyên dùng)

```bash
# 1. Cài đặt Docker Desktop cho Windows
# Download: https://www.docker.com/products/docker-desktop

# 2. Enable WSL 2 integration trong Docker Desktop settings

# 3. Start PostgreSQL container
docker-compose up -d db
```

#### Option B: PostgreSQL trên Windows

```bash
# 1. Download PostgreSQL: https://www.postgresql.org/download/windows/
# 2. Cài đặt với default settings
# 3. Tạo database tên: hrm_db
# 4. Update backend/.env:
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/hrm_db?schema=public"
```

### Bước 2: Install dependencies (ĐÃ LÀM)

```bash
pnpm install  # ✅ Done
```

### Bước 3: Generate Prisma Client (ĐÃ LÀM)

```bash
cd backend
npx prisma generate  # ✅ Done
```

### Bước 4: Run migrations

```bash
cd backend
npx prisma migrate dev --name init_auth_system
```

### Bước 5: (Optional) Seed database

```bash
cd backend
npx prisma db seed
```

### Bước 6: Start development servers

```bash
# Từ root directory
pnpm dev
```

## 📋 Checklist để chạy được

- [x] ✅ pnpm installed
- [x] ✅ Dependencies installed
- [x] ✅ Backend code hoàn chỉnh
- [x] ✅ Frontend code hoàn chỉnh
- [x] ✅ Environment files created
- [x] ✅ Prisma schema ready
- [x] ✅ Prisma Client generated
- [ ] ⏳ PostgreSQL running
- [ ] ⏳ Database migrated
- [ ] ⏳ Servers started

## 🔑 Test Flow

1. **Đăng ký tài khoản mới**
   - Truy cập: http://localhost:5173/register
   - Nhập: email, password, name
   - Nhấn "Đăng ký"
   - → Tự động chuyển đến dashboard

2. **Đăng nhập**
   - Truy cập: http://localhost:5173/login
   - Nhập email và password
   - Nhấn "Đăng nhập"
   - → Chuyển đến dashboard

3. **Dashboard**
   - Xem thông tin user
   - Đăng xuất

## 🎨 Features

### Authentication

- ✅ Register với validation
- ✅ Login với JWT token
- ✅ Auto logout khi token hết hạn
- ✅ Protected routes
- ✅ Public routes (redirect nếu đã login)
- ✅ Loading states
- ✅ Error handling

### Security

- ✅ Password hashing (bcrypt)
- ✅ JWT tokens
- ✅ Request validation (Zod)
- ✅ Authorization middleware
- ✅ CORS configured
- ✅ Helmet for security headers

### User Management

- ✅ User profile
- ✅ Update profile
- ✅ Change password
- ✅ Role-based access (ADMIN, HR, EMPLOYEE)

## 📝 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hrm_db?schema=public"
JWT_SECRET="hrm-super-secret-jwt-key-2025-change-in-production"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### Database connection error

```bash
# Kiểm tra PostgreSQL đang chạy
# Với Docker:
docker ps | grep postgres

# Update DATABASE_URL trong backend/.env
```

### Port already in use

```bash
# Backend (5000)
lsof -ti:5000 | xargs kill -9

# Frontend (5173)
lsof -ti:5173 | xargs kill -9
```

### Prisma errors

```bash
cd backend
npx prisma generate
npx prisma migrate reset  # Reset database
```

## 📚 Next Steps

Sau khi authentication hoạt động, có thể phát triển:

1. **Employee Management**
   - CRUD employees
   - Employee list/detail
   - Search & filter

2. **Department Management**
   - Create/manage departments
   - Assign employees

3. **Leave Management**
   - Request leave
   - Approve/reject
   - Leave balance

4. **Attendance**
   - Check in/out
   - Attendance reports

5. **Payroll**
   - Salary management
   - Payroll reports

## 🎯 API Testing với cURL

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hrm.com",
    "password": "123456",
    "name": "Admin User"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hrm.com",
    "password": "123456"
  }'
```

### Get Profile (với token)

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**Status:** 🎉 Code hoàn chỉnh, chờ setup database để test!

# ⚡ QUICK START - HRM APP

## 🎯 Bạn cần làm gì tiếp theo?

### Bước 1: Setup Database (QUAN TRỌNG!)

Bạn có 2 lựa chọn:

#### 🐳 Option A: Docker (Dễ nhất - Khuyên dùng)

```bash
# 1. Cài Docker Desktop cho Windows
# Download: https://www.docker.com/products/docker-desktop

# 2. Bật WSL 2 integration trong Docker Desktop settings

# 3. Khởi động PostgreSQL
docker-compose up -d db

# 4. Chờ database khởi động (10-20s)

# 5. Run migrations
cd backend
npx prisma migrate dev --name init_auth_system
```

#### 💻 Option B: PostgreSQL trên Windows

```bash
# 1. Download PostgreSQL
https://www.postgresql.org/download/windows/

# 2. Cài đặt với password là "postgres"

# 3. Tạo database
psql -U postgres
CREATE DATABASE hrm_db;
\q

# 4. Update file backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hrm_db?schema=public"

# 5. Run migrations
cd backend
npx prisma migrate dev --name init_auth_system
```

---

### Bước 2: Start Application

```bash
# Từ root directory
pnpm dev
```

**Sẽ mở 3 services:**

- ✅ Backend: http://localhost:5000
- ✅ Frontend Client: http://localhost:5173
- ✅ Frontend Admin: http://localhost:3000

---

### Bước 3: Test Authentication

1. **Mở trình duyệt:** http://localhost:5173

2. **Click "Đăng ký"** (hoặc vào /register)
   - Nhập email: `admin@hrm.com`
   - Nhập password: `123456`
   - Nhập tên: `Admin User`
   - Click "Đăng ký"

3. **Tự động chuyển đến Dashboard**
   - Xem thông tin user
   - Click "Đăng xuất" để test logout
4. **Test Login**
   - Click "Đăng nhập"
   - Nhập email & password vừa tạo
   - → Vào được dashboard

---

## 🧪 Test API với cURL

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@hrm.com","password":"123456","name":"Test User"}'

# Copy token từ response

# 2. Get Profile (thay YOUR_TOKEN)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 Checklist

- [ ] PostgreSQL đang chạy
- [ ] `pnpm install` đã chạy (✅ done)
- [ ] Prisma migrate đã chạy
- [ ] `pnpm dev` đang chạy
- [ ] Mở http://localhost:5173
- [ ] Đăng ký tài khoản thành công
- [ ] Login thành công
- [ ] Vào dashboard được

---

## ❌ Gặp lỗi?

### "Can't reach database server"

```bash
# Kiểm tra PostgreSQL đang chạy
docker ps | grep postgres
# hoặc
pg_isready -h localhost -p 5432
```

### "Port already in use"

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### "Prisma Client not found"

```bash
cd backend
npx prisma generate
```

---

## 📚 Đọc thêm

- `AUTH_README.md` - Chi tiết về authentication
- `SETUP_GUIDE.md` - Hướng dẫn setup đầy đủ
- `SUMMARY.md` - Tổng quan dự án

---

## 🚀 Sau khi chạy được?

Bạn có thể phát triển tiếp:

1. **Employee Management** - Quản lý nhân viên
2. **Department** - Phòng ban
3. **Leave System** - Quản lý nghỉ phép
4. **Attendance** - Chấm công
5. **Payroll** - Tính lương

Tất cả đã có auth system sẵn sàng! 🎉

---

**Need help?** Check `SETUP_GUIDE.md` hoặc đọc error messages trong terminal.

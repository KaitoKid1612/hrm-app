# HRM App - Development Setup

## 🎯 Cách chạy development (Khuyến nghị)

### 1. Chạy Database bằng Docker

```bash
# Chỉ chạy PostgreSQL trong Docker
docker-compose -f docker-compose.dev.yml up -d

# Hoặc dùng lệnh npm script
pnpm dev:db
```

### 2. Chạy Backend local (có hot reload)

```bash
cd backend
pnpm install
pnpm dev
```

Backend sẽ chạy ở `http://localhost:5000` với hot reload - mỗi khi bạn sửa code, nó tự động restart.

### 3. Chạy Frontend Client local (có hot reload)

```bash
cd frontend-client
pnpm install
pnpm dev
```

Frontend sẽ chạy ở `http://localhost:5173` với Vite HMR - thay đổi code hiển thị ngay lập tức.

### 4. Chạy Frontend Admin local (có hot reload)

```bash
cd frontend-admin
pnpm install
pnpm dev
```

Admin sẽ chạy ở `http://localhost:3000` với Next.js Fast Refresh.

## 🚀 Hoặc chạy tất cả cùng lúc (từ root):

```bash
# Chạy DB
pnpm dev:db

# Terminal khác: Chạy tất cả services
pnpm dev
```

---

## 🐳 Docker chỉ dùng cho Production

Docker dùng để deploy lên server, không dùng cho development vì:

- ❌ Không có hot reload
- ❌ Phải rebuild mỗi lần sửa code
- ❌ Build chậm
- ❌ Debug khó khăn

### Chạy production build (test trước khi deploy):

```bash
docker-compose up --build -d
```

---

## 🔧 Database Setup

```bash
# Chạy migrations
cd backend
pnpm prisma:migrate

# Xem database trong UI
pnpm prisma:studio
```

---

## 📝 Scripts hữu ích

### Root level:

- `pnpm dev` - Chạy tất cả services trong dev mode
- `pnpm dev:db` - Chỉ chạy PostgreSQL
- `pnpm build` - Build tất cả
- `pnpm lint` - Check lint

### Backend:

- `pnpm dev` - Dev mode với hot reload
- `pnpm build` - Build production
- `pnpm start` - Run production build
- `pnpm prisma:studio` - Xem database

### Frontend:

- `pnpm dev` - Dev mode với hot reload
- `pnpm build` - Build production
- `pnpm preview` - Preview production build

---

## ⚡ Tại sao dev local nhanh hơn?

| Feature      | Docker Dev | Local Dev |
| ------------ | ---------- | --------- |
| Hot Reload   | ❌         | ✅        |
| Startup Time | ~30s       | ~3s       |
| Code Changes | Rebuild    | Instant   |
| Debugging    | Khó        | Dễ        |
| Performance  | Chậm       | Nhanh     |

---

## 🎨 Workflow chuẩn:

1. **Development** (Local)
   - Code và test trên máy local
   - Hot reload, debug dễ dàng
   - Commit code

2. **Staging/Testing** (Docker)
   - Build Docker image
   - Test production build
   - Kiểm tra integration

3. **Production** (Docker/Cloud)
   - Deploy Docker containers
   - Hoặc deploy lên Vercel/Render/Railway

---

## 🔥 Tips:

- Luôn chạy dev mode khi code
- Chỉ dùng Docker để test production build
- Sử dụng `.env.local` cho config dev
- Database trong Docker, app chạy local = best combo!

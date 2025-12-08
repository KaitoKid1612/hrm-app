# 🚀 Recruitment Platform – Hệ thống Tuyển dụng Nhân sự

> **Status:** ✅ Core Features Complete | 🚧 Active Development

Nền tảng tuyển dụng nhân sự toàn diện (giống TopCV), kết nối ứng viên và nhà tuyển dụng. Được xây dựng với kiến trúc **Monorepo** hiện đại, sử dụng **pnpm workspaces** và **Turborepo** để quản lý đa dự án.

---

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ](#-công-nghệ)
- [Cài đặt Local](#-cài-đặt-local)
- [Deploy lên Server](#-deploy-lên-server)
- [API Documentation](#-api-documentation)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)

---

## ✨ Tính năng

### Đã hoàn thành ✅

- **Authentication & Authorization**
  - Đăng ký, đăng nhập với JWT
  - Role-based access control (ADMIN, EMPLOYER, CANDIDATE)
  - Protected routes & middleware
  - Change password, update profile
- **Job Management (Quản lý tin tuyển dụng)**
  - CRUD tin tuyển dụng với đầy đủ thông tin
  - Pagination, search, filter theo vị trí/ngành nghề/địa điểm
  - Quản lý yêu cầu công việc, mức lương, quyền lợi
  - Trạng thái tin tuyển dụng (active, expired, closed)
- **Company Management (Quản lý công ty)**
  - CRUD thông tin công ty/nhà tuyển dụng
  - Hiển thị số lượng tin tuyển dụng đang đăng
  - Thông tin chi tiết công ty, lĩnh vực, quy mô
- **Candidate Profile (Hồ sơ ứng viên)**
  - Tạo và quản lý CV/hồ sơ cá nhân
  - Upload CV, cover letter
  - Quản lý kỹ năng, kinh nghiệm, học vấn

### Đang phát triển 🚧

- Application Management (Quản lý ứng tuyển)
- Job Matching & Recommendations (Gợi ý việc làm phù hợp)
- Interview Scheduling (Lịch phỏng vấn)
- Employer Dashboard (Dashboard nhà tuyển dụng)
- Candidate Dashboard (Dashboard ứng viên)
- Search & Filter Advanced (Tìm kiếm nâng cao)
- Notification System (Thông báo realtime)
- Reviews & Ratings (Đánh giá công ty)

---

## 🛠 Công nghệ

### Backend

- **Runtime:** Node.js 22+ với TypeScript 5.9
- **Framework:** Express 5.1
- **Database:** PostgreSQL 16 + Prisma ORM 6.16
- **Authentication:** JWT + Bcrypt
- **Validation:** Zod schemas
- **Security:** Helmet, CORS

### Frontend Client

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Routing:** React Router v7
- **HTTP Client:** Axios với interceptors
- **UI Components:** shadcn/ui

### Frontend Admin

- **Framework:** Next.js 15 (App Router)
- **Compiler:** Turbopack
- **Styling:** Tailwind CSS 4

### DevOps

- **Containerization:** Docker + Docker Compose
- **Package Manager:** pnpm 10.18
- **Monorepo Tool:** Turborepo 2.5
- **Code Quality:** ESLint 9 + Prettier 3.6
- **Git Hooks:** Husky 9 + lint-staged

---

## 💻 Cài đặt Local

### Yêu cầu hệ thống

- **Node.js:** >= 22.0.0
- **pnpm:** >= 10.0.0
- **Docker:** >= 24.0.0 (để chạy PostgreSQL)
- **Git:** >= 2.40.0

### Bước 1: Clone Repository

```bash
git clone https://github.com/KaitoKid1612/hrm-app.git
cd hrm-app
```

### Bước 2: Cài đặt pnpm (nếu chưa có)

```bash
npm install -g pnpm@10.18.0
```

### Bước 3: Cài đặt Dependencies

```bash
# Cài đặt tất cả dependencies cho monorepo
pnpm install
```

### Bước 4: Cấu hình Environment Variables

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Cập nhật file `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (local)
DATABASE_URL="postgresql://hrm_user:hrm_password@localhost:5432/hrm_db"

# JWT
JWT_SECRET="your_super_secret_jwt_key_change_this_in_production"
JWT_EXPIRES_IN="7d"

# Frontend URL (để config CORS)
FRONTEND_URL="http://localhost:5173"
```

#### Frontend Client (.env)

```bash
cd ../frontend-client
cp .env.example .env
```

Cập nhật file `frontend-client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Bước 5: Khởi động Database

```bash
# Từ thư mục root
docker compose up -d db

# Kiểm tra database đã chạy
docker ps
```

### Bước 6: Chạy Database Migrations

```bash
cd backend

# Chạy migrations
DATABASE_URL="postgresql://hrm_user:hrm_password@localhost:5432/hrm_db" npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### Bước 7: Chạy Development Server

#### Option 1: Chạy tất cả với Turbo (khuyến nghị)

```bash
# Từ thư mục root
pnpm dev
```

Ứng dụng sẽ chạy trên:

- 🚀 **Backend API:** http://localhost:5000
- 💻 **Frontend Client:** http://localhost:5173
- 🎛️ **Frontend Admin:** http://localhost:3000

#### Option 2: Chạy từng service riêng

```bash
# Terminal 1 - Backend
cd backend
pnpm dev

# Terminal 2 - Frontend Client
cd frontend-client
pnpm dev

# Terminal 3 - Frontend Admin (optional)
cd frontend-admin
pnpm dev
```

### Bước 8: Tạo User đầu tiên

Truy cập: http://localhost:5173/register

Hoặc dùng API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hrm.com",
    "password": "Admin@123",
    "name": "Admin User",
    "role": "ADMIN"
  }'
```

### Prisma Studio (Database GUI)

```bash
cd backend
npx prisma studio
# Mở http://localhost:5555
```

---

## 🚀 Deploy lên Server

### Option 1: Docker Compose (Khuyến nghị)

#### Bước 1: Chuẩn bị Server

```bash
# Cài đặt Docker & Docker Compose trên server
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Bước 2: Clone & Config

```bash
# Clone repository
git clone https://github.com/KaitoKid1612/hrm-app.git
cd hrm-app

# Tạo production .env cho backend
cd backend
cp .env.example .env.production
```

Cập nhật `backend/.env.production`:

```env
PORT=5000
NODE_ENV=production

# Database URL (Docker internal network)
DATABASE_URL="postgresql://hrm_user:hrm_password_prod@db:5432/hrm_db"

# JWT Secret - PHẢI THAY ĐỔI
JWT_SECRET="your_production_secret_key_minimum_32_characters"
JWT_EXPIRES_IN="7d"

# Frontend URL (domain của bạn)
FRONTEND_URL="https://your-domain.com"
```

#### Bước 3: Build & Deploy

```bash
# Từ thư mục root
docker compose up -d --build

# Kiểm tra logs
docker compose logs -f

# Kiểm tra containers
docker compose ps
```

#### Bước 4: Chạy Migrations trên Production

```bash
# Exec vào backend container
docker compose exec backend sh

# Chạy migrations
npx prisma migrate deploy

# Exit container
exit
```

#### Bước 5: Setup Nginx Reverse Proxy

```bash
sudo apt install nginx

# Tạo config file
sudo nano /etc/nginx/sites-available/recruitment-app
```

Nội dung file config:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend Client (Candidate Portal)
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/recruitment-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Bước 6: Setup SSL với Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx

# Tự động config SSL
sudo certbot --nginx -d your-domain.com

# Auto-renew
sudo certbot renew --dry-run
```

---

### Option 2: Deploy riêng từng service

#### Deploy Backend lên VPS/Cloud

**1. Deploy Backend:**

```bash
# Cài đặt Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài pnpm
npm install -g pnpm

# Clone & setup
git clone https://github.com/KaitoKid1612/hrm-app.git
cd hrm-app/backend
pnpm install
pnpm build

# Setup PM2 (process manager)
npm install -g pm2
pm2 start dist/server.js --name hrm-backend
pm2 startup
pm2 save
```

**2. Setup PostgreSQL trên server:**

```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql

# Trong psql:
CREATE DATABASE hrm_db;
CREATE USER hrm_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hrm_db TO hrm_user;
\q
```

**3. Deploy Frontend lên Vercel/Netlify:**

```bash
# Vercel
cd frontend-client
npx vercel

# Hoặc Netlify
npx netlify deploy --prod
```

---

### Option 3: Deploy lên Cloud Platforms

#### **Render.com** (Free tier available)

1. **Backend:**
   - Create new **Web Service**
   - Build Command: `cd backend && pnpm install && pnpm build`
   - Start Command: `cd backend && node dist/server.js`
   - Add PostgreSQL database
   - Set environment variables

2. **Frontend:**
   - Create new **Static Site**
   - Build Command: `cd frontend-client && pnpm install && pnpm build`
   - Publish Directory: `frontend-client/dist`

#### **Railway.app**

```bash
# Cài Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

#### **Heroku**

```bash
# Cài Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login & deploy
heroku login
heroku create hrm-app-backend
git push heroku main
```

---

## 🔧 Scripts hữu ích

```bash
# Development
pnpm dev              # Chạy tất cả services
pnpm build            # Build tất cả
pnpm lint             # Lint code
pnpm lint:fix         # Fix lint issues
pnpm format           # Format code với Prettier

# Database
cd backend
npx prisma studio     # Mở Prisma Studio GUI
npx prisma migrate dev --name <name>  # Tạo migration mới
npx prisma migrate reset  # Reset database (dev only!)
npx prisma generate   # Generate Prisma Client

# Docker
docker compose up -d           # Start tất cả
docker compose up -d db        # Chỉ start database
docker compose down            # Stop tất cả
docker compose logs -f         # Xem logs
docker compose ps              # Xem status containers
```

---

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

## 📖 API Documentation

### Base URL

- **Local:** `http://localhost:5000/api`
- **Production:** `https://your-domain.com/api`

### Authentication Endpoints

| Method | Endpoint                | Description           | Auth Required |
| ------ | ----------------------- | --------------------- | ------------- |
| POST   | `/auth/register`        | Đăng ký tài khoản mới | ❌            |
| POST   | `/auth/login`           | Đăng nhập             | ❌            |
| GET    | `/auth/profile`         | Lấy thông tin user    | ✅            |
| PUT    | `/auth/profile`         | Cập nhật profile      | ✅            |
| POST   | `/auth/change-password` | Đổi mật khẩu          | ✅            |

### Job Endpoints (Tin tuyển dụng)

| Method | Endpoint          | Description             | Auth Required | Roles           |
| ------ | ----------------- | ----------------------- | ------------- | --------------- |
| GET    | `/jobs`           | Danh sách việc làm      | ❌            | Public          |
| GET    | `/jobs/:id`       | Chi tiết việc làm       | ❌            | Public          |
| POST   | `/jobs`           | Đăng tin tuyển dụng     | ✅            | ADMIN, EMPLOYER |
| PUT    | `/jobs/:id`       | Cập nhật tin tuyển dụng | ✅            | ADMIN, EMPLOYER |
| DELETE | `/jobs/:id`       | Xóa tin tuyển dụng      | ✅            | ADMIN, EMPLOYER |
| GET    | `/jobs/stats`     | Thống kê                | ✅            | ADMIN, EMPLOYER |
| POST   | `/jobs/:id/apply` | Ứng tuyển               | ✅            | CANDIDATE       |

### Company Endpoints (Công ty)

| Method | Endpoint         | Description       | Auth Required | Roles           |
| ------ | ---------------- | ----------------- | ------------- | --------------- |
| GET    | `/companies`     | Danh sách công ty | ❌            | Public          |
| GET    | `/companies/:id` | Chi tiết công ty  | ❌            | Public          |
| POST   | `/companies`     | Tạo công ty       | ✅            | ADMIN, EMPLOYER |
| PUT    | `/companies/:id` | Cập nhật công ty  | ✅            | ADMIN, EMPLOYER |
| DELETE | `/companies/:id` | Xóa công ty       | ✅            | ADMIN           |

### Candidate/Application Endpoints (Ứng viên)

| Method | Endpoint                   | Description            | Auth Required | Roles           |
| ------ | -------------------------- | ---------------------- | ------------- | --------------- |
| GET    | `/candidates/profile`      | Hồ sơ ứng viên         | ✅            | CANDIDATE       |
| PUT    | `/candidates/profile`      | Cập nhật hồ sơ         | ✅            | CANDIDATE       |
| GET    | `/applications`            | Danh sách ứng tuyển    | ✅            | CANDIDATE       |
| GET    | `/applications/:id`        | Chi tiết đơn ứng tuyển | ✅            | All             |
| PUT    | `/applications/:id/status` | Cập nhật trạng thái    | ✅            | ADMIN, EMPLOYER |

---

## 📁 Cấu trúc dự án

```
recruitment-app/
├── backend/                   # Express API
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema (Jobs, Companies, Candidates)
│   │   └── migrations/
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── controllers/     # Business logic (jobs, companies, applications)
│   │   ├── middlewares/     # Auth, validation
│   │   ├── routes/         # API routes
│   │   ├── types/          # Types + Zod schemas
│   │   ├── utils/          # Helpers (JWT, password, file upload)
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
│
├── frontend-client/          # React SPA (Candidate Portal)
│   ├── src/
│   │   ├── api/            # API clients
│   │   ├── components/     # UI components (JobCard, CompanyCard, etc.)
│   │   ├── context/        # Auth context
│   │   ├── pages/         # Page components (JobList, JobDetail, Apply, etc.)
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   └── package.json
│
├── frontend-admin/          # Next.js Admin (Employer Portal)
├── shared/                  # Shared code
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## 🐛 Troubleshooting

### Database connection error

```bash
docker compose restart db
docker compose logs db
```

### Port already in use

```bash
lsof -i :5000  # Backend
lsof -i :5173  # Frontend
kill -9 <PID>
```

### Prisma Client error

```bash
cd backend
npx prisma generate
```

---

## 🤝 Contributing

1. Fork repo
2. Create branch: `git checkout -b feature/name`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/name`
5. Create Pull Request

---

## 📝 License

MIT License

---

## 👥 Author

**Viet LV** - [@KaitoKid1612](https://github.com/KaitoKid1612)

---

**⭐ Star repo nếu bạn thấy hữu ích!**

- 'backend'
- 'frontend-\*'
- 'shared'

```

```

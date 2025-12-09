# 🎯 Backend Development Roadmap - Hệ thống Tuyển dụng (TopCV-like)

## 📊 Phân tích Database & API hiện tại

### ✅ Đã có (Complete):

1. **User Management** - Auth, Users
2. **Company Management** - Companies
3. **Job Management** - Jobs, Categories, Skills
4. **Application Management** - Applications
5. **Resume/CV Management** - Resumes

### ⚠️ Chưa hoàn chỉnh:

1. **SavedJobs** - Chỉ có model, chưa có API
2. **Conversations & Messages** - Có model, chưa có API
3. **Notifications** - Có model, chưa có API
4. **Reviews** - Có model, chưa có API

### ❌ Thiếu hoàn toàn:

1. **Admin Dashboard APIs** - Statistics, Management
2. **File Upload** - CV, Avatar, Logo, Images
3. **Email Service** - Notifications, Alerts
4. **Search & Filter** - Advanced search
5. **Analytics** - View tracking, Statistics

---

## 🎭 Phân chia API theo 3 Role

### 1. **CANDIDATE (Ứng viên) - Client App**

```
✅ Auth: Register, Login, Profile
✅ Jobs: Browse, Search, View detail, Apply
✅ Applications: View my applications, Track status
✅ Resume: Create, Update, Upload CV
⚠️ SavedJobs: Save/Unsave jobs (missing API)
❌ Notifications: View notifications
❌ Reviews: Write company reviews
❌ Chat: Message with recruiters
```

### 2. **EMPLOYER (Nhà tuyển dụng) - Client App**

```
✅ Auth: Register, Login, Profile
✅ Company: Create/Update profile, Verify status
✅ Jobs: Post, Edit, Delete, Manage jobs
✅ Applications: View, Review, Update status
❌ Search Candidates: Find candidates by skills, resume
❌ Chat: Message with candidates
❌ Analytics: Job views, application stats
❌ Reviews: View company reviews, Reply
```

### 3. **ADMIN - Admin Dashboard**

```
❌ Dashboard: Statistics overview
❌ User Management: List, Ban, Activate users
❌ Company Management: Verify, Approve companies
❌ Job Management: Moderate, Remove jobs
❌ Category/Skill Management: CRUD
❌ Application Management: View all, Statistics
❌ Review Management: Moderate reviews
❌ Reports: Generate reports, Analytics
```

---

## 📅 Development Phases

## **PHASE 1: Hoàn thiện Core Features (Week 1-2)**

### 1.1. SavedJobs Module ⭐⭐⭐

**Priority: HIGH** - Feature quan trọng cho candidate

**APIs cần tạo:**

```typescript
POST   /saved-jobs          // Lưu job yêu thích
DELETE /saved-jobs/:id      // Bỏ lưu job
GET    /saved-jobs          // Danh sách jobs đã lưu (của tôi)
GET    /saved-jobs/check/:jobId  // Kiểm tra đã lưu chưa
```

**Files cần tạo:**

- `modules/saved-jobs/saved-jobs.module.ts`
- `modules/saved-jobs/saved-jobs.controller.ts`
- `modules/saved-jobs/saved-jobs.service.ts`
- `modules/saved-jobs/dto/save-job.dto.ts`

---

### 1.2. File Upload Module ⭐⭐⭐

**Priority: HIGH** - Cần thiết cho CV, Avatar, Logo

**Setup:**

```bash
npm install --save @nestjs/platform-express multer
npm install --save-dev @types/multer
npm install cloudinary  # Hoặc dùng local storage
```

**APIs cần tạo:**

```typescript
POST /upload/cv          // Upload CV file
POST /upload/avatar      // Upload user avatar
POST /upload/company-logo    // Upload company logo
POST /upload/company-cover   // Upload company cover image
DELETE /upload/:fileId   // Delete file
```

**Files cần tạo:**

- `modules/upload/upload.module.ts`
- `modules/upload/upload.controller.ts`
- `modules/upload/upload.service.ts`
- `modules/upload/cloudinary.service.ts` (optional)
- `common/interceptors/file-upload.interceptor.ts`

**Update existing:**

- Resume: Thêm upload CV
- User: Thêm upload avatar
- Company: Thêm upload logo, cover

---

### 1.3. Notifications Module ⭐⭐⭐

**Priority: HIGH** - Real-time updates

**APIs cần tạo:**

```typescript
GET    /notifications           // Lấy danh sách thông báo
GET    /notifications/unread    // Đếm chưa đọc
PATCH  /notifications/:id/read  // Đánh dấu đã đọc
PATCH  /notifications/read-all  // Đánh dấu tất cả đã đọc
DELETE /notifications/:id       // Xóa thông báo
```

**Notification Types:**

- `application_status` - Trạng thái đơn ứng tuyển thay đổi
- `new_job` - Có job mới phù hợp
- `job_deadline` - Job sắp hết hạn
- `company_verified` - Công ty được xác minh
- `new_application` - Có đơn ứng tuyển mới (employer)

**Files cần tạo:**

- `modules/notifications/notifications.module.ts`
- `modules/notifications/notifications.controller.ts`
- `modules/notifications/notifications.service.ts`
- `modules/notifications/dto/notification.dto.ts`

**Integration:**

- Hook vào Applications service (status change)
- Hook vào Jobs service (new job)
- Hook vào Companies service (verification)

---

### 1.4. Email Service ⭐⭐⭐

**Priority: HIGH** - Communication

**Setup:**

```bash
npm install --save @nestjs-modules/mailer nodemailer
npm install --save handlebars
npm install --save-dev @types/nodemailer
```

**Email Templates:**

- Welcome email (registration)
- Application received (candidate)
- Application status changed
- New job alert
- Company verification
- Password reset

**Files cần tạo:**

- `modules/mail/mail.module.ts`
- `modules/mail/mail.service.ts`
- `modules/mail/templates/` (HTML templates)
- `modules/mail/dto/send-email.dto.ts`

---

### 1.5. Enhanced Search & Filter ⭐⭐

**Priority: MEDIUM** - Better UX

**Update Jobs APIs:**

```typescript
GET /jobs?
  search=keyword           // Full-text search
  &category=id            // Filter by category
  &skills=id1,id2         // Filter by skills
  &jobType=FULL_TIME      // Filter by job type
  &jobLevel=JUNIOR        // Filter by level
  &city=Hanoi             // Filter by city
  &salaryMin=1000         // Salary range
  &salaryMax=5000
  &experience=1-3         // Experience level
  &page=1                 // Pagination
  &limit=20
  &sortBy=createdAt       // Sort field
  &sortOrder=desc         // Sort order
```

**Update existing:**

- `modules/jobs/jobs.service.ts` - Enhance search logic
- `modules/jobs/dto/job.dto.ts` - Add filter DTOs

---

## **PHASE 2: Admin Dashboard APIs (Week 3)**

### 2.1. Admin Statistics Dashboard ⭐⭐⭐

**Priority: HIGH**

**APIs cần tạo:**

```typescript
GET / admin / dashboard / stats; // Tổng quan
GET / admin / dashboard / charts; // Dữ liệu biểu đồ
GET / admin / dashboard / recent - activities; // Hoạt động gần đây
```

**Statistics:**

- Total users (by role)
- Total companies (verified/pending)
- Total jobs (active/expired)
- Total applications (by status)
- Growth charts (users, jobs, applications over time)
- Top companies, Top jobs, Top categories

**Files cần tạo:**

- `modules/admin/admin.module.ts`
- `modules/admin/dashboard/dashboard.controller.ts`
- `modules/admin/dashboard/dashboard.service.ts`
- `modules/admin/dto/stats.dto.ts`

---

### 2.2. Admin User Management ⭐⭐⭐

**Priority: HIGH**

**APIs cần tạo:**

```typescript
GET    /admin/users              // Danh sách users
GET    /admin/users/:id          // Chi tiết user
PATCH  /admin/users/:id/ban      // Ban user
PATCH  /admin/users/:id/activate // Activate user
PATCH  /admin/users/:id/role     // Change role
DELETE /admin/users/:id          // Delete user
```

**Files cần tạo:**

- `modules/admin/users/admin-users.controller.ts`
- `modules/admin/users/admin-users.service.ts`

---

### 2.3. Admin Company Management ⭐⭐⭐

**Priority: HIGH**

**APIs cần tạo:**

```typescript
GET   /admin/companies                  // Danh sách companies
GET   /admin/companies/pending          // Companies chờ verify
GET   /admin/companies/:id              // Chi tiết company
PATCH /admin/companies/:id/verify       // Xác minh company
PATCH /admin/companies/:id/reject       // Từ chối xác minh
DELETE /admin/companies/:id             // Delete company
```

**Files cần tạo:**

- `modules/admin/companies/admin-companies.controller.ts`
- `modules/admin/companies/admin-companies.service.ts`

---

### 2.4. Admin Job Management ⭐⭐

**Priority: MEDIUM**

**APIs cần tạo:**

```typescript
GET    /admin/jobs              // Tất cả jobs
GET    /admin/jobs/reported     // Jobs bị report
PATCH  /admin/jobs/:id/hide     // Ẩn job
PATCH  /admin/jobs/:id/unhide   // Hiện job
DELETE /admin/jobs/:id          // Xóa job
```

**Files cần tạo:**

- `modules/admin/jobs/admin-jobs.controller.ts`
- `modules/admin/jobs/admin-jobs.service.ts`

---

### 2.5. Admin Categories & Skills Management ⭐

**Priority: LOW** - Đã có API, chỉ cần thêm guards

**Update existing:**

- Add `@Roles(Role.ADMIN)` guard
- Add bulk operations

---

## **PHASE 3: Advanced Features (Week 4)**

### 3.1. Reviews Module ⭐⭐

**Priority: MEDIUM** - Build trust

**APIs cần tạo:**

```typescript
POST   /reviews                      // Viết review công ty
GET    /reviews/company/:companyId   // Reviews của công ty
GET    /reviews/my-reviews           // Reviews của tôi
PATCH  /reviews/:id                  // Sửa review
DELETE /reviews/:id                  // Xóa review

// Admin
GET    /admin/reviews                // Tất cả reviews
PATCH  /admin/reviews/:id/verify     // Verify review
DELETE /admin/reviews/:id            // Xóa review spam
```

**Features:**

- Rating 1-5 stars
- Pros & Cons
- Anonymous option
- Admin verification

**Files cần tạo:**

- `modules/reviews/reviews.module.ts`
- `modules/reviews/reviews.controller.ts`
- `modules/reviews/reviews.service.ts`
- `modules/reviews/dto/review.dto.ts`

---

### 3.2. Chat/Messaging Module ⭐⭐

**Priority: MEDIUM** - Communication

**Setup:**

```bash
npm install --save @nestjs/websockets @nestjs/platform-socket.io
npm install --save socket.io
```

**APIs cần tạo:**

```typescript
// REST APIs
GET  /conversations              // Danh sách conversations
GET  /conversations/:id          // Chi tiết conversation
POST /conversations              // Tạo conversation mới
POST /conversations/:id/messages // Gửi message
GET  /conversations/:id/messages // Lấy messages

// WebSocket Events
connect                          // Kết nối
disconnect                       // Ngắt kết nối
message:send                     // Gửi message
message:received                 // Nhận message
typing:start                     // Đang typing
typing:stop                      // Dừng typing
```

**Files cần tạo:**

- `modules/chat/chat.module.ts`
- `modules/chat/chat.gateway.ts` (WebSocket)
- `modules/chat/chat.controller.ts` (REST)
- `modules/chat/chat.service.ts`
- `modules/chat/dto/message.dto.ts`

---

### 3.3. Candidate Search (for Employers) ⭐⭐

**Priority: MEDIUM**

**APIs cần tạo:**

```typescript
GET /candidates/search?
  skills=id1,id2           // Filter by skills
  &category=id             // Filter by category
  &experience=1-3          // Experience level
  &city=Hanoi             // Location
  &availability=immediate  // Availability
```

**Files cần tạo:**

- `modules/candidates/candidates.module.ts`
- `modules/candidates/candidates.controller.ts`
- `modules/candidates/candidates.service.ts`

---

### 3.4. Analytics & Tracking ⭐⭐

**Priority: MEDIUM**

**Features:**

- Job view tracking
- Application tracking
- Company page views
- Search analytics

**APIs cần tạo:**

```typescript
// Employer Analytics
GET /analytics/jobs/:id/views        // Job views
GET /analytics/jobs/:id/applications // Application stats
GET /analytics/company/overview      // Company overview

// Admin Analytics
GET /admin/analytics/overview        // System overview
GET /admin/analytics/trends          // Trends
```

**Files cần tạo:**

- `modules/analytics/analytics.module.ts`
- `modules/analytics/analytics.controller.ts`
- `modules/analytics/analytics.service.ts`

---

### 3.5. Job Alerts & Recommendations ⭐

**Priority: LOW**

**Features:**

- Email alerts cho jobs mới
- Job recommendations dựa trên resume
- Similar jobs

**APIs cần tạo:**

```typescript
POST   /job-alerts              // Tạo job alert
GET    /job-alerts              // Danh sách alerts
PATCH  /job-alerts/:id          // Cập nhật alert
DELETE /job-alerts/:id          // Xóa alert

GET    /jobs/:id/similar        // Similar jobs
GET    /jobs/recommended        // Recommended jobs
```

---

## **PHASE 4: Polish & Optimization (Week 5)**

### 4.1. Security Enhancements

- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Helmet.js
- [ ] Input sanitization
- [ ] SQL injection prevention
- [ ] XSS prevention

### 4.2. Performance Optimization

- [ ] Database indexing
- [ ] Query optimization
- [ ] Redis caching
- [ ] Image optimization
- [ ] API response pagination

### 4.3. Testing

- [ ] Unit tests (>80% coverage)
- [ ] Integration tests
- [ ] E2E tests
- [ ] Load testing

### 4.4. Documentation

- [ ] Swagger/OpenAPI docs
- [ ] API examples
- [ ] Authentication guide
- [ ] Error codes documentation

---

## 🎯 Summary - Ưu tiên làm theo thứ tự

### ✅ Tuần 1-2: Core Features

1. **SavedJobs** (1 ngày)
2. **File Upload** (2 ngày)
3. **Notifications** (2 ngày)
4. **Email Service** (2 ngày)
5. **Enhanced Search** (1 ngày)

### ✅ Tuần 3: Admin Dashboard

1. **Admin Statistics** (2 ngày)
2. **Admin User Management** (1 ngày)
3. **Admin Company Management** (1.5 ngày)
4. **Admin Job Management** (1 ngày)
5. **Guards & Permissions** (0.5 ngày)

### ✅ Tuần 4: Advanced Features

1. **Reviews Module** (2 ngày)
2. **Chat/Messaging** (2 ngày)
3. **Candidate Search** (1 ngày)
4. **Analytics** (1 ngày)

### ✅ Tuần 5: Polish

1. Security & Performance
2. Testing
3. Documentation

---

## 📝 Notes

### Database Changes Needed:

```prisma
// Có thể cần thêm:
model JobAlert {
  id         String   @id @default(cuid())
  userId     String
  categoryId String?
  skills     String[] // Array of skill IDs
  jobType    JobType?
  city       String?
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
}

model ActivityLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String   // view_job, apply_job, etc.
  entityType String  // job, company, user
  entityId  String
  metadata  Json?
  createdAt DateTime @default(now())
}
```

### Environment Variables Needed:

```env
# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@yourapp.com

# Cloudinary (or AWS S3)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Redis (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379

# WebSocket
SOCKET_PORT=3001
```

---

**Bắt đầu từ đâu?**
👉 **Phase 1.1 - SavedJobs Module** (Đơn giản nhất, quan trọng cho UX)

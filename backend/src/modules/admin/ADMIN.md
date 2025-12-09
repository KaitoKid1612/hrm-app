# Admin Module - Phase 2

Complete admin dashboard and management system for HRM recruitment platform.

## 🔐 Authentication

**All endpoints require:**

- JWT Authentication
- Role: `ADMIN`

**Headers:**

```
Authorization: Bearer <admin-jwt-token>
```

---

## 📊 Dashboard & Analytics

### 1. Dashboard Statistics

**GET** `/admin/dashboard`

Get overview statistics for admin dashboard.

**Query Parameters:**

- `startDate` (optional): Start date for period stats (ISO 8601)
- `endDate` (optional): End date for period stats (ISO 8601)
- Default: Last 30 days

**Response:**

```json
{
  "overview": {
    "totalUsers": 1500,
    "totalCompanies": 300,
    "totalJobs": 2500,
    "totalApplications": 5000,
    "activeJobs": 1800,
    "expiredJobs": 700,
    "verifiedCompanies": 250,
    "pendingCompanies": 50
  },
  "period": {
    "startDate": "2024-11-09",
    "endDate": "2024-12-09",
    "newUsers": 150,
    "newCompanies": 30,
    "newJobs": 200,
    "newApplications": 500
  },
  "usersByRole": [
    { "role": "CANDIDATE", "count": 1200 },
    { "role": "EMPLOYER", "count": 280 },
    { "role": "ADMIN", "count": 20 }
  ],
  "topCompanies": [
    {
      "id": "uuid",
      "name": "Tech Company",
      "logo": "https://...",
      "isVerified": true,
      "_count": { "jobs": 150 }
    }
  ],
  "topJobs": [
    {
      "id": "uuid",
      "title": "Senior Backend Developer",
      "company": { "id": "uuid", "name": "Tech Company", "logo": "..." },
      "viewCount": 500,
      "createdAt": "2024-12-01",
      "_count": { "applications": 50 }
    }
  ],
  "recentActivities": {
    "users": [...],
    "applications": [...]
  }
}
```

---

### 2. Analytics

**GET** `/admin/analytics`

Get detailed analytics with charts data.

**Query Parameters:**

- `startDate` (optional): Start date
- `endDate` (optional): End date
- Default: Last 30 days

**Response:**

```json
{
  "period": {
    "startDate": "2024-11-09",
    "endDate": "2024-12-09"
  },
  "dailyStats": [
    {
      "date": "2024-12-01",
      "users": 10,
      "companies": 2,
      "jobs": 15,
      "applications": 30
    }
  ],
  "applicationsByStatus": [
    { "status": "PENDING", "count": 200 },
    { "status": "REVIEWING", "count": 150 },
    { "status": "ACCEPTED", "count": 50 }
  ],
  "jobsByCategory": [{ "categoryId": "uuid", "categoryName": "IT - Phần mềm", "count": 500 }],
  "jobsByLocation": [
    { "city": "Hà Nội", "count": 600 },
    { "city": "TP.HCM", "count": 500 }
  ]
}
```

---

## 👥 User Management

### 1. Get All Users

**GET** `/admin/users`

List all users with filters and pagination.

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 20)
- `keyword` (string): Search in name, email, phone
- `role` (enum): ADMIN, EMPLOYER, CANDIDATE
- `isActive` (boolean): Filter by active status
- `sortBy` (enum): createdAt, name, email
- `sortOrder` (enum): asc, desc

**Example:**

```bash
GET /admin/users?keyword=nguyen&role=CANDIDATE&page=1&limit=20
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Nguyễn Văn A",
      "phone": "0912345678",
      "role": "CANDIDATE",
      "isActive": true,
      "createdAt": "2024-12-01",
      "_count": {
        "applications": 10,
        "savedJobs": 5
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### 2. Get User by ID

**GET** `/admin/users/:id`

Get detailed information about a specific user.

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Nguyễn Văn A",
  "phone": "0912345678",
  "role": "CANDIDATE",
  "isActive": true,
  "company": {...},
  "applications": [...],
  "savedJobs": [...],
  "_count": {
    "applications": 10,
    "savedJobs": 5
  }
}
```

---

### 3. Update User

**PUT** `/admin/users/:id`

Update user information or status.

**Body:**

```json
{
  "isActive": false,
  "role": "EMPLOYER",
  "note": "Admin note about this user"
}
```

**Use Cases:**

- Deactivate/suspend user accounts
- Change user roles
- Add admin notes

---

### 4. Delete User

**DELETE** `/admin/users/:id`

Soft delete user (deactivate account).

**Response:**

```json
{
  "message": "Đã vô hiệu hóa user thành công"
}
```

---

## 🏢 Company Management

### 1. Get All Companies

**GET** `/admin/companies`

List all companies with filters.

**Query Parameters:**

- `page`, `limit`
- `keyword`: Search in name, description
- `isVerified` (boolean)
- `isFeatured` (boolean)
- `city` (string)
- `sortBy`: createdAt, name, jobsCount
- `sortOrder`: asc, desc

**Example:**

```bash
GET /admin/companies?isVerified=false&sortBy=jobsCount&sortOrder=desc
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Tech Company",
      "logo": "https://...",
      "isVerified": false,
      "isFeatured": false,
      "city": "Hà Nội",
      "user": {
        "id": "uuid",
        "email": "hr@company.com",
        "name": "HR Manager"
      },
      "_count": {
        "jobs": 15
      }
    }
  ],
  "meta": {...}
}
```

---

### 2. Get Company by ID

**GET** `/admin/companies/:id`

Get detailed company information with all jobs.

**Response:**

```json
{
  "id": "uuid",
  "name": "Tech Company",
  "description": "...",
  "logo": "https://...",
  "isVerified": true,
  "isFeatured": false,
  "user": {...},
  "jobs": [...]
}
```

---

### 3. Update Company

**PUT** `/admin/companies/:id`

Update company verification status or features.

**Body:**

```json
{
  "isVerified": true,
  "isFeatured": true,
  "adminNote": "Verified on 2024-12-09"
}
```

**Use Cases:**

- Verify legitimate companies
- Feature premium companies
- Add admin notes

---

### 4. Delete Company

**DELETE** `/admin/companies/:id`

Delete company (only if no active jobs).

**Response:**

```json
{
  "message": "Xóa công ty thành công"
}
```

**Error (if has jobs):**

```json
{
  "statusCode": 403,
  "message": "Không thể xóa công ty có công việc đang tồn tại"
}
```

---

## 💼 Job Management

### 1. Get All Jobs

**GET** `/admin/jobs`

List all jobs with filters.

**Query Parameters:**

- `page`, `limit`
- `keyword`: Search in title, description
- `isActive` (boolean)
- `isHot` (boolean)
- `isUrgent` (boolean)
- `companyId` (string)
- `categoryId` (string)
- `sortBy`: createdAt, viewCount, applicationsCount, deadline
- `sortOrder`: asc, desc

**Example:**

```bash
GET /admin/jobs?isActive=true&isHot=true&sortBy=viewCount&sortOrder=desc
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Senior Backend Developer",
      "isActive": true,
      "isHot": true,
      "isUrgent": false,
      "viewCount": 500,
      "deadline": "2024-12-31",
      "company": {...},
      "category": {...},
      "_count": {
        "applications": 50
      }
    }
  ],
  "meta": {...}
}
```

---

### 2. Get Job by ID

**GET** `/admin/jobs/:id`

Get detailed job information with applications.

**Response:**

```json
{
  "id": "uuid",
  "title": "Senior Backend Developer",
  "description": "...",
  "company": {...},
  "category": {...},
  "skills": [...],
  "applications": [
    {
      "id": "uuid",
      "status": "PENDING",
      "user": {
        "id": "uuid",
        "name": "Candidate Name",
        "email": "candidate@example.com"
      },
      "createdAt": "2024-12-09"
    }
  ],
  "_count": {
    "applications": 50
  }
}
```

---

### 3. Update Job

**PUT** `/admin/jobs/:id`

Update job status or features.

**Body:**

```json
{
  "isActive": false,
  "isHot": true,
  "isUrgent": false,
  "adminNote": "Featured until 2024-12-31"
}
```

**Use Cases:**

- Deactivate inappropriate jobs
- Mark jobs as hot/featured
- Mark urgent hiring jobs
- Add admin notes

---

### 4. Delete Job

**DELETE** `/admin/jobs/:id`

Permanently delete job.

**Response:**

```json
{
  "message": "Xóa công việc thành công"
}
```

---

## 📈 Common Use Cases

### 1. Monitor Platform Health

```typescript
// Dashboard overview
const dashboard = await fetch('/admin/dashboard');

// Check for pending verifications
const pendingCompanies = await fetch('/admin/companies?isVerified=false');

// Check inactive users
const inactiveUsers = await fetch('/admin/users?isActive=false');
```

### 2. Verify New Company

```typescript
// 1. Get company details
const company = await fetch('/admin/companies/uuid-123');

// 2. Review company info
// 3. Verify
await fetch('/admin/companies/uuid-123', {
  method: 'PUT',
  body: JSON.stringify({ isVerified: true }),
});
```

### 3. Moderate Content

```typescript
// Find suspicious jobs
const jobs = await fetch('/admin/jobs?keyword=scam');

// Deactivate job
await fetch('/admin/jobs/uuid-123', {
  method: 'PUT',
  body: JSON.stringify({
    isActive: false,
    adminNote: 'Deactivated: suspicious content',
  }),
});
```

### 4. Feature Premium Company

```typescript
await fetch('/admin/companies/uuid-123', {
  method: 'PUT',
  body: JSON.stringify({
    isFeatured: true,
    adminNote: 'Premium package until 2024-12-31',
  }),
});
```

### 5. Analytics Report

```typescript
// Get 30-day analytics
const analytics = await fetch('/admin/analytics?startDate=2024-11-09&endDate=2024-12-09');

// Extract data for charts
const dailyStats = analytics.dailyStats; // Line chart
const byStatus = analytics.applicationsByStatus; // Pie chart
const byCategory = analytics.jobsByCategory; // Bar chart
const byLocation = analytics.jobsByLocation; // Map/bar chart
```

---

## 🎯 Admin Dashboard UI Components

### Overview Cards

```typescript
<StatsCard title="Total Users" value={dashboard.overview.totalUsers} />
<StatsCard title="Active Jobs" value={dashboard.overview.activeJobs} />
<StatsCard title="Pending Companies" value={dashboard.overview.pendingCompanies} />
<StatsCard title="New Users (30d)" value={dashboard.period.newUsers} />
```

### Charts

```typescript
// Line chart: Daily growth
<LineChart data={analytics.dailyStats} />

// Pie chart: Applications by status
<PieChart data={analytics.applicationsByStatus} />

// Bar chart: Jobs by category
<BarChart data={analytics.jobsByCategory} />
```

### Tables

```typescript
// User management
<UserTable users={users.data} onUpdate={handleUpdate} onDelete={handleDelete} />

// Company verification
<CompanyTable companies={companies.data} onVerify={handleVerify} />

// Job moderation
<JobTable jobs={jobs.data} onDeactivate={handleDeactivate} />
```

---

## 🔒 Security Notes

1. **Only ADMIN role** can access these endpoints
2. **Soft delete** for users (set `isActive: false`)
3. **Prevent deletion** of companies with active jobs
4. **Audit logs** should be added for admin actions
5. **Rate limiting** should be applied to prevent abuse

---

## 🚀 Next Steps

**Phase 3 Features:**

- Audit logs (track all admin actions)
- Bulk operations (bulk activate/deactivate)
- Reports export (CSV, PDF)
- Email notifications to users (verification, warnings)
- Advanced analytics (conversion rates, trends)
- System settings management

---

## 📝 Notes

- All pagination uses default `limit: 20` for admin
- Statistics cache for 5 minutes (add caching layer)
- Daily analytics calculation may be slow for large date ranges
- Consider background jobs for analytics generation
- Add indexes on frequently filtered fields

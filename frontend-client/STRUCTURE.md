# Frontend Client Structure

## 📁 Cấu trúc dự án tuyển dụng (Frontend Client)

```
frontend-client/src/
├── features/                    # Feature-based modules
│   ├── auth/                   # Đăng nhập, Đăng ký, Quên mật khẩu
│   │   ├── components/         # LoginPage, RegisterPage, ForgotPassword
│   │   ├── hooks/              # useAuth, useLogin, useRegister
│   │   ├── services/           # authService.ts
│   │   └── types/              # auth types
│   │
│   ├── jobs/                   # Tìm việc, Danh sách công việc
│   │   ├── components/         # JobList, JobCard, JobDetail, JobSearch, JobFilters
│   │   ├── hooks/              # useJobs, useJobDetail, useJobSearch
│   │   ├── services/           # jobService.ts
│   │   └── types/              # job types
│   │
│   ├── applications/           # Quản lý đơn ứng tuyển
│   │   ├── components/         # ApplicationList, ApplicationDetail, ApplicationForm
│   │   ├── hooks/              # useApplications, useApplyJob
│   │   ├── services/           # applicationService.ts
│   │   └── types/              # application types
│   │
│   ├── profile/                # Hồ sơ cá nhân (Candidate)
│   │   ├── components/         # ProfileForm, ResumeUpload, SkillsManagement
│   │   ├── hooks/              # useProfile, useResume
│   │   ├── services/           # profileService.ts
│   │   └── types/              # profile types
│   │
│   ├── company/                # Trang công ty (cho Employer)
│   │   ├── components/         # CompanyProfile, CompanyDashboard, PostJob
│   │   ├── hooks/              # useCompany, usePostJob
│   │   ├── services/           # companyService.ts
│   │   └── types/              # company types
│   │
│   ├── candidates/             # Xem ứng viên (cho Employer)
│   │   ├── components/         # CandidateList, CandidateDetail
│   │   ├── hooks/              # useCandidates
│   │   ├── services/           # candidateService.ts
│   │   └── types/              # candidate types
│   │
│   └── dashboard/              # Dashboard chung
│       ├── components/         # DashboardCandidate, DashboardEmployer
│       ├── hooks/              # useDashboard
│       ├── services/           # dashboardService.ts
│       └── types/              # dashboard types
│
├── components/                 # Shared components
│   ├── ui/                     # Shadcn/ui components
│   ├── layout/                 # Header, Footer, Sidebar, Layout
│   └── common/                 # SearchBar, Pagination, Modal, etc.
│
├── hooks/                      # Global custom hooks
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── index.ts
│
├── services/                   # API services
│   ├── api.ts                  # Axios instance
│   ├── authService.ts
│   ├── jobService.ts
│   └── index.ts
│
├── routes/                     # Route definitions
│   ├── index.tsx               # Main routes
│   ├── ProtectedRoute.tsx
│   └── PublicRoute.tsx
│
├── constants/                  # Constants & Enums
│   ├── enums.ts                # Role, JobType, ApplicationStatus
│   ├── routes.ts               # Route paths
│   └── index.ts
│
├── types/                      # Global TypeScript types
│   ├── api.ts
│   ├── common.ts
│   └── index.ts
│
├── lib/                        # Utilities & configs
│   ├── axios.ts
│   ├── utils.ts
│   └── validators.ts
│
├── context/                    # React Context (legacy - sẽ di chuyển dần)
│   └── AuthContext.tsx
│
└── assets/                     # Static assets
    ├── images/
    └── icons/
```

## 🎯 Các tính năng chính:

### Candidate (Ứng viên):

- Tìm kiếm việc làm
- Xem chi tiết công việc
- Ứng tuyển công việc
- Quản lý hồ sơ cá nhân
- Upload CV
- Theo dõi đơn ứng tuyển
- Lưu công việc yêu thích

### Employer (Nhà tuyển dụng):

- Đăng tin tuyển dụng
- Quản lý công ty
- Xem danh sách ứng viên
- Quản lý đơn ứng tuyển
- Tìm kiếm ứng viên

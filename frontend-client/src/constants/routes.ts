// Route paths
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Job routes
  JOBS: '/jobs',
  JOB_DETAIL: '/jobs/:id',
  JOB_SEARCH: '/jobs/search',

  // Auth routes (Candidate)
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  MY_APPLICATIONS: '/my-applications',
  SAVED_JOBS: '/saved-jobs',
  MY_RESUME: '/my-resume',
  RECOMMENDED_JOBS: '/recommended-jobs',

  // Company routes (Employer)
  COMPANY_DASHBOARD: '/company/dashboard',
  COMPANY_PROFILE: '/company/profile',
  POST_JOB: '/company/post-job',
  EDIT_JOB: '/company/jobs/:id/edit',
  MANAGE_JOBS: '/company/jobs',
  MANAGE_APPLICATIONS: '/company/applications',
  APPLICATION_DETAIL: '/company/applications/:id',
  CANDIDATES: '/company/candidates',
  INVITE_CANDIDATES: '/company/invite-candidates',
  COMPANY_INTERVIEWS: '/company/interviews',
  INTERVIEW_DETAIL: '/company/interviews/:id',
  COMPANY_SCHEDULE_INTERVIEW: '/company/interviews/schedule',
  COMPANY_ANALYTICS: '/company/analytics',
  NOTIFICATIONS: '/notifications',

  // Other
  COMPANIES: '/companies',
  COMPANY_DETAIL: '/companies/:id',
  COMPANY_REVIEWS: '/companies/:id/reviews',
  SETTINGS: '/settings',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

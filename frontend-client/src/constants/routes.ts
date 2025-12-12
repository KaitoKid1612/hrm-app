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

  // Company routes (Employer)
  COMPANY_DASHBOARD: '/company/dashboard',
  COMPANY_PROFILE: '/company/profile',
  POST_JOB: '/company/post-job',
  MANAGE_JOBS: '/company/jobs',
  MANAGE_APPLICATIONS: '/company/applications',
  CANDIDATES: '/company/candidates',
  INVITE_CANDIDATES: '/company/invite-candidates',
  NOTIFICATIONS: '/notifications',

  // Other
  COMPANIES: '/companies',
  COMPANY_DETAIL: '/companies/:id',
  SETTINGS: '/settings',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

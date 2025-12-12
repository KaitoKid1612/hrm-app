export * from './enums';
export * from './routes';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/profile',
  },
  JOBS: {
    LIST: '/jobs/search/all',
    DETAIL: (id: string) => `/jobs/${id}`,
    CREATE: '/jobs',
    UPDATE: (id: string) => `/jobs/${id}`,
    DELETE: (id: string) => `/jobs/${id}`,
    SEARCH: '/jobs/search/all',
    TRENDING: '/jobs/search/trending',
    STATISTICS: '/jobs/search/statistics',
    SUGGESTIONS: '/jobs/search/suggestions',
    SIMILAR: (id: string) => `/jobs/${id}/similar`,
  },
  APPLICATIONS: {
    MY_APPLICATIONS: '/applications/my-applications',
    JOB_APPLICATIONS: (jobId: string) => `/applications/job/${jobId}`,
    CREATE: '/applications',
    UPDATE_STATUS: (id: string) => `/applications/${id}/status`,
  },
  PROFILE: {
    GET: '/auth/profile',
    UPDATE: '/auth/profile',
  },
  RESUME: {
    MY_RESUME: '/resumes/my-resume',
    DETAIL: (id: string) => `/resumes/${id}`,
    UPSERT: '/resumes',
  },
  COMPANY: {
    LIST: '/companies',
    DETAIL: (id: string) => `/companies/${id}`,
    MY_PROFILE: '/companies/my/profile',
    CREATE: '/companies',
    UPDATE: (id: string) => `/companies/${id}`,
  },
  SAVED_JOBS: {
    LIST: '/saved-jobs',
    SAVE: '/saved-jobs',
    UNSAVE: (id: string) => `/saved-jobs/${id}`,
    CHECK: (jobId: string) => `/saved-jobs/check/${jobId}`,
    IDS: '/saved-jobs/ids',
  },
  INVITES: {
    BULK: '/invites/bulk',
    UPLOAD_CSV: (jobId: string) => `/invites/upload-csv/${jobId}`,
    JOB_INVITES: (jobId: string) => `/invites/job/${jobId}`,
    MY_INVITES: '/invites/my-invites',
  },
  ANALYTICS: {
    PLATFORM: '/analytics/platform',
    COMPANY: '/analytics/company',
    CANDIDATE: '/analytics/candidate',
    JOB: (id: string) => `/analytics/jobs/${id}`,
  },
} as const;

// Other constants
export const APP_CONFIG = {
  APP_NAME: 'Vũng Áng Jobs',
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  ITEMS_PER_PAGE: 20,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

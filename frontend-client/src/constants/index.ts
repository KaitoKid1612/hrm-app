export * from './enums';
export * from './routes';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },
  JOBS: {
    LIST: '/jobs',
    DETAIL: (id: string) => `/jobs/${id}`,
    CREATE: '/jobs',
    UPDATE: (id: string) => `/jobs/${id}`,
    DELETE: (id: string) => `/jobs/${id}`,
    SEARCH: '/jobs/search',
    SAVED: '/jobs/saved',
  },
  APPLICATIONS: {
    LIST: '/applications',
    DETAIL: (id: string) => `/applications/${id}`,
    CREATE: '/applications',
    UPDATE: (id: string) => `/applications/${id}`,
    WITHDRAW: (id: string) => `/applications/${id}/withdraw`,
  },
  PROFILE: {
    GET: '/users/profile',
    UPDATE: '/users/profile',
    UPLOAD_AVATAR: '/users/avatar',
  },
  RESUME: {
    GET: '/resumes',
    CREATE: '/resumes',
    UPDATE: (id: string) => `/resumes/${id}`,
    UPLOAD: '/resumes/upload',
  },
  COMPANY: {
    GET: '/companies',
    UPDATE: '/companies',
    UPLOAD_LOGO: '/companies/logo',
  },
  CANDIDATES: {
    LIST: '/candidates',
    DETAIL: (id: string) => `/candidates/${id}`,
    SEARCH: '/candidates/search',
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

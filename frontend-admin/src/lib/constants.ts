/**
 * Application constants
 * Centralized place for all constant values used throughout the app
 */

// ============= API & Environment =============

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// ============= Authentication =============

export const AUTH_CONFIG = {
  TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user',
  TOKEN_EXPIRY_DAYS: 1,
  REFRESH_TOKEN_EXPIRY_DAYS: 7,
} as const;

// ============= Pagination =============

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_LIMIT: 100,
} as const;

// ============= File Upload =============

export const FILE_UPLOAD = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_PDF_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  DOCUMENT_EXTENSIONS: ['.pdf', '.doc', '.docx'],
} as const;

// ============= Roles & Permissions =============

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  USER: 'USER',
  EMPLOYER: 'EMPLOYER',
  JOB_SEEKER: 'JOB_SEEKER',
} as const;

export const ROLE_LABELS: Record<keyof typeof USER_ROLES, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MODERATOR: 'Moderator',
  USER: 'User',
  EMPLOYER: 'Employer',
  JOB_SEEKER: 'Job Seeker',
};

// ============= Status Values =============

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED',
} as const;

export const STATUS_LABELS: Record<keyof typeof USER_STATUS, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended',
  BANNED: 'Banned',
};

export const STATUS_COLORS: Record<keyof typeof USER_STATUS, string> = {
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  SUSPENDED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  BANNED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export const JOB_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CLOSED: 'CLOSED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const JOB_STATUS_LABELS: Record<keyof typeof JOB_STATUS, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  CLOSED: 'Closed',
  ARCHIVED: 'Archived',
};

export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  REVIEWING: 'REVIEWING',
  SHORTLISTED: 'SHORTLISTED',
  INTERVIEWED: 'INTERVIEWED',
  OFFERED: 'OFFERED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
  ACCEPTED: 'ACCEPTED',
} as const;

export const APPLICATION_STATUS_LABELS: Record<keyof typeof APPLICATION_STATUS, string> = {
  PENDING: 'Pending',
  REVIEWING: 'Reviewing',
  SHORTLISTED: 'Shortlisted',
  INTERVIEWED: 'Interviewed',
  OFFERED: 'Offered',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
  ACCEPTED: 'Accepted',
};

// ============= Job Related =============

export const JOB_TYPES = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  INTERNSHIP: 'INTERNSHIP',
  FREELANCE: 'FREELANCE',
} as const;

export const JOB_TYPE_LABELS: Record<keyof typeof JOB_TYPES, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
};

export const WORK_MODES = {
  ONSITE: 'ONSITE',
  REMOTE: 'REMOTE',
  HYBRID: 'HYBRID',
} as const;

export const WORK_MODE_LABELS: Record<keyof typeof WORK_MODES, string> = {
  ONSITE: 'On-site',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
};

export const EXPERIENCE_LEVELS = {
  INTERNSHIP: 'INTERNSHIP',
  ENTRY_LEVEL: 'ENTRY_LEVEL',
  JUNIOR: 'JUNIOR',
  MIDDLE: 'MIDDLE',
  SENIOR: 'SENIOR',
  LEAD: 'LEAD',
  MANAGER: 'MANAGER',
  DIRECTOR: 'DIRECTOR',
  EXECUTIVE: 'EXECUTIVE',
} as const;

export const EXPERIENCE_LEVEL_LABELS: Record<keyof typeof EXPERIENCE_LEVELS, string> = {
  INTERNSHIP: 'Internship',
  ENTRY_LEVEL: 'Entry Level',
  JUNIOR: 'Junior',
  MIDDLE: 'Middle',
  SENIOR: 'Senior',
  LEAD: 'Lead',
  MANAGER: 'Manager',
  DIRECTOR: 'Director',
  EXECUTIVE: 'Executive',
};

// ============= Date & Time =============

export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  WITH_TIME: 'dd/MM/yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// ============= UI Settings =============

export const TOAST_DURATION = {
  SHORT: 2000,
  NORMAL: 3000,
  LONG: 5000,
  ERROR: 5000,
} as const;

export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 250,
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// ============= Validation Rules =============

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  BIO_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 2000,
  PHONE_LENGTH: 10,
  PHONE_LENGTH_WITH_CODE: 11,
} as const;

// ============= Query Keys (for React Query) =============

export const QUERY_KEYS = {
  // Auth
  CURRENT_USER: ['current-user'] as const,

  // Users
  USERS: ['users'] as const,
  USER: (id: string) => ['users', id] as const,

  // Companies
  COMPANIES: ['companies'] as const,
  COMPANY: (id: string) => ['companies', id] as const,

  // Jobs
  JOBS: ['jobs'] as const,
  JOB: (id: string) => ['jobs', id] as const,

  // Applications
  APPLICATIONS: ['applications'] as const,
  APPLICATION: (id: string) => ['applications', id] as const,

  // Categories
  CATEGORIES: ['categories'] as const,
  CATEGORY: (id: string) => ['categories', id] as const,

  // Skills
  SKILLS: ['skills'] as const,
  SKILL: (id: string) => ['skills', id] as const,

  // Analytics
  DASHBOARD_STATS: ['dashboard-stats'] as const,
  ANALYTICS: (type: string) => ['analytics', type] as const,
} as const;

// ============= Routes =============

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  COMPANIES: '/companies',
  JOBS: '/jobs',
  APPLICATIONS: '/applications',
  CATEGORIES: '/categories',
  SKILLS: '/skills',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

// ============= Chart Colors =============

export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#8b5cf6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  MUTED: '#6b7280',
} as const;

// ============= Export Types =============

export type UserRole = keyof typeof USER_ROLES;
export type UserStatus = keyof typeof USER_STATUS;
export type JobStatus = keyof typeof JOB_STATUS;
export type ApplicationStatus = keyof typeof APPLICATION_STATUS;
export type JobType = keyof typeof JOB_TYPES;
export type WorkMode = keyof typeof WORK_MODES;
export type ExperienceLevel = keyof typeof EXPERIENCE_LEVELS;

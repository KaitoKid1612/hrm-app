/**
 * Centralized Query Keys Management
 * Single source of truth for all React Query cache keys
 * Benefits: Type-safe, prevents typos, easier refactoring
 */

export const queryKeys = {
  // Dashboard
  dashboard: ['dashboard'] as const,
  dashboardOverview: (params?: Record<string, unknown>) =>
    ['dashboard', 'overview', params] as const,

  // Users
  users: {
    all: ['users'] as const,
    lists: () => ['users', 'list'] as const,
    list: (filters?: Record<string, unknown>) => ['users', 'list', filters] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
    stats: ['users', 'stats'] as const,
  },

  // Companies
  companies: {
    all: ['companies'] as const,
    lists: () => ['companies', 'list'] as const,
    list: (filters?: Record<string, unknown>) => ['companies', 'list', filters] as const,
    detail: (id: string) => ['companies', 'detail', id] as const,
    stats: ['companies', 'stats'] as const,
  },

  // Jobs
  jobs: {
    all: ['jobs'] as const,
    lists: () => ['jobs', 'list'] as const,
    list: (filters?: Record<string, unknown>) => ['jobs', 'list', filters] as const,
    detail: (id: string) => ['jobs', 'detail', id] as const,
    stats: ['jobs', 'stats'] as const,
  },

  // Applications
  applications: {
    all: ['applications'] as const,
    lists: () => ['applications', 'list'] as const,
    list: (filters?: Record<string, unknown>) => ['applications', 'list', filters] as const,
    detail: (id: string) => ['applications', 'detail', id] as const,
    stats: ['application-stats'] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => ['categories', 'list'] as const,
    list: (filters?: Record<string, unknown>) => ['categories', 'list', filters] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
  },

  // Skills
  skills: {
    all: ['skills'] as const,
    lists: () => ['skills', 'list'] as const,
    list: (filters?: Record<string, unknown>) => ['skills', 'list', filters] as const,
    detail: (id: string) => ['skills', 'detail', id] as const,
  },

  // Interviews
  interviews: {
    all: ['interviews'] as const,
    lists: () => ['interviews', 'list'] as const,
    list: (filters?: Record<string, unknown>) => ['interviews', 'list', filters] as const,
    detail: (id: string) => ['interviews', 'detail', id] as const,
  },

  // Analytics
  analytics: {
    all: ['analytics'] as const,
    overview: (dateRange?: Record<string, unknown>) =>
      ['analytics', 'overview', dateRange] as const,
    daily: (dateRange?: Record<string, unknown>) => ['analytics', 'daily', dateRange] as const,
    jobsByCategory: ['analytics', 'jobs-by-category'] as const,
    applicationsByStatus: ['analytics', 'applications-by-status'] as const,
  },

  // Settings
  settings: {
    all: ['settings'] as const,
    system: ['settings', 'system'] as const,
    email: ['settings', 'email'] as const,
    notifications: ['settings', 'notifications'] as const,
    security: ['settings', 'security'] as const,
  },
} as const;

/**
 * Helper to invalidate related queries
 * Usage: invalidateQueries(queryClient, queryKeys.users.all, queryKeys.users.stats)
 */
export const invalidateQueries = (
  queryClient: { invalidateQueries: (options: { queryKey: readonly unknown[] }) => void },
  ...keys: readonly (readonly unknown[])[]
) => {
  keys.forEach((key) => {
    queryClient.invalidateQueries({ queryKey: key });
  });
};

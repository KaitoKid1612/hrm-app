/**
 * Type definitions for the admin dashboard
 *
 * All types are organized into separate files:
 * - common.types.ts: Common utilities and generic types
 * - user.types.ts: User, profile, preferences
 * - company.types.ts: Company, reviews, followers
 * - job.types.ts: Jobs, categories, skills
 * - application.types.ts: Applications and interviews
 */

// Export all types from organized files
export * from './common.types';
export * from './user.types';
export * from './company.types';
export * from './job.types';
export * from './application.types';

// ==================== Additional Types ====================

// Stats & Analytics (for backward compatibility)
export interface Stats {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  activeJobs?: number;
  pendingApplications?: number;
  recentActivity?: number;
}

// User Stats from API
export interface UserStats {
  total: number;
  candidates: number;
  employers: number;
  admins: number;
  active: number;
  banned: number;
}

export interface DashboardStats extends Stats {
  newUsersToday: number;
  newApplicationsToday: number;
  verificationsPending: number;
  trends?: {
    users: number;
    jobs: number;
    applications: number;
    companies: number;
  };
}

// Review Status (if not in other files)
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

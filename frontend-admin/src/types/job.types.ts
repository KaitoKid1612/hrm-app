/**
 * Job related types
 */

import type { Company } from './company.types';
import type { User } from './user.types';

// ==================== Enums ====================

export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

export type JobType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'FREELANCE'
  | 'TEMPORARY';

export type JobLevel =
  | 'INTERNSHIP'
  | 'ENTRY_LEVEL'
  | 'JUNIOR'
  | 'MIDDLE'
  | 'SENIOR'
  | 'LEAD'
  | 'MANAGER'
  | 'DIRECTOR'
  | 'EXECUTIVE';

export type WorkMode = 'ONSITE' | 'REMOTE' | 'HYBRID';

export type SalaryType = 'HOURLY' | 'MONTHLY' | 'YEARLY' | 'NEGOTIABLE';

export type ExperienceLevel =
  | 'NO_EXPERIENCE'
  | 'LESS_THAN_1_YEAR'
  | '1_TO_3_YEARS'
  | '3_TO_5_YEARS'
  | '5_TO_10_YEARS'
  | 'MORE_THAN_10_YEARS';

// ==================== Job Interface ====================

export interface Job {
  id: string;
  title: string;
  slug?: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  niceToHave?: string;

  // Company
  companyId?: string;
  company?: Company;

  // Category & Skills
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  skills?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;

  // Location
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  workMode?: WorkMode;

  // Salary
  salary?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: SalaryType;
  salaryCurrency?: string;
  showSalary?: boolean;

  // Job details
  type: JobType;
  level: JobLevel;
  experienceLevel?: ExperienceLevel;
  positions?: number; // Number of openings

  // Status & flags
  status: JobStatus;
  isActive: boolean;
  isHot: boolean;
  isUrgent: boolean;
  isFeatured?: boolean;

  // Dates
  deadline?: string;
  startDate?: string;

  // Metrics
  viewCount: number;
  applicationCount?: number;

  // Admin
  adminNote?: string;
  rejectionReason?: string;

  // Relations
  userId?: string;
  user?: User;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  closedAt?: string;

  // Counts
  _count?: {
    applications?: number;
    savedBy?: number;
    views?: number;
  };
}

// ==================== Job Details ====================

export interface JobDetails extends Job {
  similarJobs?: Job[];
  companyJobs?: Job[];
  applicationStats?: {
    total: number;
    pending: number;
    reviewing: number;
    shortlisted: number;
    interviewed: number;
    offered: number;
    accepted: number;
    rejected: number;
  };
}

// ==================== Job Category ====================

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
  parent?: JobCategory;
  isActive: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;

  _count?: {
    jobs?: number;
    children?: number;
  };
}

// ==================== Job Skill ====================

export interface JobSkill {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  _count?: {
    jobs?: number;
    users?: number;
  };
}

// ==================== Job Benefit ====================

export interface JobBenefit {
  id: string;
  jobId: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
}

// ==================== Job Alert ====================

export interface JobAlert {
  id: string;
  userId: string;
  user?: User;
  title: string;
  keywords?: string[];
  location?: string;
  city?: string;
  categoryId?: string;
  category?: JobCategory;
  jobType?: JobType;
  jobLevel?: JobLevel;
  workMode?: WorkMode;
  salaryMin?: number;
  isActive: boolean;
  frequency?: 'INSTANT' | 'DAILY' | 'WEEKLY';
  lastSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Saved Job ====================

export interface SavedJob {
  id: string;
  userId: string;
  user?: User;
  jobId: string;
  job?: Job;
  notes?: string;
  createdAt: string;
}

// ==================== Query Params ====================

export interface JobQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: JobStatus;
  type?: JobType;
  level?: JobLevel;
  workMode?: WorkMode;
  isActive?: boolean;
  isHot?: boolean;
  isUrgent?: boolean;
  isFeatured?: boolean;
  companyId?: string;
  categoryId?: string;
  city?: string;
  country?: string;
  salaryMin?: number;
  salaryMax?: number;
  skillIds?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  parentId?: string | null;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SkillQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ==================== Form Data ====================

export interface JobFormData {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  niceToHave?: string;
  companyId?: string;
  categoryId?: string;
  skillIds?: string[];
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  workMode?: WorkMode;
  salary?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: SalaryType;
  salaryCurrency?: string;
  showSalary?: boolean;
  type: JobType;
  level: JobLevel;
  experienceLevel?: ExperienceLevel;
  positions?: number;
  deadline?: string;
  startDate?: string;
}

export interface JobUpdateData {
  title?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  niceToHave?: string;
  categoryId?: string;
  skillIds?: string[];
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  workMode?: WorkMode;
  salary?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: SalaryType;
  salaryCurrency?: string;
  showSalary?: boolean;
  type?: JobType;
  level?: JobLevel;
  experienceLevel?: ExperienceLevel;
  positions?: number;
  status?: JobStatus;
  isActive?: boolean;
  isHot?: boolean;
  isUrgent?: boolean;
  isFeatured?: boolean;
  deadline?: string;
  startDate?: string;
  adminNote?: string;
  rejectionReason?: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
  isActive: boolean;
  order?: number;
}

export interface SkillFormData {
  name: string;
  slug: string;
  description?: string;
  category?: string;
  isActive: boolean;
}

// ==================== Job Stats ====================

export interface JobStats {
  totalJobs: number;
  publishedJobs: number;
  draftJobs: number;
  closedJobs: number;
  archivedJobs: number;
  hotJobs: number;
  urgentJobs: number;
  featuredJobs: number;
  newJobsThisMonth: number;
  newJobsToday: number;
  expiringSoon: number;
  jobsByType?: Record<JobType, number>;
  jobsByLevel?: Record<JobLevel, number>;
  jobsByCategory?: Array<{ category: string; count: number }>;
  topCompanies?: Array<{ company: string; count: number }>;
  topCities?: Array<{ city: string; count: number }>;
  averageApplicationsPerJob?: number;
  growthRate?: number;
}

/**
 * User related types
 */

// ==================== Enums ====================

export type UserRole = 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

// ==================== User Interface ====================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;

  // Counts
  _count?: {
    applications?: number;
    jobs?: number;
    companies?: number;
    savedJobs?: number;
    reviews?: number;
  };
}

// ==================== User Profile ====================

export interface UserProfile extends User {
  experiences?: WorkExperience[];
  education?: Education[];
  skills?: UserSkill[];
  certifications?: Certification[];
  languages?: Language[];
  professionalProfile?: ProfessionalProfile;
}

export interface WorkExperience {
  id: string;
  userId: string;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  userId: string;
  school: string;
  degree: string;
  field: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skill?: {
    id: string;
    name: string;
    slug: string;
  };
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExperience?: number;
}

export interface Certification {
  id: string;
  userId: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Language {
  id: string;
  userId: string;
  language: string;
  proficiency: 'BASIC' | 'CONVERSATIONAL' | 'FLUENT' | 'NATIVE';
}

export interface ProfessionalProfile {
  id: string;
  userId: string;
  headline?: string;
  summary?: string;
  website?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  resumeUrl?: string;
  expectedSalary?: number;
  currentSalary?: number;
  availability?: 'IMMEDIATE' | 'TWO_WEEKS' | 'ONE_MONTH' | 'MORE_THAN_MONTH';
  preferredLocations?: string[];
  openToRemote: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== User Preferences ====================

export interface UserPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  jobAlerts: boolean;
  applicationUpdates: boolean;
  companyUpdates: boolean;
  marketingEmails: boolean;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Query Params ====================

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
  isActive?: boolean;
  isEmailVerified?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  city?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
}

// ==================== Form Data ====================

export interface UserFormData {
  email: string;
  name: string;
  role?: UserRole;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface UserUpdateData {
  name?: string;
  role?: UserRole;
  status?: UserStatus;
  isActive?: boolean;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
}

export interface UserCreateData extends UserFormData {
  password: string;
  confirmPassword?: string;
}

// ==================== User Stats ====================

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
  newUsersThisMonth: number;
  newUsersToday: number;
  employersCount: number;
  jobSeekersCount: number;
  verifiedUsers: number;
  growthRate?: number;
}

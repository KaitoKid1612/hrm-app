/**
 * Company related types
 */

// ==================== Enums ====================

export type CompanyType = 'COMPANY' | 'SMALL_BUSINESS' | 'HEADHUNTER' | 'STARTUP' | 'CORPORATION';

export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1001-5000'
  | '5000+';

export type CompanyStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

// ==================== Company Interface ====================

export interface Company {
  id: string;
  name: string;
  slug?: string;
  type?: CompanyType;
  description?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  industry?: string;
  size?: CompanySize;
  foundedYear?: number;
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;

  // Social links
  linkedIn?: string;
  facebook?: string;
  twitter?: string;

  // Status
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
  status?: CompanyStatus;

  // Admin fields
  adminNote?: string;
  verifiedAt?: string;
  verifiedBy?: string;

  // Relations
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Counts
  _count?: {
    jobs?: number;
    reviews?: number;
    followers?: number;
    employees?: number;
  };
}

// ==================== Company Details ====================

export interface CompanyDetails extends Company {
  benefits?: CompanyBenefit[];
  culture?: CompanyCulture;
  gallery?: CompanyImage[];
  team?: TeamMember[];
  awards?: CompanyAward[];
}

export interface CompanyBenefit {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  icon?: string;
  category?: 'HEALTH' | 'FINANCIAL' | 'LEARNING' | 'WORK_LIFE' | 'PERKS' | 'OTHER';
  createdAt: string;
}

export interface CompanyCulture {
  id: string;
  companyId: string;
  vision?: string;
  mission?: string;
  values?: string[];
  workEnvironment?: string;
  diversity?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyImage {
  id: string;
  companyId: string;
  url: string;
  caption?: string;
  order: number;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  companyId: string;
  name: string;
  position: string;
  avatar?: string;
  bio?: string;
  linkedIn?: string;
  order: number;
  createdAt: string;
}

export interface CompanyAward {
  id: string;
  companyId: string;
  title: string;
  description?: string;
  year: number;
  issuedBy?: string;
  createdAt: string;
}

// ==================== Company Review ====================

export interface CompanyReview {
  id: string;
  companyId: string;
  company?: Company;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  title?: string;
  content: string;
  pros?: string;
  cons?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerified: boolean;
  isAnonymous: boolean;
  position?: string;
  employmentType?: 'CURRENT' | 'FORMER';
  adminNote?: string;
  createdAt: string;
  updatedAt: string;

  _count?: {
    helpful?: number;
  };
}

// ==================== Company Follower ====================

export interface CompanyFollower {
  id: string;
  companyId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
}

// ==================== Query Params ====================

export interface CompanyQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: CompanyType;
  size?: CompanySize;
  status?: CompanyStatus;
  isVerified?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  industry?: string;
  city?: string;
  country?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface CompanyReviewQueryParams {
  page?: number;
  limit?: number;
  companyId?: string;
  userId?: string;
  rating?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ==================== Form Data ====================

export interface CompanyFormData {
  name: string;
  slug?: string;
  type?: CompanyType;
  description?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  industry?: string;
  size?: CompanySize;
  foundedYear?: number;
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  linkedIn?: string;
  facebook?: string;
  twitter?: string;
}

export interface CompanyUpdateData {
  name?: string;
  type?: CompanyType;
  description?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  industry?: string;
  size?: CompanySize;
  foundedYear?: number;
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  linkedIn?: string;
  facebook?: string;
  twitter?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  status?: CompanyStatus;
  adminNote?: string;
}

export interface CompanyReviewUpdateData {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerified?: boolean;
  adminNote?: string;
}

// ==================== Company Stats ====================

export interface CompanyStats {
  totalCompanies: number;
  verifiedCompanies: number;
  featuredCompanies: number;
  activeCompanies: number;
  pendingVerification: number;
  newCompaniesThisMonth: number;
  newCompaniesToday: number;
  companiesByType?: Record<CompanyType, number>;
  companiesBySize?: Record<CompanySize, number>;
  topIndustries?: Array<{ industry: string; count: number }>;
  growthRate?: number;
}

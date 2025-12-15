export interface Job {
  id: string;
  companyId?: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  requirements: string;
  benefits?: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  jobLevel:
    | 'INTERN'
    | 'FRESHER'
    | 'JUNIOR'
    | 'MIDDLE'
    | 'SENIOR'
    | 'LEADER'
    | 'MANAGER'
    | 'ENTRY_LEVEL'
    | 'EXPERIENCED'
    | 'NOT_REQUIRED';
  salaryMin: number;
  salaryMax: number;
  salaryNegotiate: boolean;
  positions: number;
  experience:
    | 'NO_EXPERIENCE'
    | 'UNDER_1_YEAR'
    | 'ONE_TO_THREE_YEARS'
    | 'THREE_TO_FIVE_YEARS'
    | 'FIVE_TO_TEN_YEARS'
    | 'OVER_TEN_YEARS';
  address?: string;
  city?: string;
  country?: string;
  deadline?: string;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
    logo?: string;
    city?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  skills: Array<{
    id: string;
    jobId: string;
    skillId: string;
    createdAt: string;
    skill: {
      id: string;
      name: string;
      slug: string;
      createdAt: string;
      updatedAt: string;
    };
  }>;
  _count: {
    applications: number;
  };
  // Computed properties for UI compatibility
  isHot?: boolean;
  isNew?: boolean;
}

export interface JobFilters {
  keyword?: string;
  location?: string;
  type?: string;
  level?: string;
  salaryMin?: number;
  salaryMax?: number;
}

export interface JobSearchParams extends JobFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'salary' | 'deadline' | 'views' | 'applications';
  sortOrder?: 'asc' | 'desc';
}

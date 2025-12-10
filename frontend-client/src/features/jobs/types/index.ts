export interface Job {
  id: string;
  title: string;
  description: string;
  salary: {
    min: number;
    max: number;
  };
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  level: 'INTERN' | 'FRESHER' | 'JUNIOR' | 'MIDDLE' | 'SENIOR' | 'LEADER' | 'MANAGER';
  requirements: string[];
  benefits?: string[];
  isHot?: boolean;
  isNew?: boolean;
  createdAt: string;
  company: {
    id: string;
    name: string;
    logo?: string;
    address?: string;
  };
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
  sort?: 'latest' | 'salary' | 'hot';
}

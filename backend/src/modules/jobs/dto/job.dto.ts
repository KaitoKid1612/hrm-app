import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDateString,
} from 'class-validator';
import { JobType, JobLevel, ExperienceLevel } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  requirements: string | string[];

  @IsOptional()
  benefits?: string | string[];

  @IsEnum(JobType)
  jobType: JobType;

  @IsEnum(JobLevel)
  jobLevel: JobLevel;

  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @IsOptional()
  @IsBoolean()
  salaryNegotiate?: boolean;

  @IsOptional()
  @IsNumber()
  positions?: number;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experience?: ExperienceLevel;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillIds?: string[];
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @IsOptional()
  @IsEnum(JobLevel)
  jobLevel?: JobLevel;

  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @IsOptional()
  @IsBoolean()
  salaryNegotiate?: boolean;

  @IsOptional()
  @IsNumber()
  positions?: number;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experience?: ExperienceLevel;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class QueryJobDto {
  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  // Basic search
  @IsOptional()
  @IsString()
  keyword?: string;

  // Category filter
  @IsOptional()
  @IsString()
  categoryId?: string;

  // Job type & level filters
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @IsOptional()
  @IsEnum(JobLevel)
  jobLevel?: JobLevel;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experience?: ExperienceLevel;

  // Location filters
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cities?: string[]; // Multiple cities

  // Salary filters
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMax?: number;

  // Skills filter (comma-separated skill IDs)
  @IsOptional()
  @IsString()
  skills?: string;

  // Company filter
  @IsOptional()
  @IsString()
  companyId?: string;

  // Hot/Featured jobs
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isHot?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  // Sorting
  @IsOptional()
  @IsEnum(['createdAt', 'salary', 'deadline', 'views', 'applications'])
  sortBy?: 'createdAt' | 'salary' | 'deadline' | 'views' | 'applications';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  // Date range filters
  @IsOptional()
  @IsDateString()
  postedAfter?: string; // Jobs posted after this date

  @IsOptional()
  @IsDateString()
  postedBefore?: string; // Jobs posted before this date

  @IsOptional()
  @IsDateString()
  deadlineAfter?: string; // Deadline after this date

  @IsOptional()
  @IsDateString()
  deadlineBefore?: string; // Deadline before this date
}

// New DTO for advanced search with autocomplete
export class SearchSuggestionsDto {
  @IsString()
  query: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

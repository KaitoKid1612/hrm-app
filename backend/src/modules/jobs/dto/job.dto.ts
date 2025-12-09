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
  @IsString()
  categoryId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  requirements: string;

  @IsOptional()
  @IsString()
  benefits?: string;

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
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @IsOptional()
  @IsEnum(JobLevel)
  jobLevel?: JobLevel;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMax?: number;

  @IsOptional()
  @IsString()
  keyword?: string;
}

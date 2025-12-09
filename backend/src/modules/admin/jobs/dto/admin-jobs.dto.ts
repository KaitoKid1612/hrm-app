import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminQueryJobsDto {
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
  keyword?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isHot?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(['createdAt', 'viewCount', 'applicationsCount', 'deadline'])
  sortBy?: 'createdAt' | 'viewCount' | 'applicationsCount' | 'deadline';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

export class AdminUpdateJobDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isHot?: boolean;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsString()
  adminNote?: string;
}

export class AdminBulkActionJobsDto {
  @IsString({ each: true })
  ids: string[];

  @IsEnum(['activate', 'deactivate', 'delete'])
  action: 'activate' | 'deactivate' | 'delete';
}

export class AdminQueryApplicationsDto {
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
  keyword?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  jobId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(['appliedAt', 'reviewedAt', 'status'])
  sortBy?: 'appliedAt' | 'reviewedAt' | 'status';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminQueryCompaniesDto {
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
  isVerified?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(['createdAt', 'name', 'jobsCount'])
  sortBy?: 'createdAt' | 'name' | 'jobsCount';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

export class AdminUpdateCompanyDto {
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  adminNote?: string;
}

export class AdminBulkActionCompaniesDto {
  @IsString({ each: true })
  ids: string[];

  @IsEnum(['verify', 'delete'])
  action: 'verify' | 'delete';
}

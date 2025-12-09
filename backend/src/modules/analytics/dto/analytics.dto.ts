import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum TimeRange {
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_3_MONTHS = 'last_3_months',
  LAST_6_MONTHS = 'last_6_months',
  LAST_YEAR = 'last_year',
  CUSTOM = 'custom',
}

export class AnalyticsQueryDto {
  @IsEnum(TimeRange)
  @IsOptional()
  timeRange?: TimeRange = TimeRange.LAST_30_DAYS;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}

export class CompanyAnalyticsQueryDto {
  @IsEnum(TimeRange)
  @IsOptional()
  timeRange?: TimeRange = TimeRange.LAST_30_DAYS;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  jobId?: string;
}

export class CandidateAnalyticsQueryDto {
  @IsEnum(TimeRange)
  @IsOptional()
  timeRange?: TimeRange = TimeRange.LAST_30_DAYS;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

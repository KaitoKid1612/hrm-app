import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, IsEnum } from 'class-validator';
import { JobType } from '@prisma/client';

export class CreateJobAlertDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  keywords?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsEnum(JobType)
  @IsOptional()
  jobType?: JobType;

  @IsInt()
  @IsOptional()
  salaryMin?: number;

  @IsBoolean()
  @IsOptional()
  isRemote?: boolean;

  @IsString()
  @IsOptional()
  frequency?: string; // DAILY, WEEKLY, INSTANT
}

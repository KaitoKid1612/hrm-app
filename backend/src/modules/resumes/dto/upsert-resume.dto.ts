import { IsString, IsOptional, IsBoolean, IsEnum, IsDateString, IsArray } from 'class-validator';
import { ExperienceLevel, Gender } from '@prisma/client';

export class UpsertResumeDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  objective?: string;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experience?: ExperienceLevel;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  workHistory?: string;

  @IsOptional()
  @IsString()
  certifications?: string;

  @IsOptional()
  @IsString()
  projects?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  cvFileUrl?: string;

  // Skills as array of skill IDs (will be handled separately)
  @IsOptional()
  @IsArray()
  skillIds?: string[];
}

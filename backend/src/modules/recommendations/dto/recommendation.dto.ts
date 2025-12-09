import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class JobRecommendationQueryDto {
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  minMatchScore?: number = 50; // Minimum match score percentage
}

export class CandidateRecommendationQueryDto {
  @IsString()
  jobId: string;

  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  minMatchScore?: number = 60;
}

export class MatchScoreDto {
  @IsString()
  jobId: string;

  @IsString()
  @IsOptional()
  resumeId?: string; // If not provided, use user's default resume
}

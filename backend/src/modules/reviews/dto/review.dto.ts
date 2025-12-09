import { IsString, IsOptional, IsNumber, IsBoolean, Min, Max, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsString()
  companyId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @Length(5, 100)
  title: string;

  @IsString()
  @Length(20, 2000)
  content: string;

  @IsOptional()
  @IsString()
  @Length(10, 1000)
  pros?: string;

  @IsOptional()
  @IsString()
  @Length(10, 1000)
  cons?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  @Length(5, 100)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(20, 2000)
  content?: string;

  @IsOptional()
  @IsString()
  @Length(10, 1000)
  pros?: string;

  @IsOptional()
  @IsString()
  @Length(10, 1000)
  cons?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}

export class QueryReviewsDto {
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
  companyId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isApproved?: boolean;

  @IsOptional()
  sortBy?: 'createdAt' | 'rating' | 'helpfulCount';

  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}

export class ModerateReviewDto {
  @IsBoolean()
  isApproved: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsString()
  moderationNote?: string;
}

import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsUrl,
  IsEnum,
  IsInt,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CompanyType } from '@prisma/client';

export class SocialLinksDto {
  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  twitter?: string;
}

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(CompanyType)
  type?: CompanyType;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

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
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  taxCode?: string;

  // New fields
  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  foundedYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  employeeCount?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsString()
  culture?: string;

  @IsOptional()
  @IsString()
  workingDays?: string;

  @IsOptional()
  @IsString()
  overtimePolicy?: string;

  @IsOptional()
  socialLinks?: SocialLinksDto;

  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  @IsOptional()
  @IsUrl()
  twitterUrl?: string;

  @IsOptional()
  @IsUrl()
  youtubeUrl?: string;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CompanyType)
  type?: CompanyType;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

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
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  taxCode?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  // New fields
  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  foundedYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  employeeCount?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsString()
  culture?: string;

  @IsOptional()
  @IsString()
  workingDays?: string;

  @IsOptional()
  @IsString()
  overtimePolicy?: string;

  @IsOptional()
  socialLinks?: SocialLinksDto;

  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  @IsOptional()
  @IsUrl()
  twitterUrl?: string;

  @IsOptional()
  @IsUrl()
  youtubeUrl?: string;
}

import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsInt,
  IsUrl,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Role, Gender } from '@prisma/client';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  // Optional extended fields for registration
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Tên phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên phải có ít nhất 2 ký tự' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Avatar phải là chuỗi ký tự' })
  avatar?: string;

  // Personal Info
  @IsOptional()
  @IsEnum(Gender, { message: 'Giới tính không hợp lệ' })
  gender?: Gender;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
  dateOfBirth?: string;

  // Location
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Thành phố phải là chuỗi ký tự' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Quốc gia phải là chuỗi ký tự' })
  country?: string;

  // Professional Info
  @IsOptional()
  @IsString({ message: 'Bio phải là chuỗi ký tự' })
  bio?: string;

  @IsOptional()
  @IsString({ message: 'Chức danh công việc phải là chuỗi ký tự' })
  currentJobTitle?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số năm kinh nghiệm phải là số nguyên' })
  @Min(0, { message: 'Số năm kinh nghiệm không thể âm' })
  @Max(50, { message: 'Số năm kinh nghiệm không thể quá 50' })
  yearsOfExperience?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Mức lương mong muốn phải là số nguyên' })
  @Min(0, { message: 'Mức lương mong muốn không thể âm' })
  expectedSalary?: number;

  // Social Links
  @IsOptional()
  @IsUrl({}, { message: 'LinkedIn URL không hợp lệ' })
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Portfolio URL không hợp lệ' })
  portfolioUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Github URL không hợp lệ' })
  githubUrl?: string;

  // Preferences
  @IsOptional()
  @IsString({ message: 'Ngôn ngữ ưa thích phải là chuỗi ký tự' })
  preferredLanguage?: string;

  @IsOptional()
  @IsString({ message: 'Múi giờ phải là chuỗi ký tự' })
  timezone?: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

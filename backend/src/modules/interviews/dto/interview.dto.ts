import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
  NO_SHOW = 'NO_SHOW',
}

export class CreateInterviewDto {
  @IsString()
  applicationId: string;

  @IsDateString()
  scheduledAt: string;

  @IsInt()
  @Min(15)
  @IsOptional()
  duration?: number = 60;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  meetingLink?: string;

  @IsString()
  @IsOptional()
  interviewers?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateInterviewDto {
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsInt()
  @Min(15)
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  meetingLink?: string;

  @IsString()
  @IsOptional()
  interviewers?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(InterviewStatus)
  @IsOptional()
  status?: InterviewStatus;

  @IsString()
  @IsOptional()
  feedback?: string;
}

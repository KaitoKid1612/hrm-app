import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export enum NotificationType {
  APPLICATION_STATUS = 'application_status',
  NEW_JOB = 'new_job',
  JOB_DEADLINE = 'job_deadline',
  COMPANY_VERIFIED = 'company_verified',
  NEW_APPLICATION = 'new_application',
  NEW_MESSAGE = 'new_message',
  SYSTEM = 'system',
}

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  data?: any;
}

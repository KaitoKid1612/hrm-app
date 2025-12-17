import { PartialType } from '@nestjs/mapped-types';
import { CreateJobAlertDto } from './create-job-alert.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateJobAlertDto extends PartialType(CreateJobAlertDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

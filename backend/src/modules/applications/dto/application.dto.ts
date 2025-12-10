import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @IsString()
  @IsNotEmpty()
  resumeId: string; // Required: Must have CV to apply

  @IsOptional()
  @IsString()
  coverLetter?: string;
}

export class UpdateApplicationStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string; // PENDING, REVIEWING, INTERVIEWED, ACCEPTED, REJECTED, WITHDRAWN
}

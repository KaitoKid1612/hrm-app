import { IsString, IsEmail, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class InviteCandidateDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class BulkInviteDto {
  @IsString()
  jobId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InviteCandidateDto)
  candidates: InviteCandidateDto[];

  @IsOptional()
  @IsString()
  customMessage?: string;
}

export class UploadCsvDto {
  @IsString()
  jobId: string;
}

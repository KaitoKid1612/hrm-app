import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  issuingOrg: string;

  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @IsDateString()
  @IsOptional()
  expirationDate?: string;

  @IsString()
  @IsOptional()
  credentialId?: string;

  @IsString()
  @IsOptional()
  credentialUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

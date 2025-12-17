import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AddJobBenefitDto {
  @IsString()
  @IsNotEmpty()
  benefitId: string;

  @IsString()
  @IsOptional()
  details?: string;
}

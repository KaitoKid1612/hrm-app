import { IsOptional, IsDateString } from 'class-validator';

export class AdminDateRangeDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

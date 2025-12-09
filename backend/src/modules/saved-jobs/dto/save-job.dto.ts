import { IsString, IsNotEmpty } from 'class-validator';

export class SaveJobDto {
  @IsString()
  @IsNotEmpty()
  jobId: string;
}

import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateSkillDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

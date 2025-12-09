import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class BulkCreateSkillsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  names: string[];
}

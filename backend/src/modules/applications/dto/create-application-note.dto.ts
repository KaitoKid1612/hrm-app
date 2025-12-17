import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateApplicationNoteDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;
}

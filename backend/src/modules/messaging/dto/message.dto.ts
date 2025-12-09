import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  recipientId: string; // User ID to start conversation with

  @IsString()
  @IsOptional()
  @IsUUID()
  jobId?: string; // Optional job context

  @IsString()
  @IsOptional()
  message?: string; // Initial message
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}

export class UpdateConversationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isGroup?: boolean;
}

export class QueryConversationsDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @IsString()
  @IsOptional()
  search?: string;
}

export class QueryMessagesDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 50;

  @IsString()
  @IsOptional()
  @IsUUID()
  before?: string; // Message ID for pagination
}

export class MarkAsReadDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  messageIds?: string[]; // If empty, mark all as read
}

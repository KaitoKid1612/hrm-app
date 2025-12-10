import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
  Inject,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import {
  CreateConversationDto,
  SendMessageDto,
  UpdateConversationDto,
  QueryConversationsDto,
  QueryMessagesDto,
  MarkAsReadDto,
} from './dto/message.dto';

@Controller('messaging')
@UseGuards(JwtAuthGuard)
export class MessagingController {
  constructor(@Inject(MessagingService) private readonly messagingService: MessagingService) {}

  /**
   * Create a new conversation
   * POST /messaging/conversations
   */
  @Post('conversations')
  async createConversation(@CurrentUser('sub') userId: string, @Body() dto: CreateConversationDto) {
    return this.messagingService.createConversation(userId, dto);
  }

  /**
   * Get user's conversations
   * GET /messaging/conversations
   */
  @Get('conversations')
  async getUserConversations(
    @CurrentUser('sub') userId: string,
    @Query() query: QueryConversationsDto,
  ) {
    return this.messagingService.getUserConversations(userId, query);
  }

  /**
   * Get conversation by ID
   * GET /messaging/conversations/:id
   */
  @Get('conversations/:id')
  async getConversationById(
    @CurrentUser('sub') userId: string,
    @Param('id') conversationId: string,
  ) {
    return this.messagingService.getConversationById(userId, conversationId);
  }

  /**
   * Update conversation
   * PUT /messaging/conversations/:id
   */
  @Put('conversations/:id')
  async updateConversation(
    @CurrentUser('sub') userId: string,
    @Param('id') conversationId: string,
    @Body() dto: UpdateConversationDto,
  ) {
    return this.messagingService.updateConversation(userId, conversationId, dto);
  }

  /**
   * Delete conversation
   * DELETE /messaging/conversations/:id
   */
  @Delete('conversations/:id')
  async deleteConversation(
    @CurrentUser('sub') userId: string,
    @Param('id') conversationId: string,
  ) {
    return this.messagingService.deleteConversation(userId, conversationId);
  }

  /**
   * Send a message
   * POST /messaging/conversations/:id/messages
   */
  @Post('conversations/:id/messages')
  async sendMessage(
    @CurrentUser('sub') userId: string,
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagingService.sendMessage(userId, conversationId, dto);
  }

  /**
   * Get messages in a conversation
   * GET /messaging/conversations/:id/messages
   */
  @Get('conversations/:id/messages')
  async getMessages(
    @CurrentUser('sub') userId: string,
    @Param('id') conversationId: string,
    @Query() query: QueryMessagesDto,
  ) {
    return this.messagingService.getMessages(userId, conversationId, query);
  }

  /**
   * Mark messages as read
   * PATCH /messaging/conversations/:id/read
   */
  @Patch('conversations/:id/read')
  async markAsRead(
    @CurrentUser('sub') userId: string,
    @Param('id') conversationId: string,
    @Body() dto: MarkAsReadDto,
  ) {
    return this.messagingService.markAsRead(userId, conversationId, dto);
  }

  /**
   * Get unread messages count
   * GET /messaging/unread-count
   */
  @Get('unread-count')
  async getUnreadCount(@CurrentUser('sub') userId: string) {
    return this.messagingService.getUnreadCount(userId);
  }
}

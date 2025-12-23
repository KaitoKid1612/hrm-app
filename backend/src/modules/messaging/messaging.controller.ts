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
  async createConversation(@CurrentUser() user: any, @Body() dto: CreateConversationDto) {
    return this.messagingService.createConversation(user.id, dto);
  }

  /**
   * Get user's conversations
   * GET /messaging/conversations
   */
  @Get('conversations')
  async getUserConversations(@CurrentUser() user: any, @Query() query: QueryConversationsDto) {
    return this.messagingService.getUserConversations(user.id, query);
  }

  /**
   * Get conversation by ID
   * GET /messaging/conversations/:id
   */
  @Get('conversations/:id')
  async getConversationById(@CurrentUser() user: any, @Param('id') conversationId: string) {
    return this.messagingService.getConversationById(user.id, conversationId);
  }

  /**
   * Update conversation
   * PUT /messaging/conversations/:id
   */
  @Put('conversations/:id')
  async updateConversation(
    @CurrentUser() user: any,
    @Param('id') conversationId: string,
    @Body() dto: UpdateConversationDto,
  ) {
    return this.messagingService.updateConversation(user.id, conversationId, dto);
  }

  /**
   * Delete conversation
   * DELETE /messaging/conversations/:id
   */
  @Delete('conversations/:id')
  async deleteConversation(@CurrentUser() user: any, @Param('id') conversationId: string) {
    return this.messagingService.deleteConversation(user.id, conversationId);
  }

  /**
   * Send a message
   * POST /messaging/conversations/:id/messages
   */
  @Post('conversations/:id/messages')
  async sendMessage(
    @CurrentUser() user: any,
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagingService.sendMessage(user.id, conversationId, dto);
  }

  /**
   * Get messages in a conversation
   * GET /messaging/conversations/:id/messages
   */
  @Get('conversations/:id/messages')
  async getMessages(
    @CurrentUser() user: any,
    @Param('id') conversationId: string,
    @Query() query: QueryMessagesDto,
  ) {
    return this.messagingService.getMessages(user.id, conversationId, query);
  }

  /**
   * Mark messages as read
   * PATCH /messaging/conversations/:id/read
   */
  @Patch('conversations/:id/read')
  async markAsRead(
    @CurrentUser() user: any,
    @Param('id') conversationId: string,
    @Body() dto: MarkAsReadDto,
  ) {
    return this.messagingService.markAsRead(user.id, conversationId, dto);
  }

  /**
   * Get unread messages count
   * GET /messaging/unread-count
   */
  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: any) {
    return this.messagingService.getUnreadCount(user.id);
  }
}

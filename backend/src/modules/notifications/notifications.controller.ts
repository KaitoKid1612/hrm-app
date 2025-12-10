import { Controller, Get, Patch, Delete, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    @Inject(NotificationsService) private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  getUserNotifications(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('isRead') isRead?: string,
  ) {
    return this.notificationsService.getUserNotifications(
      user.userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      isRead !== undefined ? isRead === 'true' : undefined,
    );
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: any) {
    return this.notificationsService.getUnreadCount(user.userId);
  }

  @Patch(':id/read')
  markAsRead(@CurrentUser() user: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(user.userId, id);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.userId);
  }

  @Delete(':id')
  deleteNotification(@CurrentUser() user: any, @Param('id') id: string) {
    return this.notificationsService.delete(user.userId, id);
  }

  @Delete()
  deleteAll(@CurrentUser() user: any) {
    return this.notificationsService.deleteAll(user.userId);
  }
}

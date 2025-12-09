import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsCronService {
  constructor(private notificationsService: NotificationsService) {}

  // Clean old notifications every day at 2 AM
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleCleanOldNotifications() {
    console.log('🧹 Cleaning old notifications...');
    const result = await this.notificationsService.cleanOldNotifications();
    console.log(`✅ ${result.message}`);
  }
}

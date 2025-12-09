import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateNotificationDto, NotificationType } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // Create notification
  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        title: dto.title,
        message: dto.message,
        type: dto.type,
        data: dto.data || {},
      },
    });
  }

  // Get user notifications with pagination
  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    isRead?: boolean,
  ) {
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return {
      data: notifications,
      meta: {
        total,
        unreadCount,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get unread count
  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { unreadCount: count };
  }

  // Mark as read
  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  // Mark all as read
  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { message: 'All notifications marked as read' };
  }

  // Delete notification
  async delete(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: 'Notification deleted' };
  }

  // Delete all notifications
  async deleteAll(userId: string) {
    await this.prisma.notification.deleteMany({
      where: { userId },
    });

    return { message: 'All notifications deleted' };
  }

  // ============ Helper methods for creating specific notifications ============

  // Application status changed
  async notifyApplicationStatus(
    userId: string,
    jobTitle: string,
    companyName: string,
    status: string,
    applicationId: string,
  ) {
    const statusMessages: Record<string, string> = {
      REVIEWING: 'is being reviewed',
      INTERVIEWED: 'has been selected for interview',
      ACCEPTED: 'has been accepted',
      REJECTED: 'has been rejected',
    };

    return this.create({
      userId,
      title: 'Application Status Update',
      message: `Your application for ${jobTitle} at ${companyName} ${statusMessages[status] || 'has been updated'}.`,
      type: NotificationType.APPLICATION_STATUS,
      data: {
        applicationId,
        jobTitle,
        companyName,
        status,
      },
    });
  }

  // New job matching skills
  async notifyNewJob(userId: string, jobTitle: string, companyName: string, jobId: string) {
    return this.create({
      userId,
      title: 'New Job Match',
      message: `New job "${jobTitle}" at ${companyName} matches your profile!`,
      type: NotificationType.NEW_JOB,
      data: {
        jobId,
        jobTitle,
        companyName,
      },
    });
  }

  // Job deadline reminder
  async notifyJobDeadline(
    userId: string,
    jobTitle: string,
    companyName: string,
    jobId: string,
    daysLeft: number,
  ) {
    return this.create({
      userId,
      title: 'Job Deadline Reminder',
      message: `Only ${daysLeft} days left to apply for "${jobTitle}" at ${companyName}!`,
      type: NotificationType.JOB_DEADLINE,
      data: {
        jobId,
        jobTitle,
        companyName,
        daysLeft,
      },
    });
  }

  // Company verified
  async notifyCompanyVerified(userId: string, companyName: string) {
    return this.create({
      userId,
      title: 'Company Verified',
      message: `Congratulations! ${companyName} has been verified by our team.`,
      type: NotificationType.COMPANY_VERIFIED,
      data: {
        companyName,
      },
    });
  }

  // New application (for employer)
  async notifyNewApplication(
    userId: string,
    candidateName: string,
    jobTitle: string,
    applicationId: string,
  ) {
    return this.create({
      userId,
      title: 'New Application',
      message: `${candidateName} has applied for ${jobTitle}.`,
      type: NotificationType.NEW_APPLICATION,
      data: {
        applicationId,
        candidateName,
        jobTitle,
      },
    });
  }

  // Batch create notifications
  async createBatch(notifications: CreateNotificationDto[]) {
    return this.prisma.notification.createMany({
      data: notifications.map((n) => ({
        userId: n.userId,
        title: n.title,
        message: n.message,
        type: n.type,
        data: n.data || {},
      })),
    });
  }

  // Clean old notifications (older than 30 days)
  async cleanOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
        isRead: true,
      },
    });

    return {
      message: `Deleted ${result.count} old notifications`,
      count: result.count,
    };
  }
}

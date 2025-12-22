import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { EmailModule } from '@/modules/email/email.module';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

@Module({
  imports: [ConfigModule, PrismaModule, NotificationsModule, EmailModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, RolesGuard],
})
export class ApplicationsModule {}

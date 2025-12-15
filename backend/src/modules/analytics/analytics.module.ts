import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, RolesGuard],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/prisma/prisma.module';

// Main dashboard
import { AdminDashboardController } from '@/modules/admin/admin-dashboard.controller';
import { AdminDashboardService } from '@/modules/admin/admin-dashboard.service';

// Sub-modules
import { AdminUsersController } from '@/modules/admin/users/admin-users.controller';
import { AdminUsersService } from '@/modules/admin/users/admin-users.service';

import { AdminCompaniesController } from '@/modules/admin/companies/admin-companies.controller';
import { AdminCompaniesService } from '@/modules/admin/companies/admin-companies.service';

import { AdminJobsController } from '@/modules/admin/jobs/admin-jobs.controller';
import { AdminJobsService } from '@/modules/admin/jobs/admin-jobs.service';

import { AdminContentController } from '@/modules/admin/content/admin-content.controller';
import { AdminContentService } from '@/modules/admin/content/admin-content.service';

import { AdminModerationController } from '@/modules/admin/moderation/admin-moderation.controller';
import { AdminModerationService } from '@/modules/admin/moderation/admin-moderation.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    AdminDashboardController,
    AdminUsersController,
    AdminCompaniesController,
    AdminJobsController,
    AdminContentController,
    AdminModerationController,
  ],
  providers: [
    AdminDashboardService,
    AdminUsersService,
    AdminCompaniesService,
    AdminJobsService,
    AdminContentService,
    AdminModerationService,
  ],
  exports: [
    AdminDashboardService,
    AdminUsersService,
    AdminCompaniesService,
    AdminJobsService,
    AdminContentService,
    AdminModerationService,
  ],
})
export class AdminModule {}

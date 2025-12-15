import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

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

import { AdminApplicationsController } from '@/modules/admin/applications/admin-applications.controller';
import { AdminApplicationsService } from '@/modules/admin/applications/admin-applications.service';

import { AdminCategoriesController } from '@/modules/admin/categories/admin-categories.controller';

import { AdminSkillsController } from '@/modules/admin/skills/admin-skills.controller';

import { AdminInterviewsController } from '@/modules/admin/interviews/admin-interviews.controller';
import { AdminInterviewsService } from '@/modules/admin/interviews/admin-interviews.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    AdminDashboardController,
    AdminUsersController,
    AdminCompaniesController,
    AdminJobsController,
    AdminContentController,
    AdminModerationController,
    AdminApplicationsController,
    AdminCategoriesController,
    AdminSkillsController,
    AdminInterviewsController,
  ],
  providers: [
    AdminDashboardService,
    AdminUsersService,
    AdminCompaniesService,
    AdminJobsService,
    AdminContentService,
    AdminModerationService,
    AdminApplicationsService,
    AdminInterviewsService,
    RolesGuard,
  ],
  exports: [
    AdminDashboardService,
    AdminUsersService,
    AdminCompaniesService,
    AdminJobsService,
    AdminContentService,
    AdminModerationService,
    AdminApplicationsService,
  ],
})
export class AdminModule {}

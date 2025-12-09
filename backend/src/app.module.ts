import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { JobsModule } from '@/modules/jobs/jobs.module';
import { CompaniesModule } from '@/modules/companies/companies.module';
import { ApplicationsModule } from '@/modules/applications/applications.module';
import { ResumesModule } from '@/modules/resumes/resumes.module';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { SkillsModule } from '@/modules/skills/skills.module';
import { SavedJobsModule } from '@/modules/saved-jobs/saved-jobs.module';
import { UploadModule } from '@/modules/upload/upload.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { EmailModule } from '@/modules/email/email.module';
import { AdminModule } from '@/modules/admin/admin.module';
import { ReviewsModule } from '@/modules/reviews/reviews.module';
import { MessagingModule } from '@/modules/messaging/messaging.module';
import { AnalyticsModule } from '@/modules/analytics/analytics.module';
import { RecommendationsModule } from '@/modules/recommendations/recommendations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    JobsModule,
    CompaniesModule,
    ApplicationsModule,
    ResumesModule,
    CategoriesModule,
    SkillsModule,
    SavedJobsModule,
    UploadModule,
    NotificationsModule,
    EmailModule,
    AdminModule,
    ReviewsModule,
    MessagingModule,
    AnalyticsModule,
    RecommendationsModule,
  ],
})
export class AppModule {}

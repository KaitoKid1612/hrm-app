import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
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
import { InvitesModule } from '@/modules/invites/invites.module';
import { InterviewsModule } from '@/modules/interviews/interviews.module';
import { WorkExperiencesModule } from '@/modules/work-experiences/work-experiences.module';
import { EducationsModule } from '@/modules/educations/educations.module';
import { CertificatesModule } from '@/modules/certificates/certificates.module';
import { BenefitsModule } from '@/modules/benefits/benefits.module';
import { CompanyFollowersModule } from '@/modules/company-followers/company-followers.module';
import { JobAlertsModule } from '@/modules/job-alerts/job-alerts.module';
import { CandidatesModule } from '@/modules/candidates/candidates.module';

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
    InvitesModule,
    InterviewsModule,
    WorkExperiencesModule,
    EducationsModule,
    CertificatesModule,
    BenefitsModule,
    CompanyFollowersModule,
    JobAlertsModule,
    InterviewsModule,
    CandidatesModule,
  ],
  providers: [RolesGuard],
})
export class AppModule {}

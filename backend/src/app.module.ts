import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { JobsModule } from '@/modules/jobs/jobs.module';
import { CompaniesModule } from '@/modules/companies/companies.module';
import { ApplicationsModule } from '@/modules/applications/applications.module';
import { ResumesModule } from '@/modules/resumes/resumes.module';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { SkillsModule } from '@/modules/skills/skills.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    JobsModule,
    CompaniesModule,
    ApplicationsModule,
    ResumesModule,
    CategoriesModule,
    SkillsModule,
  ],
})
export class AppModule {}

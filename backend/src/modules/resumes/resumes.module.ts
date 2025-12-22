import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

@Module({
  imports: [PrismaModule],
  controllers: [ResumesController],
  providers: [ResumesService, RolesGuard],
})
export class ResumesModule {}

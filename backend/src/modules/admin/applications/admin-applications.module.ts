import { Module } from '@nestjs/common';
import { AdminApplicationsController } from './admin-applications.controller';
import { AdminApplicationsService } from './admin-applications.service';
import { PrismaModule } from '@/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminApplicationsController],
  providers: [AdminApplicationsService],
})
export class AdminApplicationsModule {}

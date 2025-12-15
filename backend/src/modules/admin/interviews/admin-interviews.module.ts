import { Module } from '@nestjs/common';
import { AdminInterviewsController } from './admin-interviews.controller';
import { AdminInterviewsService } from './admin-interviews.service';
import { PrismaModule } from '@/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminInterviewsController],
  providers: [AdminInterviewsService],
  exports: [AdminInterviewsService],
})
export class AdminInterviewsModule {}

import { Module } from '@nestjs/common';
import { AdminSkillsController } from './admin-skills.controller';
import { AdminContentService } from '../content/admin-content.service';
import { PrismaModule } from '@/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminSkillsController],
  providers: [AdminContentService],
  exports: [AdminContentService],
})
export class AdminSkillsModule {}

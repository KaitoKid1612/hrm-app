import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [JobsController],
  providers: [JobsService, RolesGuard],
  exports: [JobsService],
})
export class JobsModule {}

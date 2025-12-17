import { Module } from '@nestjs/common';
import { CompanyFollowersService } from './company-followers.service';
import { CompanyFollowersController } from './company-followers.controller';
import { PrismaModule } from '@/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CompanyFollowersController],
  providers: [CompanyFollowersService],
  exports: [CompanyFollowersService],
})
export class CompanyFollowersModule {}

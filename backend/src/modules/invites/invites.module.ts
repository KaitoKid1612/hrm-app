import { Module } from '@nestjs/common';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { EmailModule } from '@/modules/email/email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [InvitesController],
  providers: [InvitesService],
  exports: [InvitesService],
})
export class InvitesModule {}

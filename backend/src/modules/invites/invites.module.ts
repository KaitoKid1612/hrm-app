import { Module } from '@nestjs/common';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { EmailModule } from '@/modules/email/email.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [PrismaModule, EmailModule, AuthModule],
  controllers: [InvitesController],
  providers: [InvitesService],
  exports: [InvitesService],
})
export class InvitesModule {}

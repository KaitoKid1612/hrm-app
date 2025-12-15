import { Module } from '@nestjs/common';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { EmailModule } from '@/modules/email/email.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

@Module({
  imports: [PrismaModule, EmailModule, AuthModule],
  controllers: [InvitesController],
  providers: [InvitesService, RolesGuard],
  exports: [InvitesService],
})
export class InvitesModule {}

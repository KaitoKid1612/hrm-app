import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvitesService } from './invites.service';
import { BulkInviteDto } from './dto/invite.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('invites')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.EMPLOYER, Role.ADMIN)
export class InvitesController {
  constructor(@Inject(InvitesService) private readonly invitesService: InvitesService) {}

  /**
   * Bulk invite candidates via JSON
   * POST /invites/bulk
   */
  @Post('bulk')
  async bulkInvite(@CurrentUser() user: any, @Body() dto: BulkInviteDto) {
    return this.invitesService.bulkInvite(user.id, dto);
  }

  /**
   * Upload CSV and invite candidates
   * POST /invites/upload-csv/:jobId
   */
  @Post('upload-csv/:jobId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @CurrentUser() user: any,
    @Param('jobId') jobId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const allowedMimeTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only CSV and Excel files are allowed');
    }

    return this.invitesService.processCsvInvite(user.id, jobId, file);
  }

  /**
   * Get invite history for a job
   * GET /invites/job/:jobId
   */
  @Get('job/:jobId')
  async getJobInvites(@CurrentUser() user: any, @Param('jobId') jobId: string) {
    return this.invitesService.getJobInvites(user.id, jobId);
  }

  /**
   * Get all invites for employer
   * GET /invites/my-invites
   */
  @Get('my-invites')
  async getMyInvites(@CurrentUser() user: any) {
    return this.invitesService.getEmployerInvites(user.id);
  }
}

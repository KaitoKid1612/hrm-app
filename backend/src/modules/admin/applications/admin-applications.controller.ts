import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AdminApplicationsService } from './admin-applications.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AdminQueryApplicationsDto, AdminUpdateApplicationDto } from './dto/admin-applications.dto';

@Controller('admin/applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminApplicationsController {
  constructor(
    @Inject(AdminApplicationsService)
    private readonly adminApplicationsService: AdminApplicationsService,
  ) {}

  @Get()
  getAllApplications(@Query() query: AdminQueryApplicationsDto) {
    return this.adminApplicationsService.getAllApplications(query);
  }

  @Get(':id')
  getApplicationById(@Param('id') id: string) {
    return this.adminApplicationsService.getApplicationById(id);
  }

  @Patch(':id')
  updateApplication(@Param('id') id: string, @Body() dto: AdminUpdateApplicationDto) {
    return this.adminApplicationsService.updateApplication(id, dto);
  }

  @Delete(':id')
  deleteApplication(@Param('id') id: string) {
    return this.adminApplicationsService.deleteApplication(id);
  }

  @Patch(':id/status')
  changeStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminApplicationsService.changeStatus(id, status);
  }

  @Get('stats/overview')
  getApplicationStats() {
    return this.adminApplicationsService.getApplicationStats();
  }
}

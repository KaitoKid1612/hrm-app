import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Post,
  Inject,
} from '@nestjs/common';
import { AdminJobsService } from './admin-jobs.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  AdminQueryJobsDto,
  AdminUpdateJobDto,
  AdminBulkActionJobsDto,
  AdminQueryApplicationsDto,
} from './dto/admin-jobs.dto';

@Controller('admin/jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminJobsController {
  constructor(@Inject(AdminJobsService) private readonly adminJobsService: AdminJobsService) {}

  @Get()
  getAllJobs(@Query() query: AdminQueryJobsDto) {
    return this.adminJobsService.getAllJobs(query);
  }

  @Get(':id')
  getJobById(@Param('id') id: string) {
    return this.adminJobsService.getJobById(id);
  }

  @Put(':id')
  updateJob(@Param('id') id: string, @Body() dto: AdminUpdateJobDto) {
    return this.adminJobsService.updateJob(id, dto);
  }

  @Delete(':id')
  deleteJob(@Param('id') id: string) {
    return this.adminJobsService.deleteJob(id);
  }

  @Post('bulk')
  bulkAction(@Body() dto: AdminBulkActionJobsDto) {
    return this.adminJobsService.bulkAction(dto);
  }

  @Get('applications/all')
  getAllApplications(@Query() query: AdminQueryApplicationsDto) {
    return this.adminJobsService.getAllApplications(query);
  }

  @Delete('applications/:id')
  deleteApplication(@Param('id') id: string) {
    return this.adminJobsService.deleteApplication(id);
  }
}

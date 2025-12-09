import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() data: any) {
    return this.applicationsService.create(user.id, data);
  }

  @Get('my-applications')
  getMyApplications(@CurrentUser() user: any) {
    return this.applicationsService.findByUser(user.id);
  }

  @Get('job/:jobId')
  getJobApplications(@Param('jobId') jobId: string) {
    return this.applicationsService.findByJob(jobId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.applicationsService.updateStatus(id, status);
  }
}

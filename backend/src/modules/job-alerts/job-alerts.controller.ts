import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
  Request,
} from '@nestjs/common';
import { JobAlertsService } from './job-alerts.service';
import { CreateJobAlertDto } from './dto/create-job-alert.dto';
import { UpdateJobAlertDto } from './dto/update-job-alert.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@Controller('job-alerts')
@UseGuards(JwtAuthGuard)
export class JobAlertsController {
  constructor(
    @Inject(JobAlertsService)
    private readonly jobAlertsService: JobAlertsService,
  ) {}

  @Post()
  create(@Request() req: any, @Body() createDto: CreateJobAlertDto) {
    return this.jobAlertsService.create(req.user.id, createDto);
  }

  @Get('my')
  findMy(@Request() req: any) {
    return this.jobAlertsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobAlertsService.findOne(id);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateDto: UpdateJobAlertDto) {
    return this.jobAlertsService.update(id, req.user.id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.jobAlertsService.remove(id, req.user.id);
  }

  @Post(':id/toggle')
  toggleActive(@Request() req: any, @Param('id') id: string) {
    return this.jobAlertsService.toggleActive(id, req.user.id);
  }

  @Get(':id/matching-jobs')
  findMatchingJobs(@Param('id') id: string) {
    return this.jobAlertsService.findMatchingJobs(id);
  }
}

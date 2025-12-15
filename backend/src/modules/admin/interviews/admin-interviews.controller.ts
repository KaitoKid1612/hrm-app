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
import { AdminInterviewsService } from './admin-interviews.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AdminQueryInterviewsDto, AdminUpdateInterviewDto } from './dto/admin-interviews.dto';

/**
 * Admin Interviews Controller
 * Manages interview scheduling and feedback
 */
@Controller('admin/interviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminInterviewsController {
  constructor(
    @Inject(AdminInterviewsService) private readonly interviewsService: AdminInterviewsService,
  ) {}

  @Get()
  getAllInterviews(@Query() query: AdminQueryInterviewsDto) {
    return this.interviewsService.getAllInterviews(query);
  }

  @Get('stats/overview')
  getInterviewStats() {
    return this.interviewsService.getInterviewStats();
  }

  @Get(':id')
  getInterviewById(@Param('id') id: string) {
    return this.interviewsService.getInterviewById(id);
  }

  @Patch(':id')
  updateInterview(@Param('id') id: string, @Body() dto: AdminUpdateInterviewDto) {
    return this.interviewsService.updateInterview(id, dto);
  }

  @Delete(':id')
  deleteInterview(@Param('id') id: string) {
    return this.interviewsService.deleteInterview(id);
  }

  @Patch(':id/status')
  changeInterviewStatus(
    @Param('id') id: string,
    @Body() body: { status: string; feedback?: string },
  ) {
    return this.interviewsService.changeInterviewStatus(id, body.status, body.feedback);
  }
}

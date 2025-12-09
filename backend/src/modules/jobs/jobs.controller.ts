import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, QueryJobDto, SearchSuggestionsDto } from './dto/job.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  // ============================================
  // Public Search & Filter Endpoints
  // ============================================

  @Get('search/all')
  findAll(@Query() query: QueryJobDto) {
    return this.jobsService.findAll(query);
  }

  @Get('search/suggestions')
  getSearchSuggestions(@Query() query: SearchSuggestionsDto) {
    return this.jobsService.getSearchSuggestions(query.query, query.limit);
  }

  @Get('search/trending')
  getTrendingJobs(@Query('limit') limit?: number) {
    return this.jobsService.getTrendingJobs(limit ? +limit : 10);
  }

  @Get('search/statistics')
  getJobStatistics() {
    return this.jobsService.getJobStatistics();
  }

  @Get(':id/similar')
  getSimilarJobs(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.jobsService.getSimilarJobs(id, limit ? +limit : 5);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  // ============================================
  // Employer Endpoints (Protected)
  // ============================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateJobDto) {
    // Get company by userId
    const company = await this.jobsService['prisma'].company.findUnique({
      where: { userId: user.id },
    });

    if (!company) {
      throw new Error('Vui lòng tạo hồ sơ công ty trước');
    }

    return this.jobsService.create(company.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Put(':id')
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.jobsService.remove(id, user.id);
  }
}

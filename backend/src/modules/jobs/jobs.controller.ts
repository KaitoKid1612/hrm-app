import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, QueryJobDto, SearchSuggestionsDto } from './dto/job.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('jobs')
export class JobsController {
  constructor(@Inject(JobsService) private readonly jobsService: JobsService) {}

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

  // ============================================
  // Employer Endpoints (Protected) - MUST BE BEFORE :id routes
  // ============================================

  @UseGuards(JwtAuthGuard)
  @Get('my-jobs')
  getMyJobs(@CurrentUser() user: any, @Query() query: QueryJobDto) {
    if (user.role !== Role.EMPLOYER) {
      throw new ForbiddenException('Chỉ nhà tuyển dụng mới có thể xem danh sách công việc');
    }
    return this.jobsService.findJobsByUserId(user.id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('my-jobs')
  async createMyJob(@CurrentUser() user: any, @Body() dto: CreateJobDto) {
    if (user.role !== Role.EMPLOYER) {
      throw new ForbiddenException('Chỉ nhà tuyển dụng mới có thể tạo công việc');
    }
    return this.jobsService.createJobByUserId(user.id, dto);
  }

  // ============================================
  // Public Detail & Related Endpoints
  // ============================================

  @Get(':id/similar')
  getSimilarJobs(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.jobsService.getSimilarJobs(id, limit ? +limit : 5);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  // ============================================
  // Employer Job Management (Protected)
  // ============================================

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateJobDto) {
    if (user.role !== Role.EMPLOYER) {
      throw new ForbiddenException('Chỉ nhà tuyển dụng mới có thể tạo công việc');
    }
    return this.jobsService.createJobByUserId(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateJobDto) {
    if (user.role !== Role.EMPLOYER) {
      throw new ForbiddenException('Chỉ nhà tuyển dụng mới có thể cập nhật công việc');
    }
    return this.jobsService.update(id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    if (user.role !== Role.EMPLOYER) {
      throw new ForbiddenException('Chỉ nhà tuyển dụng mới có thể xóa công việc');
    }
    return this.jobsService.remove(id, user.id);
  }
}

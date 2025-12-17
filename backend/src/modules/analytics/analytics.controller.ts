import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import {
  AnalyticsQueryDto,
  CompanyAnalyticsQueryDto,
  CandidateAnalyticsQueryDto,
} from './dto/analytics.dto';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(@Inject(AnalyticsService) private readonly analyticsService: AnalyticsService) {}

  /**
   * Get platform-wide analytics (Admin only)
   * GET /analytics/platform
   */
  @Get('platform')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getPlatformAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getPlatformAnalytics(query);
  }

  /**
   * Get company analytics (Employer only)
   * GET /analytics/company
   */
  @Get('company')
  @UseGuards(RolesGuard)
  @Roles(Role.EMPLOYER)
  async getCompanyAnalytics(@CurrentUser() user: any, @Query() query: CompanyAnalyticsQueryDto) {
    const analytics = await this.analyticsService.getCompanyAnalytics(user.id, query);

    if (!analytics) {
      throw new NotFoundException('Company not found for this user');
    }

    return analytics;
  }

  /**
   * Get candidate analytics (Candidate only)
   * GET /analytics/candidate
   */
  @Get('candidate')
  @UseGuards(RolesGuard)
  @Roles(Role.CANDIDATE)
  async getCandidateAnalytics(
    @CurrentUser() user: any,
    @Query() query: CandidateAnalyticsQueryDto,
  ) {
    return this.analyticsService.getCandidateAnalytics(user.id, query);
  }

  /**
   * Get job analytics (Employer only)
   * GET /analytics/jobs/:id
   */
  @Get('jobs/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.EMPLOYER)
  async getJobAnalytics(@CurrentUser('sub') userId: string, @Param('id') jobId: string) {
    const analytics = await this.analyticsService.getJobAnalytics(userId, jobId);

    if (!analytics) {
      throw new NotFoundException('Job not found or unauthorized');
    }

    return analytics;
  }
}

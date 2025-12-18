import { Controller, Get, Query, Param, UseGuards, Post, Body, Inject } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import {
  JobRecommendationQueryDto,
  CandidateRecommendationQueryDto,
  MatchScoreDto,
} from './dto/recommendation.dto';

@Controller('recommendations')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(
    @Inject(RecommendationsService) private readonly recommendationsService: RecommendationsService,
  ) {}

  /**
   * Get job recommendations for current candidate
   * GET /recommendations/jobs
   */
  @Get('jobs')
  @UseGuards(RolesGuard)
  @Roles(Role.CANDIDATE)
  async getJobRecommendations(@CurrentUser() user: any, @Query() query: JobRecommendationQueryDto) {
    return this.recommendationsService.getJobRecommendations(user.id, query);
  }

  /**
   * Get candidate recommendations for a job (Employer only)
   * GET /recommendations/candidates
   */
  @Get('candidates')
  @UseGuards(RolesGuard)
  @Roles(Role.EMPLOYER)
  async getCandidateRecommendations(
    @CurrentUser() user: any,
    @Query() query: CandidateRecommendationQueryDto,
  ) {
    return this.recommendationsService.getCandidateRecommendations(user.id, query);
  }

  /**
   * Calculate match score for a specific job
   * POST /recommendations/match-score
   */
  @Post('match-score')
  @UseGuards(RolesGuard)
  @Roles(Role.CANDIDATE)
  async getMatchScore(@CurrentUser() user: any, @Body() dto: MatchScoreDto) {
    return this.recommendationsService.getMatchScore(user.id, dto);
  }

  /**
   * Get similar jobs (Public access)
   * GET /recommendations/similar/:jobId
   */
  @Get('similar/:jobId')
  async getSimilarJobs(@Param('jobId') jobId: string, @Query('limit') limit?: number) {
    return this.recommendationsService.getSimilarJobs(jobId, limit ? Number(limit) : 5);
  }
}

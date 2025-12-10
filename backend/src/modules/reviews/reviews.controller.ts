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
  Patch,
  Inject,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import {
  CreateReviewDto,
  UpdateReviewDto,
  QueryReviewsDto,
  ModerateReviewDto,
} from './dto/review.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('reviews')
export class ReviewsController {
  constructor(@Inject(ReviewsService) private readonly reviewsService: ReviewsService) {}

  // ============================================
  // Public Endpoints
  // ============================================

  @Get()
  findAll(@Query() query: QueryReviewsDto) {
    return this.reviewsService.findAll(query);
  }

  @Get('company/:companyId')
  findByCompany(@Param('companyId') companyId: string, @Query() query: QueryReviewsDto) {
    return this.reviewsService.findByCompany(companyId, query);
  }

  @Get('company/:companyId/rating')
  getCompanyRating(@Param('companyId') companyId: string) {
    return this.reviewsService.getCompanyRating(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  // ============================================
  // Authenticated User Endpoints
  // ============================================

  @UseGuards(JwtAuthGuard)
  @Get('my/reviews')
  getMyReviews(@CurrentUser() user: any) {
    return this.reviewsService.findMyReviews(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reviewsService.delete(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/helpful')
  markHelpful(@Param('id') id: string) {
    return this.reviewsService.markHelpful(id);
  }

  // ============================================
  // Admin Endpoints
  // ============================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/pending')
  getPendingReviews() {
    return this.reviewsService.getPendingReviews();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/:id/moderate')
  moderate(@Param('id') id: string, @Body() dto: ModerateReviewDto) {
    return this.reviewsService.moderate(id, dto);
  }
}

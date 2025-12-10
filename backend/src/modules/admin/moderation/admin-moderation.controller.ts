import { Controller, Get, Delete, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { AdminModerationService } from './admin-moderation.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AdminQueryReviewsDto } from './dto/admin-moderation.dto';

@Controller('admin/moderation')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminModerationController {
  constructor(
    @Inject(AdminModerationService) private readonly adminModerationService: AdminModerationService,
  ) {}

  @Get('reviews')
  getAllReviews(@Query() query: AdminQueryReviewsDto) {
    return this.adminModerationService.getAllReviews(query);
  }

  @Delete('reviews/:id')
  deleteReview(@Param('id') id: string) {
    return this.adminModerationService.deleteReview(id);
  }
}

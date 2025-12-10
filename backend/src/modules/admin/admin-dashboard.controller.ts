import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AdminDateRangeDto } from './dto/dashboard.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminDashboardController {
  constructor(
    @Inject(AdminDashboardService) private readonly adminDashboardService: AdminDashboardService,
  ) {}

  @Get('dashboard')
  getDashboardStats(@Query() dateRange?: AdminDateRangeDto) {
    return this.adminDashboardService.getDashboardStats(dateRange);
  }

  @Get('analytics')
  getAnalytics(@Query() dateRange?: AdminDateRangeDto) {
    return this.adminDashboardService.getAnalytics(dateRange);
  }
}

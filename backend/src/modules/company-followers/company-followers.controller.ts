import { Controller, Get, Post, Delete, Param, UseGuards, Inject, Request } from '@nestjs/common';
import { CompanyFollowersService } from './company-followers.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@Controller('company-followers')
@UseGuards(JwtAuthGuard)
export class CompanyFollowersController {
  constructor(
    @Inject(CompanyFollowersService)
    private readonly companyFollowersService: CompanyFollowersService,
  ) {}

  @Post(':companyId')
  follow(@Request() req: any, @Param('companyId') companyId: string) {
    return this.companyFollowersService.follow(req.user.id, companyId);
  }

  @Delete(':companyId')
  unfollow(@Request() req: any, @Param('companyId') companyId: string) {
    return this.companyFollowersService.unfollow(req.user.id, companyId);
  }

  @Get('my')
  getMyFollowedCompanies(@Request() req: any) {
    return this.companyFollowersService.getFollowedCompanies(req.user.id);
  }

  @Get('company/:companyId')
  getCompanyFollowers(@Param('companyId') companyId: string) {
    return this.companyFollowersService.getCompanyFollowers(companyId);
  }

  @Get('is-following/:companyId')
  isFollowing(@Request() req: any, @Param('companyId') companyId: string) {
    return this.companyFollowersService.isFollowing(req.user.id, companyId);
  }

  @Get('count/:companyId')
  getFollowerCount(@Param('companyId') companyId: string) {
    return this.companyFollowersService.getFollowerCount(companyId);
  }
}

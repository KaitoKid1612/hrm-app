import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('candidates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CandidatesController {
  constructor(@Inject(CandidatesService) private readonly candidatesService: CandidatesService) {}

  @Get('search')
  @Roles(Role.EMPLOYER, Role.ADMIN)
  async searchCandidates(@Query() query: any, @CurrentUser() user: any) {
    return this.candidatesService.searchCandidates(query, user.id);
  }

  @Get('saved')
  @Roles(Role.EMPLOYER, Role.ADMIN)
  async getSavedCandidates(@CurrentUser() user: any) {
    return this.candidatesService.getSavedCandidates(user.id);
  }

  @Get(':userId')
  @Roles(Role.EMPLOYER, Role.ADMIN)
  async getCandidateProfile(@Param('userId') userId: string) {
    return this.candidatesService.getCandidateProfile(userId);
  }

  @Post('save')
  @Roles(Role.EMPLOYER, Role.ADMIN)
  async saveCandidate(@Body() body: { candidateId: string }, @CurrentUser() user: any) {
    return this.candidatesService.saveCandidateToPool(user.id, body.candidateId);
  }

  @Delete('saved/:candidateId')
  @Roles(Role.EMPLOYER, Role.ADMIN)
  async removeSavedCandidate(@Param('candidateId') candidateId: string, @CurrentUser() user: any) {
    return this.candidatesService.removeSavedCandidate(user.id, candidateId);
  }
}

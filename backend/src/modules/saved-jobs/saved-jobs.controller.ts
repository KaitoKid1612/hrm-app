import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { SavedJobsService } from './saved-jobs.service';
import { SaveJobDto } from './dto/save-job.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';

@Controller('saved-jobs')
@UseGuards(JwtAuthGuard)
export class SavedJobsController {
  constructor(@Inject(SavedJobsService) private readonly savedJobsService: SavedJobsService) {}

  @Post()
  saveJob(@CurrentUser() user: any, @Body() dto: SaveJobDto) {
    return this.savedJobsService.saveJob(user.id, dto);
  }

  @Delete(':id')
  unsaveJob(@CurrentUser() user: any, @Param('id') id: string) {
    return this.savedJobsService.unsaveJob(user.id, id);
  }

  @Get()
  getMySavedJobs(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.savedJobsService.getMySavedJobs(
      user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('check/:jobId')
  checkSaved(@CurrentUser() user: any, @Param('jobId') jobId: string) {
    return this.savedJobsService.checkSaved(user.id, jobId);
  }

  @Get('ids')
  getSavedJobIds(@CurrentUser() user: any) {
    return this.savedJobsService.getSavedJobIds(user.id);
  }
}

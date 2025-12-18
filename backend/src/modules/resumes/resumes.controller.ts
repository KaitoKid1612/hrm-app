import { Controller, Get, Post, Param, Body, UseGuards, Inject } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UpsertResumeDto } from './dto/upsert-resume.dto';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(@Inject(ResumesService) private readonly resumesService: ResumesService) {}

  @Post()
  upsert(@CurrentUser() user: any, @Body() data: UpsertResumeDto) {
    return this.resumesService.upsert(user.id, data);
  }

  @Get('my-resume')
  getMyResume(@CurrentUser() user: any) {
    return this.resumesService.findByUserId(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }
}

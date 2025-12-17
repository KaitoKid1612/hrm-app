import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
  Request,
} from '@nestjs/common';
import { WorkExperiencesService } from './work-experiences.service';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@Controller('work-experiences')
@UseGuards(JwtAuthGuard)
export class WorkExperiencesController {
  constructor(
    @Inject(WorkExperiencesService)
    private readonly workExperiencesService: WorkExperiencesService,
  ) {}

  @Post()
  create(@Request() req: any, @Body() createDto: CreateWorkExperienceDto) {
    return this.workExperiencesService.create(req.user.id, createDto);
  }

  @Get('my')
  findMy(@Request() req: any) {
    return this.workExperiencesService.findAllByUser(req.user.id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.workExperiencesService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workExperiencesService.findOne(id);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateDto: UpdateWorkExperienceDto) {
    return this.workExperiencesService.update(id, req.user.id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.workExperiencesService.remove(id, req.user.id);
  }
}

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
import { EducationsService } from './educations.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@Controller('educations')
@UseGuards(JwtAuthGuard)
export class EducationsController {
  constructor(
    @Inject(EducationsService)
    private readonly educationsService: EducationsService,
  ) {}

  @Post()
  create(@Request() req: any, @Body() createDto: CreateEducationDto) {
    return this.educationsService.create(req.user.id, createDto);
  }

  @Get('my')
  findMy(@Request() req: any) {
    return this.educationsService.findAllByUser(req.user.id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.educationsService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.educationsService.findOne(id);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateDto: UpdateEducationDto) {
    return this.educationsService.update(id, req.user.id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.educationsService.remove(id, req.user.id);
  }
}

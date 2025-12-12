import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto, UpdateInterviewDto } from './dto/interview.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('interviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('EMPLOYER')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  create(@Req() req: any, @Body() createInterviewDto: CreateInterviewDto) {
    return this.interviewsService.create(req.user.userId, createInterviewDto);
  }

  @Get()
  findAll(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.interviewsService.findAll(req.user.userId, { status, from, to });
  }

  @Get('upcoming')
  getUpcoming(@Req() req: any, @Query('limit') limit?: string) {
    return this.interviewsService.getUpcoming(req.user.userId, limit ? parseInt(limit) : 10);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.interviewsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() updateInterviewDto: UpdateInterviewDto) {
    return this.interviewsService.update(req.user.userId, id, updateInterviewDto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.interviewsService.remove(req.user.userId, id);
  }
}

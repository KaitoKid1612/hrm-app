import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { AddJobBenefitDto } from './dto/add-job-benefit.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@Controller('benefits')
export class BenefitsController {
  constructor(
    @Inject(BenefitsService)
    private readonly benefitsService: BenefitsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createDto: CreateBenefitDto) {
    return this.benefitsService.create(createDto);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    return this.benefitsService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.benefitsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateDto: UpdateBenefitDto) {
    return this.benefitsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.benefitsService.remove(id);
  }

  // Job Benefits
  @Post('jobs/:jobId')
  @UseGuards(JwtAuthGuard)
  addToJob(@Param('jobId') jobId: string, @Body() addDto: AddJobBenefitDto) {
    return this.benefitsService.addBenefitToJob(jobId, addDto);
  }

  @Delete('jobs/:jobId/:benefitId')
  @UseGuards(JwtAuthGuard)
  removeFromJob(@Param('jobId') jobId: string, @Param('benefitId') benefitId: string) {
    return this.benefitsService.removeBenefitFromJob(jobId, benefitId);
  }

  @Get('jobs/:jobId')
  getJobBenefits(@Param('jobId') jobId: string) {
    return this.benefitsService.getJobBenefits(jobId);
  }
}

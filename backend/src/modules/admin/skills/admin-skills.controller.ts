import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AdminContentService } from '../content/admin-content.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AdminCreateSkillDto, AdminUpdateSkillDto } from '../content/dto/admin-content.dto';

export class AdminQuerySkillsDto {
  page?: number;
  limit?: number;
}

/**
 * Admin Skills Controller
 * Manages skill CRUD operations
 */
@Controller('admin/skills')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminSkillsController {
  constructor(@Inject(AdminContentService) private readonly contentService: AdminContentService) {}

  @Get()
  getAllSkills(@Query() query: AdminQuerySkillsDto) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 50;
    return this.contentService.getAllSkills(page, limit);
  }

  @Post()
  createSkill(@Body() dto: AdminCreateSkillDto) {
    return this.contentService.createSkill(dto);
  }

  @Patch(':id')
  updateSkill(@Param('id') id: string, @Body() dto: AdminUpdateSkillDto) {
    return this.contentService.updateSkill(id, dto);
  }

  @Delete(':id')
  deleteSkill(@Param('id') id: string) {
    return this.contentService.deleteSkill(id);
  }
}

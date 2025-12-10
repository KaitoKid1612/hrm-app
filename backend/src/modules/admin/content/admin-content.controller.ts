import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AdminContentService } from './admin-content.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  AdminCreateCategoryDto,
  AdminUpdateCategoryDto,
  AdminCreateSkillDto,
  AdminUpdateSkillDto,
} from './dto/admin-content.dto';

@Controller('admin/content')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminContentController {
  constructor(
    @Inject(AdminContentService) private readonly adminContentService: AdminContentService,
  ) {}

  // Categories
  @Get('categories')
  getAllCategories(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminContentService.getAllCategories(page, limit);
  }

  @Post('categories')
  createCategory(@Body() dto: AdminCreateCategoryDto) {
    return this.adminContentService.createCategory(dto);
  }

  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: AdminUpdateCategoryDto) {
    return this.adminContentService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.adminContentService.deleteCategory(id);
  }

  // Skills
  @Get('skills')
  getAllSkills(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminContentService.getAllSkills(page, limit);
  }

  @Post('skills')
  createSkill(@Body() dto: AdminCreateSkillDto) {
    return this.adminContentService.createSkill(dto);
  }

  @Put('skills/:id')
  updateSkill(@Param('id') id: string, @Body() dto: AdminUpdateSkillDto) {
    return this.adminContentService.updateSkill(id, dto);
  }

  @Delete('skills/:id')
  deleteSkill(@Param('id') id: string) {
    return this.adminContentService.deleteSkill(id);
  }
}

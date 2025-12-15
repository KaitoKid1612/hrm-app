import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AdminContentService } from '../content/admin-content.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AdminCreateCategoryDto, AdminUpdateCategoryDto } from '../content/dto/admin-content.dto';

@Controller('admin/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCategoriesController {
  constructor(
    @Inject(AdminContentService) private readonly adminContentService: AdminContentService,
  ) {}

  @Get()
  getAllCategories() {
    return this.adminContentService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.adminContentService.getCategoryById(id);
  }

  @Post()
  createCategory(@Body() dto: AdminCreateCategoryDto) {
    return this.adminContentService.createCategory(dto);
  }

  @Patch(':id')
  updateCategory(@Param('id') id: string, @Body() dto: AdminUpdateCategoryDto) {
    return this.adminContentService.updateCategory(id, dto);
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.adminContentService.deleteCategory(id);
  }
}

import { Controller, Get, Put, Delete, Body, Param, Query, UseGuards, Post } from '@nestjs/common';
import { AdminCompaniesService } from './admin-companies.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  AdminQueryCompaniesDto,
  AdminUpdateCompanyDto,
  AdminBulkActionCompaniesDto,
} from './dto/admin-companies.dto';

@Controller('admin/companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCompaniesController {
  constructor(private adminCompaniesService: AdminCompaniesService) {}

  @Get()
  getAllCompanies(@Query() query: AdminQueryCompaniesDto) {
    return this.adminCompaniesService.getAllCompanies(query);
  }

  @Get(':id')
  getCompanyById(@Param('id') id: string) {
    return this.adminCompaniesService.getCompanyById(id);
  }

  @Put(':id')
  updateCompany(@Param('id') id: string, @Body() dto: AdminUpdateCompanyDto) {
    return this.adminCompaniesService.updateCompany(id, dto);
  }

  @Delete(':id')
  deleteCompany(@Param('id') id: string) {
    return this.adminCompaniesService.deleteCompany(id);
  }

  @Post('bulk')
  bulkAction(@Body() dto: AdminBulkActionCompaniesDto) {
    return this.adminCompaniesService.bulkAction(dto);
  }
}

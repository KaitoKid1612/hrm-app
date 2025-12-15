import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Post,
  Inject,
} from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  AdminQueryUsersDto,
  AdminUpdateUserDto,
  AdminBulkActionUsersDto,
} from './dto/admin-users.dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminUsersController {
  constructor(@Inject(AdminUsersService) private readonly adminUsersService: AdminUsersService) {}

  @Get()
  getAllUsers(@Query() query: AdminQueryUsersDto) {
    return this.adminUsersService.getAllUsers(query);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.adminUsersService.getUserById(id);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.adminUsersService.updateUser(id, dto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.adminUsersService.deleteUser(id);
  }

  @Post('bulk')
  bulkAction(@Body() dto: AdminBulkActionUsersDto) {
    return this.adminUsersService.bulkAction(dto);
  }

  @Get('stats/overview')
  getUserStats() {
    return this.adminUsersService.getUserStats();
  }

  @Patch(':id/status')
  toggleUserStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminUsersService.toggleUserStatus(id, status);
  }
}

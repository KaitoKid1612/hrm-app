import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import {
  AdminQueryUsersDto,
  AdminUpdateUserDto,
  AdminBulkActionUsersDto,
} from './dto/admin-users.dto';

@Injectable()
export class AdminUsersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getAllUsers(query: AdminQueryUsersDto) {
    const {
      page = 1,
      limit = 20,
      keyword,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { email: { contains: keyword, mode: 'insensitive' } },
        { phone: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              applications: true,
              savedJobs: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((user) => ({
        ...user,
        password: undefined,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        company: true,
        applications: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            job: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        savedJobs: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            applications: true,
            savedJobs: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return {
      ...user,
      password: undefined,
    };
  }

  async updateUser(id: string, dto: AdminUpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        avatar: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Xóa người dùng thành công' };
  }

  async getUserStats() {
    const [total, byRole, active, banned] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { isActive: false } }),
    ]);

    const roleStats = byRole.reduce(
      (acc, item) => {
        acc[item.role.toLowerCase()] = item._count.role;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total,
      candidates: roleStats.candidate || 0,
      employers: roleStats.employer || 0,
      admins: roleStats.admin || 0,
      active,
      banned,
    };
  }

  async toggleUserStatus(id: string, status: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: status === 'ACTIVE',
        bannedAt: status === 'BANNED' ? new Date() : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        bannedAt: true,
      },
    });
  }

  async bulkAction(dto: AdminBulkActionUsersDto) {
    const { ids, action } = dto;

    switch (action) {
      case 'activate':
        await this.prisma.user.updateMany({
          where: { id: { in: ids } },
          data: { isActive: true },
        });
        break;
      case 'deactivate':
        await this.prisma.user.updateMany({
          where: { id: { in: ids } },
          data: { isActive: false },
        });
        break;
      case 'delete':
        await this.prisma.user.deleteMany({
          where: { id: { in: ids } },
        });
        break;
      default:
        throw new BadRequestException('Hành động không hợp lệ');
    }

    return { message: `Đã thực hiện ${action} cho ${ids.length} người dùng` };
  }
}

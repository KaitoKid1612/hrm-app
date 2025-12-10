import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import {
  AdminQueryCompaniesDto,
  AdminUpdateCompanyDto,
  AdminBulkActionCompaniesDto,
} from './dto/admin-companies.dto';

@Injectable()
export class AdminCompaniesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getAllCompanies(query: AdminQueryCompaniesDto) {
    const {
      page = 1,
      limit = 20,
      keyword,
      isVerified,
      isFeatured,
      city,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { email: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    if (isVerified !== undefined) where.isVerified = isVerified;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (city) where.city = city;

    const orderBy: any = {};
    if (sortBy === 'jobsCount') {
      orderBy.jobs = { _count: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              isActive: true,
            },
          },
          _count: {
            select: {
              jobs: true,
              reviews: true,
            },
          },
        },
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      data: companies,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCompanyById(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isActive: true,
            createdAt: true,
          },
        },
        jobs: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { applications: true },
            },
          },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            jobs: true,
            reviews: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Không tìm thấy công ty');
    }

    return company;
  }

  async updateCompany(id: string, dto: AdminUpdateCompanyDto) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Không tìm thấy công ty');
    }

    return this.prisma.company.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCompany(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Không tìm thấy công ty');
    }

    await this.prisma.company.delete({
      where: { id },
    });

    return { message: 'Xóa công ty thành công' };
  }

  async bulkAction(dto: AdminBulkActionCompaniesDto) {
    const { ids, action } = dto;

    switch (action) {
      case 'verify':
        await this.prisma.company.updateMany({
          where: { id: { in: ids } },
          data: { isVerified: true },
        });
        break;
      case 'delete':
        await this.prisma.company.deleteMany({
          where: { id: { in: ids } },
        });
        break;
      default:
        throw new BadRequestException('Hành động không hợp lệ');
    }

    return { message: `Đã thực hiện ${action} cho ${ids.length} công ty` };
  }
}

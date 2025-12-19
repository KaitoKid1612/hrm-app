import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { AdminQueryApplicationsDto, AdminUpdateApplicationDto } from './dto/admin-applications.dto';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class AdminApplicationsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getAllApplications(query: AdminQueryApplicationsDto) {
    const {
      page = 1,
      limit = 20,
      keyword,
      status,
      jobId,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Ensure page and limit are numbers
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (keyword) {
      where.OR = [
        { user: { name: { contains: keyword, mode: 'insensitive' } } },
        { user: { email: { contains: keyword, mode: 'insensitive' } } },
        { job: { title: { contains: keyword, mode: 'insensitive' } } },
      ];
    }

    if (status) where.status = status;
    if (jobId) where.jobId = jobId;
    if (userId) where.userId = userId;

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              phone: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              company: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      data: applications,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async getApplicationById(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            currentJobTitle: true,
            yearsOfExperience: true,
          },
        },
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
                email: true,
                phone: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        resume: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Không tìm thấy đơn ứng tuyển');
    }

    return application;
  }

  async updateApplication(id: string, dto: AdminUpdateApplicationDto) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Không tìm thấy đơn ứng tuyển');
    }

    const { notes: _notes, ...updateData } = dto;

    return this.prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async deleteApplication(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Không tìm thấy đơn ứng tuyển');
    }

    await this.prisma.application.delete({
      where: { id },
    });

    return { message: 'Xóa đơn ứng tuyển thành công' };
  }

  async changeStatus(id: string, status: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Không tìm thấy đơn ứng tuyển');
    }

    if (!Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
      throw new NotFoundException('Trạng thái không hợp lệ');
    }

    return this.prisma.application.update({
      where: { id },
      data: { status: status as ApplicationStatus },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async getApplicationStats() {
    const [total, statusCounts] = await Promise.all([
      this.prisma.application.count(),
      this.prisma.application.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    const stats = statusCounts.reduce(
      (acc, item) => {
        acc[item.status.toLowerCase()] = item._count.status;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total,
      pending: stats.pending || 0,
      reviewing: stats.reviewing || 0,
      accepted: stats.accepted || 0,
      rejected: stats.rejected || 0,
    };
  }
}

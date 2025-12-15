import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import {
  AdminQueryJobsDto,
  AdminUpdateJobDto,
  AdminBulkActionJobsDto,
  AdminQueryApplicationsDto,
} from './dto/admin-jobs.dto';

@Injectable()
export class AdminJobsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getAllJobs(query: AdminQueryJobsDto) {
    const {
      page = 1,
      limit = 20,
      keyword,
      isActive,
      isHot,
      isUrgent,
      companyId,
      categoryId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) where.isActive = isActive;
    if (isHot !== undefined) where.isHot = isHot;
    if (isUrgent !== undefined) where.isUrgent = isUrgent;
    if (companyId) where.companyId = companyId;
    if (categoryId) where.categoryId = categoryId;

    const orderBy: any = {};
    if (sortBy === 'applicationsCount') {
      orderBy.applications = { _count: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
              isVerified: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data: jobs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getJobById(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            email: true,
            phone: true,
            isVerified: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        skills: {
          include: {
            skill: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    return job;
  }

  async updateJob(id: string, dto: AdminUpdateJobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    return this.prisma.job.update({
      where: { id },
      data: dto,
    });
  }

  async deleteJob(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    await this.prisma.job.delete({
      where: { id },
    });

    return { message: 'Xóa công việc thành công' };
  }

  async bulkAction(dto: AdminBulkActionJobsDto) {
    const { ids, action } = dto;

    switch (action) {
      case 'activate':
        await this.prisma.job.updateMany({
          where: { id: { in: ids } },
          data: { isActive: true },
        });
        break;
      case 'deactivate':
        await this.prisma.job.updateMany({
          where: { id: { in: ids } },
          data: { isActive: false },
        });
        break;
      case 'delete':
        await this.prisma.job.deleteMany({
          where: { id: { in: ids } },
        });
        break;
      default:
        throw new BadRequestException('Hành động không hợp lệ');
    }

    return { message: `Đã thực hiện ${action} cho ${ids.length} công việc` };
  }

  // Applications Management
  async getAllApplications(query: AdminQueryApplicationsDto) {
    const {
      page = 1,
      limit = 20,
      keyword,
      status,
      jobId,
      userId,
      sortBy = 'appliedAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (keyword) {
      where.OR = [
        { job: { title: { contains: keyword, mode: 'insensitive' } } },
        { user: { name: { contains: keyword, mode: 'insensitive' } } },
        { user: { email: { contains: keyword, mode: 'insensitive' } } },
      ];
    }

    if (status) where.status = status;
    if (jobId) where.jobId = jobId;
    if (userId) where.userId = userId;

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
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
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

  async getJobStats() {
    const [total, active, closed] = await Promise.all([
      this.prisma.job.count(),
      this.prisma.job.count({
        where: {
          isActive: true,
          deadline: { gte: new Date() },
        },
      }),
      this.prisma.job.count({
        where: {
          OR: [{ isActive: false }, { deadline: { lt: new Date() } }],
        },
      }),
    ]);

    return {
      total,
      active,
      closed,
      draft: 0, // Can add draft status later if needed
    };
  }

  async closeJob(id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    return this.prisma.job.update({
      where: { id },
      data: { isActive: false },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async reopenJob(id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    return this.prisma.job.update({
      where: { id },
      data: { isActive: true },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}

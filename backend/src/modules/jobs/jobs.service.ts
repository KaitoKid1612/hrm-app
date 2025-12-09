import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateJobDto, UpdateJobDto, QueryJobDto } from './dto/job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, dto: CreateJobDto) {
    const { skillIds, deadline, ...jobData } = dto;

    const slug = this.generateSlug(dto.title);

    return this.prisma.job.create({
      data: {
        ...jobData,
        slug,
        companyId,
        deadline: deadline ? new Date(deadline) : undefined,
        skills: skillIds
          ? {
              create: skillIds.map((skillId) => ({
                skill: { connect: { id: skillId } },
              })),
            }
          : undefined,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            city: true,
          },
        },
        category: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  async findAll(query: QueryJobDto) {
    const { page = 1, limit = 10, keyword, ...filters } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      deadline: {
        gte: new Date(),
      },
    };

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.jobType) where.jobType = filters.jobType;
    if (filters.jobLevel) where.jobLevel = filters.jobLevel;
    if (filters.city) where.city = filters.city;
    if (filters.salaryMin) where.salaryMin = { gte: filters.salaryMin };
    if (filters.salaryMax) where.salaryMax = { lte: filters.salaryMax };
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
              city: true,
            },
          },
          category: true,
          skills: {
            include: {
              skill: true,
            },
            take: 5,
          },
          _count: {
            select: {
              applications: true,
            },
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

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        category: true,
        skills: {
          include: {
            skill: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    // Increment view count
    await this.prisma.job.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return job;
  }

  async update(id: string, userId: string, dto: UpdateJobDto) {
    const job = await this.findOne(id);

    if (job.company.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa công việc này');
    }

    const { deadline, ...updateData } = dto;

    return this.prisma.job.update({
      where: { id },
      data: {
        ...updateData,
        deadline: deadline ? new Date(deadline) : undefined,
      },
      include: {
        company: true,
        category: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const job = await this.findOne(id);

    if (job.company.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa công việc này');
    }

    await this.prisma.job.delete({
      where: { id },
    });

    return { message: 'Xóa công việc thành công' };
  }

  private generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') +
      '-' +
      Date.now()
    );
  }
}

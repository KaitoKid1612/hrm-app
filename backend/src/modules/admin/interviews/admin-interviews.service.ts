import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { AdminQueryInterviewsDto, AdminUpdateInterviewDto } from './dto/admin-interviews.dto';
import { InterviewStatus } from '@prisma/client';

@Injectable()
export class AdminInterviewsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getAllInterviews(query: AdminQueryInterviewsDto) {
    const {
      page = 1,
      limit = 20,
      status,
      applicationId,
      sortBy = 'scheduledAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (applicationId) {
      where.applicationId = applicationId;
    }

    const [interviews, total] = await Promise.all([
      this.prisma.interview.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          application: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
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
          },
        },
      }),
      this.prisma.interview.count({ where }),
    ]);

    return {
      data: interviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getInterviewById(id: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
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
        },
      },
    });

    if (!interview) {
      throw new NotFoundException('Không tìm thấy lịch phỏng vấn');
    }

    return interview;
  }

  async updateInterview(id: string, dto: AdminUpdateInterviewDto) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
    });

    if (!interview) {
      throw new NotFoundException('Không tìm thấy lịch phỏng vấn');
    }

    return this.prisma.interview.update({
      where: { id },
      data: dto,
      include: {
        application: {
          include: {
            user: true,
            job: true,
          },
        },
      },
    });
  }

  async deleteInterview(id: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
    });

    if (!interview) {
      throw new NotFoundException('Không tìm thấy lịch phỏng vấn');
    }

    await this.prisma.interview.delete({
      where: { id },
    });

    return { message: 'Xóa lịch phỏng vấn thành công' };
  }

  async changeInterviewStatus(id: string, status: string, feedback?: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
    });

    if (!interview) {
      throw new NotFoundException('Không tìm thấy lịch phỏng vấn');
    }

    const updateData: any = {
      status: status as InterviewStatus,
    };

    if (feedback) {
      updateData.feedback = feedback;
    }

    return this.prisma.interview.update({
      where: { id },
      data: updateData,
      include: {
        application: {
          include: {
            user: true,
            job: true,
          },
        },
      },
    });
  }

  async getInterviewStats() {
    const [total, scheduled, confirmed, completed, cancelled] = await Promise.all([
      this.prisma.interview.count(),
      this.prisma.interview.count({
        where: { status: InterviewStatus.SCHEDULED },
      }),
      this.prisma.interview.count({
        where: { status: InterviewStatus.CONFIRMED },
      }),
      this.prisma.interview.count({
        where: { status: InterviewStatus.COMPLETED },
      }),
      this.prisma.interview.count({
        where: { status: InterviewStatus.CANCELLED },
      }),
    ]);

    return {
      total,
      scheduled,
      confirmed,
      completed,
      cancelled,
    };
  }
}

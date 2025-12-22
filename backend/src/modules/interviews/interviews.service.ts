import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateInterviewDto, UpdateInterviewDto } from './dto/interview.dto';

@Injectable()
export class InterviewsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(userId: string, createInterviewDto: CreateInterviewDto) {
    const { applicationId, scheduledAt, duration, location, meetingLink, interviewers, notes } =
      createInterviewDto;

    // Verify application exists and user owns the company
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (!application.job.company || application.job.company.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to schedule interview for this application',
      );
    }

    const interview = await this.prisma.interview.create({
      data: {
        applicationId,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 60,
        location,
        meetingLink,
        interviewers,
        notes,
        createdBy: userId,
      },
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
              },
            },
          },
        },
      },
    });

    // Update application status to INTERVIEWED if not already
    if (application.status === 'PENDING' || application.status === 'REVIEWING') {
      await this.prisma.application.update({
        where: { id: applicationId },
        data: { status: 'INTERVIEWED' },
      });
    }

    return interview;
  }

  async findAll(userId: string, filters?: { status?: string; from?: string; to?: string }) {
    // Get user's company
    const company = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const where: any = {
      application: {
        job: {
          companyId: company.id,
        },
      },
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.from || filters?.to) {
      where.scheduledAt = {};
      if (filters.from) {
        where.scheduledAt.gte = new Date(filters.from);
      }
      if (filters.to) {
        where.scheduledAt.lte = new Date(filters.to);
      }
    }

    const interviews = await this.prisma.interview.findMany({
      where,
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
              },
            },
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    return interviews;
  }

  async findOne(userId: string, id: string) {
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
                bio: true,
                currentJobTitle: true,
                yearsOfExperience: true,
              },
            },
            job: {
              select: {
                id: true,
                title: true,
                company: true,
              },
            },
            resume: true,
          },
        },
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    // Verify user owns the company
    if (!interview.application.job.company || interview.application.job.company.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this interview');
    }

    return interview;
  }

  async update(userId: string, id: string, updateInterviewDto: UpdateInterviewDto) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            job: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    if (!interview.application.job.company || interview.application.job.company.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this interview');
    }

    const { scheduledAt, ...rest } = updateInterviewDto;

    const updatedInterview = await this.prisma.interview.update({
      where: { id },
      data: {
        ...rest,
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
      },
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
              },
            },
          },
        },
      },
    });

    return updatedInterview;
  }

  async remove(userId: string, id: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            job: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    if (!interview.application.job.company || interview.application.job.company.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this interview');
    }

    await this.prisma.interview.delete({
      where: { id },
    });

    return { message: 'Interview deleted successfully' };
  }

  async getUpcoming(userId: string, limit: number = 10) {
    const company = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const interviews = await this.prisma.interview.findMany({
      where: {
        application: {
          job: {
            companyId: company.id,
          },
        },
        scheduledAt: {
          gte: new Date(),
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
      },
      include: {
        application: {
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
              },
            },
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
      take: limit,
    });

    return interviews;
  }
}

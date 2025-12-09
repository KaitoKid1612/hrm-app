import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.application.create({
      data: {
        ...data,
        userId,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async findByJob(jobId: string) {
    return this.prisma.application.findMany({
      where: { jobId },
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
        resume: true,
      },
    });
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.application.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
      },
    });
  }
}

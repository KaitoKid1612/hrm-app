import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';

@Injectable()
export class ResumesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async upsert(userId: string, data: any) {
    const existing = await this.prisma.resume.findUnique({
      where: { userId },
    });

    if (existing) {
      return this.prisma.resume.update({
        where: { userId },
        data,
      });
    }

    return this.prisma.resume.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.resume.findUnique({
      where: { userId },
      include: {
        category: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.resume.findUnique({
      where: { id },
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
        category: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }
}

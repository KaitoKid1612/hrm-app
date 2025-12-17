import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateJobAlertDto } from './dto/create-job-alert.dto';
import { UpdateJobAlertDto } from './dto/update-job-alert.dto';

@Injectable()
export class JobAlertsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateJobAlertDto) {
    return this.prisma.jobAlert.create({
      data: {
        userId,
        name: data.name,
        keywords: data.keywords,
        categoryId: data.categoryId,
        city: data.city,
        jobType: data.jobType,
        salaryMin: data.salaryMin,
        isRemote: data.isRemote,
        frequency: data.frequency || 'DAILY',
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.jobAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const alert = await this.prisma.jobAlert.findUnique({
      where: { id },
    });

    if (!alert) {
      throw new NotFoundException('Job alert not found');
    }

    return alert;
  }

  async update(id: string, userId: string, data: UpdateJobAlertDto) {
    const alert = await this.prisma.jobAlert.findUnique({
      where: { id },
    });

    if (!alert) {
      throw new NotFoundException('Job alert not found');
    }

    if (alert.userId !== userId) {
      throw new ForbiddenException('You can only update your own job alert');
    }

    return this.prisma.jobAlert.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.keywords !== undefined && { keywords: data.keywords }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.jobType !== undefined && { jobType: data.jobType }),
        ...(data.salaryMin !== undefined && { salaryMin: data.salaryMin }),
        ...(data.isRemote !== undefined && { isRemote: data.isRemote }),
        ...(data.frequency !== undefined && { frequency: data.frequency }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  async remove(id: string, userId: string) {
    const alert = await this.prisma.jobAlert.findUnique({
      where: { id },
    });

    if (!alert) {
      throw new NotFoundException('Job alert not found');
    }

    if (alert.userId !== userId) {
      throw new ForbiddenException('You can only delete your own job alert');
    }

    return this.prisma.jobAlert.delete({
      where: { id },
    });
  }

  async toggleActive(id: string, userId: string) {
    const alert = await this.findOne(id);

    if (alert.userId !== userId) {
      throw new ForbiddenException('You can only toggle your own job alert');
    }

    return this.prisma.jobAlert.update({
      where: { id },
      data: { isActive: !alert.isActive },
    });
  }

  // Find matching jobs for an alert
  async findMatchingJobs(alertId: string) {
    const alert = await this.findOne(alertId);

    const where: any = {
      isActive: true,
      ...(alert.keywords && {
        OR: [
          { title: { contains: alert.keywords, mode: 'insensitive' } },
          { description: { contains: alert.keywords, mode: 'insensitive' } },
        ],
      }),
      ...(alert.categoryId && { categoryId: alert.categoryId }),
      ...(alert.city && { city: alert.city }),
      ...(alert.jobType && { jobType: alert.jobType }),
      ...(alert.salaryMin && { salaryMin: { gte: alert.salaryMin } }),
      ...(alert.isRemote !== null && { isRemote: alert.isRemote }),
    };

    return this.prisma.job.findMany({
      where,
      include: {
        company: {
          select: { name: true, logo: true },
        },
        category: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}

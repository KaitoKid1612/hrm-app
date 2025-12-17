import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { AddJobBenefitDto } from './dto/add-job-benefit.dto';

@Injectable()
export class BenefitsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async create(data: CreateBenefitDto) {
    const slug = this.generateSlug(data.name);

    return this.prisma.benefit.create({
      data: {
        name: data.name,
        slug,
        icon: data.icon,
        description: data.description,
        category: data.category,
      },
    });
  }

  async findAll(category?: string) {
    const where: any = {};

    if (category) {
      where.category = category;
    }

    return this.prisma.benefit.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const benefit = await this.prisma.benefit.findUnique({
      where: { id },
      include: {
        jobBenefits: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
                company: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!benefit) {
      throw new NotFoundException('Benefit not found');
    }

    return benefit;
  }

  async update(id: string, data: UpdateBenefitDto) {
    const slug = data.name ? this.generateSlug(data.name) : undefined;

    return this.prisma.benefit.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name, slug }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category !== undefined && { category: data.category }),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.benefit.delete({
      where: { id },
    });
  }

  // Job Benefits Management
  async addBenefitToJob(jobId: string, data: AddJobBenefitDto) {
    return this.prisma.jobBenefit.create({
      data: {
        jobId,
        benefitId: data.benefitId,
        details: data.details,
      },
      include: {
        benefit: true,
      },
    });
  }

  async removeBenefitFromJob(jobId: string, benefitId: string) {
    return this.prisma.jobBenefit.deleteMany({
      where: {
        jobId,
        benefitId,
      },
    });
  }

  async getJobBenefits(jobId: string) {
    return this.prisma.jobBenefit.findMany({
      where: { jobId },
      include: {
        benefit: true,
      },
    });
  }
}

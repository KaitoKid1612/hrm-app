import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompaniesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCompanyDto) {
    // Check if user already has a company
    const existingCompany = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (existingCompany) {
      throw new ConflictException('Bạn đã có hồ sơ công ty. Mỗi tài khoản chỉ được tạo 1 công ty.');
    }

    return this.prisma.company.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        jobs: {
          where: {
            isActive: true,
          },
          take: 10,
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.company.findUnique({
      where: { userId },
    });
  }

  async update(id: string, dto: UpdateCompanyDto) {
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
}

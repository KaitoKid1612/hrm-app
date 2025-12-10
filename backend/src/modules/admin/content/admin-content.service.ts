import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import {
  AdminCreateCategoryDto,
  AdminUpdateCategoryDto,
  AdminCreateSkillDto,
  AdminUpdateSkillDto,
} from './dto/admin-content.dto';

@Injectable()
export class AdminContentService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  // ============================================
  // Category Management
  // ============================================

  async getAllCategories(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              jobs: true,
              resumes: true,
            },
          },
        },
      }),
      this.prisma.category.count(),
    ]);

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createCategory(dto: AdminCreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new BadRequestException('Slug đã tồn tại');
    }

    return this.prisma.category.create({
      data: dto,
    });
  }

  async updateCategory(id: string, dto: AdminUpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      });

      if (existing) {
        throw new BadRequestException('Slug đã tồn tại');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    if (category._count.jobs > 0) {
      throw new BadRequestException(
        `Không thể xóa danh mục vì có ${category._count.jobs} công việc đang sử dụng`,
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Xóa danh mục thành công' };
  }

  // ============================================
  // Skill Management
  // ============================================

  async getAllSkills(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [skills, total] = await Promise.all([
      this.prisma.skill.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              jobs: true,
              resumes: true,
            },
          },
        },
      }),
      this.prisma.skill.count(),
    ]);

    return {
      data: skills,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createSkill(dto: AdminCreateSkillDto) {
    const existing = await this.prisma.skill.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new BadRequestException('Slug đã tồn tại');
    }

    return this.prisma.skill.create({
      data: dto,
    });
  }

  async updateSkill(id: string, dto: AdminUpdateSkillDto) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new NotFoundException('Không tìm thấy kỹ năng');
    }

    if (dto.slug && dto.slug !== skill.slug) {
      const existing = await this.prisma.skill.findUnique({
        where: { slug: dto.slug },
      });

      if (existing) {
        throw new BadRequestException('Slug đã tồn tại');
      }
    }

    return this.prisma.skill.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSkill(id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    if (!skill) {
      throw new NotFoundException('Không tìm thấy kỹ năng');
    }

    if (skill._count.jobs > 0) {
      throw new BadRequestException(
        `Không thể xóa kỹ năng vì có ${skill._count.jobs} công việc đang sử dụng`,
      );
    }

    await this.prisma.skill.delete({
      where: { id },
    });

    return { message: 'Xóa kỹ năng thành công' };
  }
}

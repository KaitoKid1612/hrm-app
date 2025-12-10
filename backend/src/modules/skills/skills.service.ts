import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { BulkCreateSkillsDto } from './dto/bulk-create-skills.dto';

@Injectable()
export class SkillsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(data: CreateSkillDto) {
    const slug = this.generateSlug(data.name);

    return this.prisma.skill.create({
      data: {
        name: data.name,
        slug,
      },
    });
  }

  async findAll(keyword?: string) {
    const where: any = {};

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    return this.prisma.skill.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.skill.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateSkillDto) {
    const slug = this.generateSlug(data.name);

    return this.prisma.skill.update({
      where: { id },
      data: { name: data.name, slug },
    });
  }

  async remove(id: string) {
    return this.prisma.skill.delete({
      where: { id },
    });
  }

  async bulkCreate(data: BulkCreateSkillsDto) {
    const skills = data.names.map((name) => ({
      name,
      slug: this.generateSlug(name),
    }));

    return this.prisma.skill.createMany({
      data: skills,
      skipDuplicates: true,
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}

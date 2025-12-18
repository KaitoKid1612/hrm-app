import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { UpsertResumeDto } from './dto/upsert-resume.dto';

@Injectable()
export class ResumesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async upsert(userId: string, dto: UpsertResumeDto) {
    const { skillIds, ...resumeData } = dto;

    const existing = await this.prisma.resume.findUnique({
      where: { userId },
    });

    if (existing) {
      // Update existing resume
      await this.prisma.resume.update({
        where: { userId },
        data: resumeData,
      });

      // Handle skills if provided
      if (skillIds && skillIds.length > 0) {
        // Delete existing skills
        await this.prisma.resumeSkill.deleteMany({
          where: { resumeId: existing.id },
        });

        // Create new skills
        await this.prisma.resumeSkill.createMany({
          data: skillIds.map((skillId) => ({
            resumeId: existing.id,
            skillId,
          })),
          skipDuplicates: true,
        });
      }

      return this.findByUserId(userId);
    }

    // Create new resume
    const newResume = await this.prisma.resume.create({
      data: {
        ...resumeData,
        userId,
      },
    });

    // Create skills if provided
    if (skillIds && skillIds.length > 0) {
      await this.prisma.resumeSkill.createMany({
        data: skillIds.map((skillId) => ({
          resumeId: newResume.id,
          skillId,
        })),
        skipDuplicates: true,
      });
    }

    return this.findByUserId(userId);
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

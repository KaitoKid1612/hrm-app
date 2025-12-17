import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';

@Injectable()
export class WorkExperiencesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateWorkExperienceDto) {
    return this.prisma.workExperience.create({
      data: {
        userId,
        company: data.company,
        position: data.position,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: data.isCurrent ?? false,
        location: data.location,
        description: data.description,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.workExperience.findMany({
      where: { userId },
      orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
    });
  }

  async findOne(id: string) {
    const experience = await this.prisma.workExperience.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!experience) {
      throw new NotFoundException('Work experience not found');
    }

    return experience;
  }

  async update(id: string, userId: string, data: UpdateWorkExperienceDto) {
    const experience = await this.prisma.workExperience.findUnique({
      where: { id },
    });

    if (!experience) {
      throw new NotFoundException('Work experience not found');
    }

    if (experience.userId !== userId) {
      throw new ForbiddenException('You can only update your own work experience');
    }

    return this.prisma.workExperience.update({
      where: { id },
      data: {
        ...(data.company && { company: data.company }),
        ...(data.position && { position: data.position }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && {
          endDate: data.endDate ? new Date(data.endDate) : null,
        }),
        ...(data.isCurrent !== undefined && { isCurrent: data.isCurrent }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
  }

  async remove(id: string, userId: string) {
    const experience = await this.prisma.workExperience.findUnique({
      where: { id },
    });

    if (!experience) {
      throw new NotFoundException('Work experience not found');
    }

    if (experience.userId !== userId) {
      throw new ForbiddenException('You can only delete your own work experience');
    }

    return this.prisma.workExperience.delete({
      where: { id },
    });
  }
}

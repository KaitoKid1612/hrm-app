import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateEducationDto) {
    return this.prisma.education.create({
      data: {
        userId,
        school: data.school,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: data.isCurrent ?? false,
        grade: data.grade,
        activities: data.activities,
        description: data.description,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.education.findMany({
      where: { userId },
      orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
    });
  }

  async findOne(id: string) {
    const education = await this.prisma.education.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    return education;
  }

  async update(id: string, userId: string, data: UpdateEducationDto) {
    const education = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    if (education.userId !== userId) {
      throw new ForbiddenException('You can only update your own education');
    }

    return this.prisma.education.update({
      where: { id },
      data: {
        ...(data.school && { school: data.school }),
        ...(data.degree && { degree: data.degree }),
        ...(data.fieldOfStudy && { fieldOfStudy: data.fieldOfStudy }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && {
          endDate: data.endDate ? new Date(data.endDate) : null,
        }),
        ...(data.isCurrent !== undefined && { isCurrent: data.isCurrent }),
        ...(data.grade !== undefined && { grade: data.grade }),
        ...(data.activities !== undefined && { activities: data.activities }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
  }

  async remove(id: string, userId: string) {
    const education = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    if (education.userId !== userId) {
      throw new ForbiddenException('You can only delete your own education');
    }

    return this.prisma.education.delete({
      where: { id },
    });
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { SaveJobDto } from './dto/save-job.dto';

@Injectable()
export class SavedJobsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async saveJob(userId: string, dto: SaveJobDto) {
    // Check if job exists
    const job = await this.prisma.job.findUnique({
      where: { id: dto.jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check if already saved
    const existing = await this.prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId: dto.jobId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Job already saved');
    }

    // Save job
    return this.prisma.savedJob.create({
      data: {
        userId,
        jobId: dto.jobId,
      },
      include: {
        job: {
          include: {
            company: {
              select: {
                name: true,
                logo: true,
                city: true,
              },
            },
            category: true,
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    });
  }

  async unsaveJob(userId: string, id: string) {
    const savedJob = await this.prisma.savedJob.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!savedJob) {
      throw new NotFoundException('Saved job not found');
    }

    await this.prisma.savedJob.delete({
      where: { id },
    });

    return { message: 'Job unsaved successfully' };
  }

  async getMySavedJobs(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [savedJobs, total] = await Promise.all([
      this.prisma.savedJob.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          job: {
            include: {
              company: {
                select: {
                  name: true,
                  logo: true,
                  city: true,
                },
              },
              category: true,
              skills: {
                include: {
                  skill: true,
                },
              },
              _count: {
                select: {
                  applications: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.savedJob.count({
        where: { userId },
      }),
    ]);

    return {
      data: savedJobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async checkSaved(userId: string, jobId: string) {
    const savedJob = await this.prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    return {
      isSaved: !!savedJob,
      savedJobId: savedJob?.id || null,
    };
  }

  async getSavedJobIds(userId: string) {
    const savedJobs = await this.prisma.savedJob.findMany({
      where: { userId },
      select: { jobId: true },
    });

    return savedJobs.map((item) => item.jobId);
  }
}

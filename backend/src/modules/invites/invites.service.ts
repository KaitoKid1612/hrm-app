import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { EmailService } from '@/modules/email/email.service';
import { ConfigService } from '@nestjs/config';
import { BulkInviteDto, InviteCandidateDto } from './dto/invite.dto';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class InvitesService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(EmailService) private readonly emailService: EmailService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async bulkInvite(userId: string, dto: BulkInviteDto) {
    // Verify job exists and user owns it
    const job = await this.verifyJobOwnership(userId, dto.jobId);

    const results = {
      total: dto.candidates.length,
      sent: 0,
      failed: 0,
      errors: [] as any[],
    };

    // Process invites
    for (const candidate of dto.candidates) {
      try {
        await this.sendInviteEmail(job, candidate, dto.customMessage);

        // Log invite to database
        await this.prisma.jobInvite.create({
          data: {
            jobId: dto.jobId,
            email: candidate.email,
            name: candidate.name,
            phone: candidate.phone,
            note: candidate.note,
            sentBy: userId,
            sentAt: new Date(),
          },
        });

        results.sent++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          email: candidate.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  async processCsvInvite(userId: string, jobId: string, file: Express.Multer.File) {
    // Verify job ownership
    await this.verifyJobOwnership(userId, jobId);

    // Parse CSV
    const candidates: InviteCandidateDto[] = [];
    const stream = Readable.from(file.buffer);

    return new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', (row: any) => {
          // Expected columns: email, name, phone (optional), note (optional)
          if (row.email && row.name) {
            candidates.push({
              email: row.email.trim(),
              name: row.name.trim(),
              phone: row.phone?.trim(),
              note: row.note?.trim(),
            });
          }
        })
        .on('end', async () => {
          try {
            const result = await this.bulkInvite(userId, {
              jobId,
              candidates,
              customMessage: undefined,
            });
            resolve(result);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (_error: any) => {
          reject(new BadRequestException('Failed to parse CSV file'));
        });
    });
  }

  async getJobInvites(userId: string, jobId: string) {
    // Verify job ownership
    await this.verifyJobOwnership(userId, jobId);

    return this.prisma.jobInvite.findMany({
      where: { jobId },
      orderBy: { sentAt: 'desc' },
      include: {
        job: {
          select: {
            title: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async getEmployerInvites(userId: string) {
    // Get user's company
    const company = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return this.prisma.jobInvite.findMany({
      where: {
        job: {
          companyId: company.id,
        },
      },
      orderBy: { sentAt: 'desc' },
      include: {
        job: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  private async verifyJobOwnership(userId: string, jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: {
          select: {
            id: true,
            userId: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check if user owns this job's company
    if (job.company.userId !== userId) {
      throw new ForbiddenException('You do not have permission to invite for this job');
    }

    return job;
  }

  private async sendInviteEmail(job: any, candidate: InviteCandidateDto, customMessage?: string) {
    const jobUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:5173')}/jobs/${job.id}`;
    const companyName = job.company.name;

    await this.emailService.sendJobInviteEmail({
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      jobTitle: job.title,
      companyName,
      jobUrl,
      customMessage,
      hrEmail: job.company.email,
    });
  }
}

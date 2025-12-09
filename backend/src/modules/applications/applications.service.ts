import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/prisma/prisma.service';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { EmailService } from '@/modules/email/email.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async create(userId: string, data: any) {
    const application = await this.prisma.application.create({
      data: {
        ...data,
        userId,
      },
      include: {
        job: {
          include: {
            company: {
              select: {
                name: true,
                userId: true,
              },
            },
          },
        },
      },
    });

    // Notify employer about new application
    const candidateInfo = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true },
    });

    if (candidateInfo && application.job.company.userId) {
      // Create notification
      await this.notificationsService.notifyNewApplication(
        application.job.company.userId,
        candidateInfo.name,
        application.job.title,
        application.id,
      );

      // Send email to employer
      const employer = await this.prisma.user.findUnique({
        where: { id: application.job.company.userId },
        select: { name: true, email: true },
      });

      if (employer) {
        this.emailService
          .sendNewApplicationEmail({
            employerName: employer.name || 'Employer',
            employerEmail: employer.email,
            jobTitle: application.job.title,
            candidateName: candidateInfo.name || 'Candidate',
            candidateEmail: candidateInfo.email,
            candidatePhone: candidateInfo.phone || undefined,
            appliedDate: new Date().toLocaleDateString('vi-VN'),
            applicationUrl: `${this.configService.get('FRONTEND_URL', 'http://localhost:5173')}/employer/applications/${application.id}`,
            coverLetter: data.coverLetter,
          })
          .catch((error) => {
            console.error('Failed to send new application email:', error);
          });
      }
    }

    return application;
  }

  async findByUser(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async findByJob(jobId: string) {
    return this.prisma.application.findMany({
      where: { jobId },
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
        resume: true,
      },
    });
  }

  async updateStatus(id: string, status: any) {
    const application = await this.prisma.application.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
      },
      include: {
        job: {
          include: {
            company: {
              select: { name: true },
            },
          },
        },
      },
    });

    // Notify candidate about status change
    if (['REVIEWING', 'INTERVIEWED', 'ACCEPTED', 'REJECTED'].includes(status)) {
      // Create notification
      await this.notificationsService.notifyApplicationStatus(
        application.userId,
        application.job.title,
        application.job.company.name,
        status,
        application.id,
      );

      // Send email to candidate
      const candidate = await this.prisma.user.findUnique({
        where: { id: application.userId },
        select: { name: true, email: true },
      });

      if (candidate) {
        this.emailService
          .sendApplicationStatusEmail({
            candidateName: candidate.name || 'Candidate',
            candidateEmail: candidate.email,
            jobTitle: application.job.title,
            companyName: application.job.company.name,
            status: status,
            appliedDate: application.createdAt.toLocaleDateString('vi-VN'),
            applicationUrl: `${this.configService.get('FRONTEND_URL', 'http://localhost:5173')}/applications/${application.id}`,
          })
          .catch((error) => {
            console.error('Failed to send application status email:', error);
          });
      }
    }

    return application;
  }
}

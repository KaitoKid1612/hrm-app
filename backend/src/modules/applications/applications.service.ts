import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/prisma/prisma.service';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { EmailService } from '@/modules/email/email.service';
import { CreateApplicationDto } from './dto/application.dto';
import { CreateApplicationNoteDto } from './dto/create-application-note.dto';
import { UpdateApplicationNoteDto } from './dto/update-application-note.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(NotificationsService) private readonly notificationsService: NotificationsService,
    @Inject(EmailService) private readonly emailService: EmailService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async create(userId: string, data: CreateApplicationDto) {
    // Check user role - only candidates can apply
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    if (user.role === 'EMPLOYER') {
      throw new ForbiddenException(
        'Nhà tuyển dụng không thể ứng tuyển vào công việc. Vui lòng sử dụng tài khoản ứng viên.',
      );
    }

    // Verify resume exists and belongs to user
    const resume = await this.prisma.resume.findFirst({
      where: {
        id: data.resumeId,
        userId,
      },
    });

    if (!resume) {
      throw new BadRequestException('CV không tồn tại. Vui lòng tạo CV trước khi ứng tuyển.');
    }

    // Check if already applied
    const existingApplication = await this.prisma.application.findFirst({
      where: {
        userId,
        jobId: data.jobId,
      },
    });

    if (existingApplication) {
      throw new BadRequestException('Bạn đã ứng tuyển công việc này rồi.');
    }

    const application = await this.prisma.application.create({
      data: {
        jobId: data.jobId,
        userId,
        resumeId: data.resumeId,
        coverLetter: data.coverLetter,
        status: 'PENDING',
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

    if (candidateInfo && application.job.company?.userId) {
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
        select: { email: true, name: true },
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

  async findByEmployer(userId: string) {
    // First, find all companies owned by this employer
    const companies = await this.prisma.company.findMany({
      where: { userId },
      select: { id: true },
    });

    if (companies.length === 0) {
      return [];
    }

    const companyIds = companies.map((c) => c.id);

    // Find all jobs from these companies
    const jobs = await this.prisma.job.findMany({
      where: { companyId: { in: companyIds } },
      select: { id: true },
    });

    if (jobs.length === 0) {
      return [];
    }

    const jobIds = jobs.map((j) => j.id);

    // Find all applications for these jobs
    return this.prisma.application.findMany({
      where: { jobId: { in: jobIds } },
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
        job: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
        resume: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(id: string, status: any, userId: string, userRole: string) {
    // Validate user permission
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Đơn ứng tuyển không tồn tại');
    }

    // Only employer who owns the job can update status
    if (userRole !== 'EMPLOYER' && userRole !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền cập nhật trạng thái đơn ứng tuyển');
    }

    // Check if employer owns this job's company
    if (userRole === 'EMPLOYER' && application.job.company?.userId !== userId) {
      throw new ForbiddenException('Bạn chỉ có thể cập nhật đơn ứng tuyển của công ty mình');
    }

    // Validate status transitions (employer can only set certain statuses)
    const allowedStatuses = [
      'PENDING',
      'REVIEWING',
      'SHORTLISTED',
      'INTERVIEWED',
      'ACCEPTED',
      'REJECTED',
    ];

    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException(
        `Trạng thái không hợp lệ. Chỉ được phép: ${allowedStatuses.join(', ')}`,
      );
    }

    // Prevent changing status of withdrawn applications
    if (application.status === 'WITHDRAWN') {
      throw new BadRequestException('Không thể thay đổi trạng thái của đơn đã rút');
    }

    // Update the application
    const updatedApplication = await this.prisma.application.update({
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
    if (['REVIEWING', 'SHORTLISTED', 'INTERVIEWED', 'ACCEPTED', 'REJECTED'].includes(status)) {
      // Create notification
      await this.notificationsService.notifyApplicationStatus(
        updatedApplication.userId,
        updatedApplication.job.title,
        updatedApplication.job.company?.name || 'Công ty',
        status,
        updatedApplication.id,
      );

      // Send email to candidate
      const candidate = await this.prisma.user.findUnique({
        where: { id: updatedApplication.userId },
        select: { name: true, email: true },
      });

      if (candidate) {
        this.emailService
          .sendApplicationStatusEmail({
            candidateName: candidate.name || 'Candidate',
            candidateEmail: candidate.email,
            jobTitle: updatedApplication.job.title,
            companyName: updatedApplication.job.company?.name || 'Công ty',
            status: status,
            appliedDate: updatedApplication.createdAt.toLocaleDateString('vi-VN'),
            applicationUrl: `${this.configService.get('FRONTEND_URL', 'http://localhost:5173')}/applications/${updatedApplication.id}`,
          })
          .catch((error) => {
            console.error('Failed to send application status email:', error);
          });
      }
    }

    return updatedApplication;
  }

  async withdrawApplication(id: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
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

    if (!application) {
      throw new NotFoundException('Đơn ứng tuyển không tồn tại');
    }

    // Only the candidate who created the application can withdraw
    if (application.userId !== userId) {
      throw new ForbiddenException('Bạn chỉ có thể rút đơn ứng tuyển của chính mình');
    }

    // Can only withdraw if status is PENDING or REVIEWING
    if (!['PENDING', 'REVIEWING'].includes(application.status)) {
      throw new BadRequestException(
        'Chỉ có thể rút đơn khi trạng thái là Đang chờ hoặc Đang xem xét',
      );
    }

    const updatedApplication = await this.prisma.application.update({
      where: { id },
      data: {
        status: 'WITHDRAWN',
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

    return updatedApplication;
  }

  // Application Notes Management
  async createNote(applicationId: string, userId: string, data: CreateApplicationNoteDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: { include: { company: true } } },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Only job owner (company) can create notes
    if (!application.job.company || application.job.company.userId !== userId) {
      throw new ForbiddenException('Only company can create notes on applications');
    }

    return this.prisma.applicationNote.create({
      data: {
        applicationId,
        createdBy: userId,
        content: data.content,
        isPrivate: data.isPrivate ?? true,
      },
    });
  }

  async getNotes(applicationId: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: { include: { company: true } } },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Only company or candidate can view notes
    const isCompany = application.job.company?.userId === userId;
    const isCandidate = application.userId === userId;

    if (!isCompany && !isCandidate) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.applicationNote.findMany({
      where: {
        applicationId,
        ...(isCandidate && { isPrivate: false }), // Candidates only see non-private notes
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateNote(noteId: string, userId: string, data: UpdateApplicationNoteDto) {
    const note = await this.prisma.applicationNote.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.createdBy !== userId) {
      throw new ForbiddenException('You can only update your own notes');
    }

    return this.prisma.applicationNote.update({
      where: { id: noteId },
      data: {
        ...(data.content && { content: data.content }),
        ...(data.isPrivate !== undefined && { isPrivate: data.isPrivate }),
      },
    });
  }

  async deleteNote(noteId: string, userId: string) {
    const note = await this.prisma.applicationNote.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.createdBy !== userId) {
      throw new ForbiddenException('You can only delete your own notes');
    }

    return this.prisma.applicationNote.delete({
      where: { id: noteId },
    });
  }
}

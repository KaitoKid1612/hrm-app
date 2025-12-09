import { Injectable, Logger, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ApplicationStatus } from '@prisma/client';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  template: string;
  context: Record<string, any>;
}

interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  isEmployer: boolean;
  dashboardUrl: string;
}

interface ApplicationStatusEmailData {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  appliedDate: string;
  applicationUrl: string;
  message?: string;
}

interface NewApplicationEmailData {
  employerName: string;
  employerEmail: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  appliedDate: string;
  applicationUrl: string;
  coverLetter?: string;
}

interface JobAlertEmailData {
  userName: string;
  userEmail: string;
  jobs: Array<{
    title: string;
    companyName: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    skills?: string[];
    url: string;
  }>;
  allJobsUrl: string;
  unsubscribeUrl: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private appName: string;
  private supportEmail: string;

  constructor(
    private readonly mailerService: MailerService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    // Initialize config values in constructor body instead of property initializer
    this.appName = configService.get<string>('APP_NAME', 'HRM Platform');
    this.supportEmail = configService.get<string>('SUPPORT_EMAIL', 'support@hrm-platform.com');
  }

  /**
   * Generic method to send email
   */
  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: {
          ...options.context,
          appName: this.appName,
          supportEmail: this.supportEmail,
        },
      });

      this.logger.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    return this.sendEmail({
      to: data.userEmail,
      subject: `Chào mừng đến với ${this.appName}!`,
      template: 'welcome',
      context: {
        userName: data.userName,
        isEmployer: data.isEmployer,
        dashboardUrl: data.dashboardUrl,
      },
    });
  }

  /**
   * Send application status update email to candidate
   */
  async sendApplicationStatusEmail(data: ApplicationStatusEmailData): Promise<boolean> {
    const statusText = this.getStatusText(data.status);

    return this.sendEmail({
      to: data.candidateEmail,
      subject: `Cập nhật trạng thái ứng tuyển: ${data.jobTitle} - ${statusText}`,
      template: 'application-status',
      context: {
        candidateName: data.candidateName,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        status: data.status,
        appliedDate: data.appliedDate,
        applicationUrl: data.applicationUrl,
        message: data.message,
      },
    });
  }

  /**
   * Send new application notification to employer
   */
  async sendNewApplicationEmail(data: NewApplicationEmailData): Promise<boolean> {
    return this.sendEmail({
      to: data.employerEmail,
      subject: `Đơn ứng tuyển mới cho vị trí: ${data.jobTitle}`,
      template: 'new-application',
      context: {
        employerName: data.employerName,
        jobTitle: data.jobTitle,
        candidateName: data.candidateName,
        candidateEmail: data.candidateEmail,
        candidatePhone: data.candidatePhone,
        appliedDate: data.appliedDate,
        applicationUrl: data.applicationUrl,
        coverLetter: data.coverLetter,
      },
    });
  }

  /**
   * Send job alert email with matching jobs
   */
  async sendJobAlertEmail(data: JobAlertEmailData): Promise<boolean> {
    if (!data.jobs || data.jobs.length === 0) {
      this.logger.warn('No jobs to send in job alert email');
      return false;
    }

    return this.sendEmail({
      to: data.userEmail,
      subject: `🔔 ${data.jobs.length} công việc mới phù hợp với bạn!`,
      template: 'job-alert',
      context: {
        userName: data.userName,
        jobs: data.jobs,
        jobCount: data.jobs.length,
        allJobsUrl: data.allJobsUrl,
        unsubscribeUrl: data.unsubscribeUrl,
      },
    });
  }

  /**
   * Send bulk emails (for newsletters, announcements, etc.)
   */
  async sendBulkEmails(
    recipients: string[],
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    // Send emails in batches to avoid overwhelming the mail server
    const batchSize = 50;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      const results = await Promise.allSettled(
        batch.map((email) =>
          this.sendEmail({
            to: email,
            subject,
            template,
            context,
          }),
        ),
      );

      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          success++;
        } else {
          failed++;
        }
      });

      // Wait a bit between batches
      if (i + batchSize < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    this.logger.log(
      `Bulk email sent: ${success} success, ${failed} failed out of ${recipients.length}`,
    );

    return { success, failed };
  }

  /**
   * Helper: Get readable status text
   */
  private getStatusText(status: ApplicationStatus): string {
    const statusMap: Record<ApplicationStatus, string> = {
      PENDING: 'Chờ xử lý',
      REVIEWING: 'Đang xem xét',
      INTERVIEWED: 'Đã phỏng vấn',
      ACCEPTED: 'Chấp nhận',
      REJECTED: 'Từ chối',
      WITHDRAWN: 'Rút đơn',
    };

    return statusMap[status] || status;
  }
}

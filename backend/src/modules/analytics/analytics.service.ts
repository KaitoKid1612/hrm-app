import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import {
  AnalyticsQueryDto,
  CompanyAnalyticsQueryDto,
  CandidateAnalyticsQueryDto,
  TimeRange,
} from './dto/analytics.dto';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /**
   * Get date range based on time range enum
   */
  private getDateRange(
    timeRange: TimeRange,
    startDate?: string,
    endDate?: string,
  ): { start: Date; end: Date } {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    if (timeRange === TimeRange.CUSTOM && startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      switch (timeRange) {
        case TimeRange.LAST_7_DAYS:
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case TimeRange.LAST_30_DAYS:
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case TimeRange.LAST_3_MONTHS:
          start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case TimeRange.LAST_6_MONTHS:
          start = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
          break;
        case TimeRange.LAST_YEAR:
          start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
    }

    return { start, end };
  }

  /**
   * Get platform-wide analytics (Admin only)
   */
  async getPlatformAnalytics(query: AnalyticsQueryDto) {
    const { start, end } = this.getDateRange(
      query.timeRange || TimeRange.LAST_30_DAYS,
      query.startDate,
      query.endDate,
    );

    const where: any = {
      createdAt: {
        gte: start,
        lte: end,
      },
    };

    const [
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      activeJobs,
      newUsers,
      newCompanies,
      newJobs,
      newApplications,
      applicationsByStatus,
      usersByRole,
      topCategories,
      topSkills,
    ] = await Promise.all([
      // Total counts
      this.prisma.user.count(),
      this.prisma.company.count(),
      this.prisma.job.count(),
      this.prisma.application.count(),

      // Active jobs
      this.prisma.job.count({
        where: {
          isActive: true,
          deadline: {
            gte: new Date(),
          },
        },
      }),

      // New counts in time range
      this.prisma.user.count({ where }),
      this.prisma.company.count({ where }),
      this.prisma.job.count({ where }),
      this.prisma.application.count({ where }),

      // Applications by status
      this.prisma.application.groupBy({
        by: ['status'],
        where,
        _count: {
          status: true,
        },
      }),

      // Users by role
      this.prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true,
        },
      }),

      // Top categories by job count
      this.prisma.category.findMany({
        take: 10,
        orderBy: {
          jobs: {
            _count: 'desc',
          },
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              jobs: true,
            },
          },
        },
      }),

      // Top skills by usage
      this.prisma.skill.findMany({
        take: 10,
        orderBy: {
          jobs: {
            _count: 'desc',
          },
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              jobs: true,
              resumes: true,
            },
          },
        },
      }),
    ]);

    // Calculate growth rates
    const previousPeriod = {
      start: new Date(start.getTime() - (end.getTime() - start.getTime())),
      end: start,
    };

    const [previousUsers, previousCompanies, previousJobs, previousApplications] =
      await Promise.all([
        this.prisma.user.count({
          where: {
            createdAt: {
              gte: previousPeriod.start,
              lte: previousPeriod.end,
            },
          },
        }),
        this.prisma.company.count({
          where: {
            createdAt: {
              gte: previousPeriod.start,
              lte: previousPeriod.end,
            },
          },
        }),
        this.prisma.job.count({
          where: {
            createdAt: {
              gte: previousPeriod.start,
              lte: previousPeriod.end,
            },
          },
        }),
        this.prisma.application.count({
          where: {
            createdAt: {
              gte: previousPeriod.start,
              lte: previousPeriod.end,
            },
          },
        }),
      ]);

    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return 100;
      return ((current - previous) / previous) * 100;
    };

    return {
      overview: {
        totalUsers,
        totalCompanies,
        totalJobs,
        totalApplications,
        activeJobs,
      },
      growth: {
        newUsers,
        newCompanies,
        newJobs,
        newApplications,
        userGrowth: calculateGrowth(newUsers, previousUsers),
        companyGrowth: calculateGrowth(newCompanies, previousCompanies),
        jobGrowth: calculateGrowth(newJobs, previousJobs),
        applicationGrowth: calculateGrowth(newApplications, previousApplications),
      },
      distributions: {
        applicationsByStatus: applicationsByStatus.map((item) => ({
          status: item.status,
          count: item._count.status,
        })),
        usersByRole: usersByRole.map((item) => ({
          role: item.role,
          count: item._count.role,
        })),
      },
      topCategories: topCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        jobCount: cat._count.jobs,
      })),
      topSkills: topSkills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        jobCount: skill._count.jobs,
        resumeCount: skill._count.resumes,
        totalUsage: skill._count.jobs + skill._count.resumes,
      })),
      timeRange: {
        start,
        end,
      },
    };
  }

  /**
   * Get company analytics (for employers)
   */
  async getCompanyAnalytics(userId: string, query: CompanyAnalyticsQueryDto) {
    // Get company for this user
    const company = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      return null;
    }

    const { start, end } = this.getDateRange(
      query.timeRange || TimeRange.LAST_30_DAYS,
      query.startDate,
      query.endDate,
    );

    const whereJobs: any = {
      companyId: company.id,
    };

    const whereApplications: any = {
      job: {
        companyId: company.id,
      },
      appliedAt: {
        gte: start,
        lte: end,
      },
    };

    if (query.jobId) {
      whereApplications.jobId = query.jobId;
    }

    const [
      totalJobs,
      activeJobs,
      totalApplications,
      newApplications,
      applicationsByStatus,
      applicationsByJob,
      jobViews,
      avgRating,
      totalReviews,
    ] = await Promise.all([
      // Job counts
      this.prisma.job.count({ where: whereJobs }),
      this.prisma.job.count({
        where: {
          ...whereJobs,
          isActive: true,
          deadline: {
            gte: new Date(),
          },
        },
      }),

      // Application counts
      this.prisma.application.count({
        where: {
          job: {
            companyId: company.id,
          },
        },
      }),
      this.prisma.application.count({ where: whereApplications }),

      // Applications by status
      this.prisma.application.groupBy({
        by: ['status'],
        where: whereApplications,
        _count: {
          status: true,
        },
      }),

      // Applications by job
      this.prisma.job.findMany({
        where: {
          companyId: company.id,
        },
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              applications: {
                where: {
                  appliedAt: {
                    gte: start,
                    lte: end,
                  },
                },
              },
            },
          },
        },
        orderBy: {
          applications: {
            _count: 'desc',
          },
        },
        take: 10,
      }),

      // Total job views
      this.prisma.job.aggregate({
        where: whereJobs,
        _sum: {
          viewCount: true,
        },
      }),

      // Company rating
      this.prisma.review.aggregate({
        where: {
          companyId: company.id,
          isApproved: true,
        },
        _avg: {
          rating: true,
        },
      }),

      // Total reviews
      this.prisma.review.count({
        where: {
          companyId: company.id,
          isApproved: true,
        },
      }),
    ]);

    // Conversion rates
    const conversionRate =
      totalApplications > 0
        ? ((applicationsByStatus.find((s) => s.status === ApplicationStatus.ACCEPTED)?._count
            .status || 0) /
            totalApplications) *
          100
        : 0;

    return {
      company: {
        id: company.id,
        name: company.name,
        logo: company.logo,
        averageRating: avgRating._avg.rating || 0,
        totalReviews,
      },
      overview: {
        totalJobs,
        activeJobs,
        totalApplications,
        newApplications,
        totalViews: jobViews._sum.viewCount || 0,
      },
      metrics: {
        conversionRate: conversionRate.toFixed(2),
        avgApplicationsPerJob: totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : 0,
      },
      distributions: {
        applicationsByStatus: applicationsByStatus.map((item) => ({
          status: item.status,
          count: item._count.status,
        })),
      },
      topJobs: applicationsByJob.map((job) => ({
        id: job.id,
        title: job.title,
        applicationCount: job._count.applications,
      })),
      timeRange: {
        start,
        end,
      },
    };
  }

  /**
   * Get candidate analytics (for job seekers)
   */
  async getCandidateAnalytics(userId: string, query: CandidateAnalyticsQueryDto) {
    const { start, end } = this.getDateRange(
      query.timeRange || TimeRange.LAST_30_DAYS,
      query.startDate,
      query.endDate,
    );

    const whereApplications: any = {
      userId,
      appliedAt: {
        gte: start,
        lte: end,
      },
    };

    const [
      totalApplications,
      newApplications,
      applicationsByStatus,
      recentApplications,
      savedJobsCount,
      profileViews,
    ] = await Promise.all([
      // Application counts
      this.prisma.application.count({
        where: {
          userId,
        },
      }),
      this.prisma.application.count({ where: whereApplications }),

      // Applications by status
      this.prisma.application.groupBy({
        by: ['status'],
        where: whereApplications,
        _count: {
          status: true,
        },
      }),

      // Recent applications with job details
      this.prisma.application.findMany({
        where: whereApplications,
        take: 10,
        orderBy: {
          appliedAt: 'desc',
        },
        include: {
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
        },
      }),

      // Saved jobs count
      this.prisma.savedJob.count({
        where: {
          userId,
        },
      }),

      // Profile views (if resume is public)
      this.prisma.resume.findUnique({
        where: { userId },
        select: {
          isPublic: true,
        },
      }),
    ]);

    // Success rate
    const acceptedCount =
      applicationsByStatus.find((s) => s.status === ApplicationStatus.ACCEPTED)?._count.status || 0;
    const successRate = totalApplications > 0 ? (acceptedCount / totalApplications) * 100 : 0;

    // Response rate (not pending)
    const respondedCount = applicationsByStatus
      .filter((s) => s.status !== ApplicationStatus.PENDING)
      .reduce((sum, item) => sum + item._count.status, 0);
    const responseRate = newApplications > 0 ? (respondedCount / newApplications) * 100 : 0;

    return {
      overview: {
        totalApplications,
        newApplications,
        savedJobsCount,
        profileIsPublic: profileViews?.isPublic || false,
      },
      metrics: {
        successRate: successRate.toFixed(2),
        responseRate: responseRate.toFixed(2),
        acceptedCount,
        rejectedCount:
          applicationsByStatus.find((s) => s.status === ApplicationStatus.REJECTED)?._count
            .status || 0,
        pendingCount:
          applicationsByStatus.find((s) => s.status === ApplicationStatus.PENDING)?._count.status ||
          0,
      },
      distributions: {
        applicationsByStatus: applicationsByStatus.map((item) => ({
          status: item.status,
          count: item._count.status,
        })),
      },
      recentApplications: recentApplications.map((app) => ({
        id: app.id,
        status: app.status,
        appliedAt: app.appliedAt,
        job: {
          id: app.job.id,
          title: app.job.title,
          company: app.job.company,
        },
      })),
      timeRange: {
        start,
        end,
      },
    };
  }

  /**
   * Get job analytics (for specific job)
   */
  async getJobAnalytics(userId: string, jobId: string) {
    // Verify job belongs to user's company
    const job = await this.prisma.job.findFirst({
      where: {
        id: jobId,
        company: {
          userId,
        },
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!job) {
      return null;
    }

    const [totalApplications, applicationsByStatus, applicationTimeline] = await Promise.all([
      // Total applications
      this.prisma.application.count({
        where: { jobId },
      }),

      // Applications by status
      this.prisma.application.groupBy({
        by: ['status'],
        where: { jobId },
        _count: {
          status: true,
        },
      }),

      // Applications over time (last 30 days, grouped by day)
      this.prisma.$queryRaw`
        SELECT 
          DATE(applied_at) as date,
          COUNT(*) as count
        FROM applications
        WHERE job_id = ${jobId}
          AND applied_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(applied_at)
        ORDER BY date ASC
      `,
    ]);

    return {
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        category: job.category,
        viewCount: job.viewCount,
        isActive: job.isActive,
        deadline: job.deadline,
        createdAt: job.createdAt,
      },
      overview: {
        totalApplications,
        viewCount: job.viewCount,
        viewToApplicationRate:
          job.viewCount > 0 ? ((totalApplications / job.viewCount) * 100).toFixed(2) : 0,
      },
      distributions: {
        applicationsByStatus: applicationsByStatus.map((item) => ({
          status: item.status,
          count: item._count.status,
        })),
      },
      timeline: applicationTimeline,
    };
  }
}

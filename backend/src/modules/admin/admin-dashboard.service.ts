import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { AdminDateRangeDto } from './dto/dashboard.dto';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(dateRange?: AdminDateRangeDto) {
    const startDate = dateRange?.startDate
      ? new Date(dateRange.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = dateRange?.endDate ? new Date(dateRange.endDate) : new Date();

    const [
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      newUsersCount,
      newCompaniesCount,
      newJobsCount,
      newApplicationsCount,
      usersByRole,
      activeJobs,
      expiredJobs,
      verifiedCompanies,
      pendingCompanies,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.company.count(),
      this.prisma.job.count(),
      this.prisma.application.count(),
      this.prisma.user.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.company.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.job.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.application.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
      this.prisma.job.count({
        where: {
          isActive: true,
          deadline: { gte: new Date() },
        },
      }),
      this.prisma.job.count({
        where: {
          OR: [{ isActive: false }, { deadline: { lt: new Date() } }],
        },
      }),
      this.prisma.company.count({
        where: { isVerified: true },
      }),
      this.prisma.company.count({
        where: { isVerified: false },
      }),
    ]);

    return {
      overview: {
        totalUsers,
        totalCompanies,
        totalJobs,
        totalApplications,
      },
      newCounts: {
        users: newUsersCount,
        companies: newCompaniesCount,
        jobs: newJobsCount,
        applications: newApplicationsCount,
      },
      usersByRole: usersByRole.map((item) => ({
        role: item.role,
        count: item._count.role,
      })),
      jobs: {
        active: activeJobs,
        expired: expiredJobs,
      },
      companies: {
        verified: verifiedCompanies,
        pending: pendingCompanies,
      },
      period: {
        startDate,
        endDate,
      },
    };
  }

  async getAnalytics(dateRange?: AdminDateRangeDto) {
    const startDate = dateRange?.startDate
      ? new Date(dateRange.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = dateRange?.endDate ? new Date(dateRange.endDate) : new Date();

    const [dailyStats, applicationsByStatus, jobsByCategory, jobsByLocation] = await Promise.all([
      this.getDailyStats(startDate, endDate),
      this.prisma.application.groupBy({
        by: ['status'],
        _count: true,
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.job.groupBy({
        by: ['categoryId'],
        _count: true,
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
        orderBy: {
          _count: {
            categoryId: 'desc',
          },
        },
        take: 10,
      }),
      this.prisma.job.groupBy({
        by: ['city'],
        _count: true,
        where: {
          createdAt: { gte: startDate, lte: endDate },
          city: { not: null },
        },
        orderBy: {
          _count: {
            city: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    const categoryIds = jobsByCategory.map((s) => s.categoryId).filter(Boolean);
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds as string[] } },
      select: { id: true, name: true },
    });

    const categoriesWithCount = jobsByCategory.map((stat) => {
      const category = categories.find((c) => c.id === stat.categoryId);
      return {
        categoryId: stat.categoryId,
        categoryName: category?.name || 'Unknown',
        count: stat._count,
      };
    });

    return {
      period: { startDate, endDate },
      dailyStats,
      applicationsByStatus: applicationsByStatus.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      jobsByCategory: categoriesWithCount,
      jobsByLocation: jobsByLocation.map((l) => ({
        city: l.city,
        count: l._count,
      })),
    };
  }

  private async getDailyStats(startDate: Date, endDate: Date) {
    const days: any[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const [users, companies, jobs, applications] = await Promise.all([
        this.prisma.user.count({
          where: {
            createdAt: { gte: currentDate, lt: nextDate },
          },
        }),
        this.prisma.company.count({
          where: {
            createdAt: { gte: currentDate, lt: nextDate },
          },
        }),
        this.prisma.job.count({
          where: {
            createdAt: { gte: currentDate, lt: nextDate },
          },
        }),
        this.prisma.application.count({
          where: {
            createdAt: { gte: currentDate, lt: nextDate },
          },
        }),
      ]);

      days.push({
        date: currentDate.toISOString().split('T')[0],
        users,
        companies,
        jobs,
        applications,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }
}

import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';

@Injectable()
export class CompanyFollowersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async follow(userId: string, companyId: string) {
    const existing = await this.prisma.companyFollower.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Already following this company');
    }

    return this.prisma.companyFollower.create({
      data: {
        userId,
        companyId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            industry: true,
          },
        },
      },
    });
  }

  async unfollow(userId: string, companyId: string) {
    return this.prisma.companyFollower.deleteMany({
      where: {
        userId,
        companyId,
      },
    });
  }

  async getFollowedCompanies(userId: string) {
    return this.prisma.companyFollower.findMany({
      where: { userId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            industry: true,
            city: true,
            size: true,
            jobs: {
              where: { isActive: true },
              select: { id: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCompanyFollowers(companyId: string) {
    return this.prisma.companyFollower.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            currentJobTitle: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async isFollowing(userId: string, companyId: string): Promise<boolean> {
    const follower = await this.prisma.companyFollower.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    return !!follower;
  }

  async getFollowerCount(companyId: string): Promise<number> {
    return this.prisma.companyFollower.count({
      where: { companyId },
    });
  }
}

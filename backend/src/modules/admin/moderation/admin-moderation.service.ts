import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { AdminQueryReviewsDto } from './dto/admin-moderation.dto';

@Injectable()
export class AdminModerationService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getAllReviews(query: AdminQueryReviewsDto) {
    const {
      page = 1,
      limit = 20,
      companyId,
      isApproved,
      isVerified,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (companyId) {
      where.companyId = companyId;
    }

    if (typeof isApproved === 'boolean') {
      where.isApproved = isApproved;
    }

    if (typeof isVerified === 'boolean') {
      where.isVerified = isVerified;
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteReview(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    await this.prisma.review.delete({
      where: { id },
    });

    return { message: 'Xóa đánh giá thành công' };
  }

  async approveReview(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    return this.prisma.review.update({
      where: { id },
      data: { isApproved: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async rejectReview(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    return this.prisma.review.update({
      where: { id },
      data: { isApproved: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async verifyReview(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    return this.prisma.review.update({
      where: { id },
      data: { isVerified: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getReviewStats() {
    const [total, approved, rejected, verified, pending] = await Promise.all([
      this.prisma.review.count(),
      this.prisma.review.count({
        where: { isApproved: true },
      }),
      this.prisma.review.count({
        where: { isApproved: false },
      }),
      this.prisma.review.count({
        where: { isVerified: true },
      }),
      this.prisma.review.count({
        where: { isApproved: true, isVerified: false },
      }),
    ]);

    return {
      total,
      approved,
      rejected,
      verified,
      pending,
    };
  }
}

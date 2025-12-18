import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import {
  CreateReviewDto,
  UpdateReviewDto,
  QueryReviewsDto,
  ModerateReviewDto,
} from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  // ============================================
  // Public Review Operations
  // ============================================

  /**
   * Create a new review
   */
  async create(userId: string, dto: CreateReviewDto) {
    // Check if user has already reviewed this company
    const existingReview = await this.prisma.review.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId: dto.companyId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException('Bạn đã đánh giá công ty này rồi');
    }

    // Verify company exists
    const company = await this.prisma.company.findUnique({
      where: { id: dto.companyId },
    });

    if (!company) {
      throw new NotFoundException('Không tìm thấy công ty');
    }

    // Check if user worked at this company (optional verification)
    const hasWorkedThere = await this.prisma.application.findFirst({
      where: {
        userId,
        job: {
          companyId: dto.companyId,
        },
        status: 'ACCEPTED',
      },
    });

    // Create review
    const review = await this.prisma.review.create({
      data: {
        ...dto,
        userId,
        isVerified: !!hasWorkedThere, // Auto-verify if worked there
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
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
    });

    // Update company rating aggregation
    await this.updateCompanyRating(dto.companyId);

    return this.sanitizeReview(review);
  }

  /**
   * Get all reviews with filters
   */
  async findAll(query: QueryReviewsDto) {
    const {
      page = 1,
      limit = 10,
      companyId,
      minRating,
      isVerified,
      isApproved = true, // Only show approved by default
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Ensure numeric values
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isApproved,
    };

    if (companyId) where.companyId = companyId;
    if (minRating) where.rating = { gte: minRating };
    if (isVerified !== undefined) where.isVerified = isVerified;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
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
      data: reviews.map((review) => this.sanitizeReview(review)),
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get reviews for a specific company
   */
  async findByCompany(companyId: string, query: QueryReviewsDto) {
    return this.findAll({ ...query, companyId });
  }

  /**
   * Get review by ID
   */
  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
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
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    return this.sanitizeReview(review);
  }

  /**
   * Get user's own reviews
   */
  async findMyReviews(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    return reviews;
  }

  /**
   * Update review
   */
  async update(id: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa đánh giá này');
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: dto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
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
    });

    // Update company rating if rating changed
    if (dto.rating) {
      await this.updateCompanyRating(review.companyId);
    }

    return this.sanitizeReview(updated);
  }

  /**
   * Delete review
   */
  async delete(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này');
    }

    await this.prisma.review.delete({
      where: { id },
    });

    // Update company rating
    await this.updateCompanyRating(review.companyId);

    return { message: 'Xóa đánh giá thành công' };
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    return this.prisma.review.update({
      where: { id },
      data: {
        helpfulCount: {
          increment: 1,
        },
      },
    });
  }

  // ============================================
  // Company Rating Aggregation
  // ============================================

  /**
   * Get company rating statistics
   */
  async getCompanyRating(companyId: string) {
    const [reviews, ratingDistribution] = await Promise.all([
      this.prisma.review.aggregate({
        where: {
          companyId,
          isApproved: true,
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      }),

      this.prisma.review.groupBy({
        by: ['rating'],
        where: {
          companyId,
          isApproved: true,
        },
        _count: {
          rating: true,
        },
      }),
    ]);

    const distribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratingDistribution.forEach((item) => {
      if (item.rating >= 1 && item.rating <= 5) {
        distribution[item.rating] = item._count.rating;
      }
    });

    return {
      companyId,
      averageRating: reviews._avg.rating || 0,
      totalReviews: reviews._count.rating,
      ratingDistribution: distribution,
    };
  }

  /**
   * Update company rating cache (can be called periodically)
   */
  private async updateCompanyRating(companyId: string) {
    const stats = await this.getCompanyRating(companyId);

    // You can store this in company table or cache
    // For now, it's calculated on-demand
    return stats;
  }

  // ============================================
  // Admin Moderation
  // ============================================

  /**
   * Moderate review (admin only)
   */
  async moderate(id: string, dto: ModerateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    return this.prisma.review.update({
      where: { id },
      data: {
        isApproved: dto.isApproved,
        isVerified: dto.isVerified ?? review.isVerified,
      },
    });
  }

  /**
   * Get pending reviews (admin only)
   */
  async getPendingReviews() {
    return this.prisma.review.findMany({
      where: {
        isApproved: false,
      },
      orderBy: { createdAt: 'desc' },
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
            logo: true,
          },
        },
      },
    });
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Sanitize review (hide user info if anonymous)
   */
  private sanitizeReview(review: any) {
    if (review.isAnonymous) {
      return {
        ...review,
        user: {
          id: null,
          name: 'Người dùng ẩn danh',
          avatar: null,
        },
      };
    }
    return review;
  }
}

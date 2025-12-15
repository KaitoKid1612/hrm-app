import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateJobDto, UpdateJobDto, QueryJobDto } from './dto/job.dto';

@Injectable()
export class JobsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async createJobByUserId(userId: string, dto: CreateJobDto) {
    // Check if user has a company
    const company = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      throw new ForbiddenException(
        'Bạn cần tạo hồ sơ công ty trước khi đăng tin tuyển dụng. Vui lòng truy cập trang Quản lý công ty để tạo hồ sơ.'
      );
    }

    return this.create(company.id, dto);
  }

  async create(companyId: string, dto: CreateJobDto) {
    const { skillIds, deadline, ...jobData } = dto;

    // If no categoryId provided, get or create a default category
    let categoryId = jobData.categoryId;
    if (!categoryId) {
      let defaultCategory = await this.prisma.category.findFirst({
        where: { name: 'Khác' },
      });

      if (!defaultCategory) {
        defaultCategory = await this.prisma.category.create({
          data: {
            name: 'Khác',
            slug: 'khac',
            description: 'Danh mục chung',
            isActive: true,
          },
        });
      }

      categoryId = defaultCategory.id;
    }

    // Transform array fields to strings if needed
    const requirements = Array.isArray(jobData.requirements)
      ? jobData.requirements.join('\n')
      : jobData.requirements;
    
    const benefits = jobData.benefits
      ? Array.isArray(jobData.benefits)
        ? jobData.benefits.join('\n')
        : jobData.benefits
      : undefined;

    const slug = this.generateSlug(dto.title);

    // Map only valid schema fields
    const jobCreateData: any = {
      title: dto.title,
      description: dto.description,
      requirements,
      benefits,
      categoryId,
      slug,
      companyId,
      jobType: jobData.jobType,
      jobLevel: jobData.jobLevel,
      salaryMin: jobData.salaryMin,
      salaryMax: jobData.salaryMax,
      salaryNegotiate: jobData.salaryNegotiate,
      positions: jobData.positions,
      experience: jobData.experience,
      address: jobData.address,
      city: jobData.city,
      deadline: deadline ? new Date(deadline) : undefined,
    };

    // Add skills if provided
    if (skillIds) {
      jobCreateData.skills = {
        create: skillIds.map((skillId) => ({
          skill: { connect: { id: skillId } },
        })),
      };
    }

    return this.prisma.job.create({
      data: jobCreateData,
      include: {
        company: {
          select: {
            id: true,
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
    });
  }

  async findAll(query: QueryJobDto) {
    const {
      page = 1,
      limit = 10,
      keyword,
      skills,
      cities,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      postedAfter,
      postedBefore,
      deadlineAfter,
      deadlineBefore,
      ...filters
    } = query;

    // Ensure page and limit are numbers
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isActive: true,
      deadline: {
        gte: new Date(),
      },
    };

    // Category filter
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    // Job type, level, experience filters
    if (filters.jobType) where.jobType = filters.jobType;
    if (filters.jobLevel) where.jobLevel = filters.jobLevel;
    if (filters.experience) where.experience = filters.experience;

    // Location filters
    if (filters.city) {
      where.city = filters.city;
    } else if (cities && cities.length > 0) {
      where.city = { in: cities };
    }

    // Salary filters
    if (filters.salaryMin || filters.salaryMax) {
      where.AND = where.AND || [];

      if (filters.salaryMin) {
        const salaryMinNum = Number(filters.salaryMin);
        where.AND.push({
          OR: [{ salaryMin: { gte: salaryMinNum } }, { salaryNegotiate: true }],
        });
      }

      if (filters.salaryMax) {
        const salaryMaxNum = Number(filters.salaryMax);
        where.AND.push({
          OR: [{ salaryMax: { lte: salaryMaxNum } }, { salaryNegotiate: true }],
        });
      }
    }

    // Skills filter (jobs must have at least one of the specified skills)
    if (skills) {
      const skillIds = skills.split(',').map((id) => id.trim());
      where.skills = {
        some: {
          skillId: { in: skillIds },
        },
      };
    }

    // Company filter
    if (filters.companyId) {
      where.companyId = filters.companyId;
    }

    // Hot/Featured filters
    if (filters.isHot !== undefined) {
      where.isHot = filters.isHot;
    }
    if (filters.isUrgent !== undefined) {
      where.isUrgent = filters.isUrgent;
    }

    // Date range filters
    if (postedAfter || postedBefore) {
      where.createdAt = {};
      if (postedAfter) where.createdAt.gte = new Date(postedAfter);
      if (postedBefore) where.createdAt.lte = new Date(postedBefore);
    }

    if (deadlineAfter || deadlineBefore) {
      where.deadline = where.deadline || {};
      if (deadlineAfter) where.deadline.gte = new Date(deadlineAfter);
      if (deadlineBefore) where.deadline.lte = new Date(deadlineBefore);
    }

    // Full-text search (keyword)
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
        { requirements: { contains: keyword, mode: 'insensitive' } },
        {
          company: {
            name: { contains: keyword, mode: 'insensitive' },
          },
        },
      ];
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'salary') {
      orderBy = [{ salaryMax: sortOrder }, { salaryMin: sortOrder }];
    } else if (sortBy === 'deadline') {
      orderBy = { deadline: sortOrder };
    } else if (sortBy === 'views') {
      orderBy = { viewCount: sortOrder };
    } else if (sortBy === 'applications') {
      // Sort by application count (will use raw count from _count)
      orderBy = { createdAt: sortOrder }; // Fallback, will sort in memory
    } else {
      orderBy = { [sortBy]: sortOrder };
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          company: {
            select: {
              id: true,
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
            take: 5,
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    // If sorting by applications, do it in memory
    let sortedJobs = jobs;
    if (sortBy === 'applications') {
      sortedJobs = jobs.sort((a, b) => {
        const countA = a._count.applications;
        const countB = b._count.applications;
        return sortOrder === 'asc' ? countA - countB : countB - countA;
      });
    }

    return {
      data: sortedJobs,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async findJobsByUserId(userId: string, query: QueryJobDto = {}) {
    // Get company of the user
    const company = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      return {
        data: [],
        meta: {
          total: 0,
        },
      };
    }

    const { sortBy = 'createdAt', sortOrder = 'desc', ...filters } = query;

    const where: any = {
      companyId: company.id,
    };

    // Add status filter
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive === true;
    }

    // Add other filters if provided
    if (query.keyword) {
      where.OR = [
        { title: { contains: query.keyword, mode: 'insensitive' } },
        { description: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = { [sortBy]: sortOrder };

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        orderBy,
        include: {
          company: {
            select: {
              id: true,
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
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data: jobs,
      meta: {
        total,
      },
    };
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
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
    });

    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    // Increment view count
    await this.prisma.job.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return job;
  }

  async update(id: string, userId: string, dto: UpdateJobDto) {
    const job = await this.findOne(id);

    if (!job.company || job.company.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa công việc này');
    }

    const { deadline, ...updateData } = dto;

    return this.prisma.job.update({
      where: { id },
      data: {
        ...updateData,
        deadline: deadline ? new Date(deadline) : undefined,
      },
      include: {
        company: true,
        category: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const job = await this.findOne(id);

    if (!job.company || job.company.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa công việc này');
    }

    await this.prisma.job.delete({
      where: { id },
    });

    return { message: 'Xóa công việc thành công' };
  }

  private generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') +
      '-' +
      Date.now()
    );
  }

  /**
   * Get search suggestions (autocomplete)
   */
  async getSearchSuggestions(query: string, limit = 10) {
    if (!query || query.length < 2) {
      return [];
    }

    const [jobTitles, companyNames, skills] = await Promise.all([
      // Job titles
      this.prisma.job.findMany({
        where: {
          isActive: true,
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: { title: true },
        distinct: ['title'],
        take: limit,
      }),

      // Company names
      this.prisma.company.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: { name: true },
        take: 5,
      }),

      // Skills
      this.prisma.skill.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: { id: true, name: true },
        take: 5,
      }),
    ]);

    return {
      jobs: jobTitles.map((j) => j.title),
      companies: companyNames.map((c) => c.name),
      skills: skills.map((s) => ({ id: s.id, name: s.name })),
    };
  }

  /**
   * Get similar jobs based on current job
   */
  async getSimilarJobs(jobId: string, limit = 5) {
    const currentJob = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        skills: {
          select: { skillId: true },
        },
      },
    });

    if (!currentJob) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    const skillIds = currentJob.skills.map((s) => s.skillId);

    // Find jobs with similar skills, category, or level
    const similarJobs = await this.prisma.job.findMany({
      where: {
        id: { not: jobId },
        isActive: true,
        deadline: { gte: new Date() },
        OR: [
          { categoryId: currentJob.categoryId },
          { jobLevel: currentJob.jobLevel },
          {
            skills: {
              some: {
                skillId: { in: skillIds },
              },
            },
          },
        ],
      },
      include: {
        company: {
          select: {
            id: true,
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
          take: 3,
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      take: limit * 2, // Get more to calculate relevance
    });

    // Calculate relevance score and sort
    const scoredJobs = similarJobs.map((job) => {
      let score = 0;

      // Same category: +3 points
      if (job.categoryId === currentJob.categoryId) score += 3;

      // Same level: +2 points
      if (job.jobLevel === currentJob.jobLevel) score += 2;

      // Same city: +1 point
      if (job.city === currentJob.city) score += 1;

      // Matching skills: +1 point per skill
      const jobSkillIds = job.skills.map((s) => s.skillId);
      const matchingSkills = skillIds.filter((id) => jobSkillIds.includes(id));
      score += matchingSkills.length;

      return { ...job, relevanceScore: score };
    });

    // Sort by relevance score and return top results
    return scoredJobs.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, limit);
  }

  /**
   * Get popular/trending jobs
   */
  async getTrendingJobs(limit = 10) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.prisma.job.findMany({
      where: {
        isActive: true,
        deadline: { gte: new Date() },
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: [{ viewCount: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      include: {
        company: {
          select: {
            id: true,
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
          take: 3,
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });
  }

  /**
   * Get job statistics for filters
   */
  async getJobStatistics() {
    const [totalJobs, byCategory, byCity, byJobType, byJobLevel, salaryRanges] = await Promise.all([
      // Total active jobs
      this.prisma.job.count({
        where: {
          isActive: true,
          deadline: { gte: new Date() },
        },
      }),

      // Jobs by category
      this.prisma.job.groupBy({
        by: ['categoryId'],
        where: {
          isActive: true,
          deadline: { gte: new Date() },
        },
        _count: true,
      }),

      // Jobs by city
      this.prisma.job.groupBy({
        by: ['city'],
        where: {
          isActive: true,
          deadline: { gte: new Date() },
          city: { not: null },
        },
        _count: true,
        orderBy: {
          _count: {
            city: 'desc',
          },
        },
        take: 10,
      }),

      // Jobs by type
      this.prisma.job.groupBy({
        by: ['jobType'],
        where: {
          isActive: true,
          deadline: { gte: new Date() },
        },
        _count: true,
      }),

      // Jobs by level
      this.prisma.job.groupBy({
        by: ['jobLevel'],
        where: {
          isActive: true,
          deadline: { gte: new Date() },
        },
        _count: true,
      }),

      // Salary ranges
      this.prisma.job.aggregate({
        where: {
          isActive: true,
          deadline: { gte: new Date() },
          salaryMin: { not: null },
        },
        _min: { salaryMin: true },
        _max: { salaryMax: true },
        _avg: { salaryMin: true, salaryMax: true },
      }),
    ]);

    // Enrich category data with names
    const categories = await this.prisma.category.findMany({
      where: {
        id: { in: byCategory.map((c) => c.categoryId) },
      },
      select: { id: true, name: true },
    });

    const categoriesWithCount = byCategory.map((stat) => {
      const category = categories.find((c) => c.id === stat.categoryId);
      return {
        id: stat.categoryId,
        name: category?.name || 'Unknown',
        count: stat._count,
      };
    });

    return {
      total: totalJobs,
      byCategory: categoriesWithCount,
      byCity: byCity.map((c) => ({ city: c.city, count: c._count })),
      byType: byJobType.map((t) => ({ type: t.jobType, count: t._count })),
      byLevel: byJobLevel.map((l) => ({ level: l.jobLevel, count: l._count })),
      salaryRange: {
        min: salaryRanges._min.salaryMin || 0,
        max: salaryRanges._max.salaryMax || 0,
        avgMin: Math.round(salaryRanges._avg.salaryMin || 0),
        avgMax: Math.round(salaryRanges._avg.salaryMax || 0),
      },
    };
  }
}

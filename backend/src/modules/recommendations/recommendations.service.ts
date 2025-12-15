import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import {
  JobRecommendationQueryDto,
  CandidateRecommendationQueryDto,
  MatchScoreDto,
} from './dto/recommendation.dto';
import { ExperienceLevel, JobLevel } from '@prisma/client';

@Injectable()
export class RecommendationsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /**
   * Calculate match score between a job and a resume
   */
  private calculateMatchScore(job: any, resume: any): number {
    let score = 0;
    let maxScore = 0;

    // 1. Category match (20 points)
    maxScore += 20;
    if (job.categoryId === resume.categoryId) {
      score += 20;
    }

    // 2. Skills match (30 points)
    maxScore += 30;
    if (job.skills && job.skills.length > 0 && resume.skills && resume.skills.length > 0) {
      const jobSkillIds = new Set(job.skills.map((s: any) => s.skillId));
      const resumeSkillIds = new Set(resume.skills.map((s: any) => s.skillId));

      const matchingSkills = [...resumeSkillIds].filter((id) => jobSkillIds.has(id));

      const skillMatchPercentage = matchingSkills.length / jobSkillIds.size;
      score += skillMatchPercentage * 30;
    }

    // 3. Experience level match (20 points)
    maxScore += 20;
    if (job.experience && resume.experience) {
      const experienceLevels = [
        ExperienceLevel.NO_EXPERIENCE,
        ExperienceLevel.UNDER_1_YEAR,
        ExperienceLevel.ONE_TO_THREE_YEARS,
        ExperienceLevel.THREE_TO_FIVE_YEARS,
        ExperienceLevel.FIVE_TO_TEN_YEARS,
        ExperienceLevel.OVER_TEN_YEARS,
      ];

      const jobExpIndex = experienceLevels.indexOf(job.experience);
      const resumeExpIndex = experienceLevels.indexOf(resume.experience);

      // Perfect match or resume experience is higher
      if (resumeExpIndex >= jobExpIndex) {
        score += 20;
      } else {
        // Partial score if close
        const diff = Math.abs(jobExpIndex - resumeExpIndex);
        score += Math.max(0, 20 - diff * 5);
      }
    }

    // 4. Location match (15 points)
    maxScore += 15;
    if (job.city && resume.city) {
      if (job.city.toLowerCase() === resume.city.toLowerCase()) {
        score += 15;
      } else if (
        job.country &&
        resume.country &&
        job.country.toLowerCase() === resume.country.toLowerCase()
      ) {
        score += 7.5; // Same country, different city
      }
    }

    // 5. Job level alignment (15 points)
    maxScore += 15;
    if (job.jobLevel) {
      const levelScores: Record<JobLevel, number> = {
        [JobLevel.INTERN]: 0,
        [JobLevel.FRESHER]: 1,
        [JobLevel.JUNIOR]: 2,
        [JobLevel.MIDDLE]: 3,
        [JobLevel.SENIOR]: 4,
        [JobLevel.LEADER]: 5,
        [JobLevel.MANAGER]: 6,
        [JobLevel.ENTRY_LEVEL]: 1,
        [JobLevel.EXPERIENCED]: 3,
        [JobLevel.NOT_REQUIRED]: 0,
      };

      const jobLevelScore = (levelScores as any)[job.jobLevel] ?? 0;
      const resumeExpScore =
        resume.experience === ExperienceLevel.NO_EXPERIENCE
          ? 0
          : resume.experience === ExperienceLevel.UNDER_1_YEAR
            ? 1
            : resume.experience === ExperienceLevel.ONE_TO_THREE_YEARS
              ? 2
              : resume.experience === ExperienceLevel.THREE_TO_FIVE_YEARS
                ? 3
                : resume.experience === ExperienceLevel.FIVE_TO_TEN_YEARS
                  ? 4
                  : 5;

      const levelDiff = Math.abs(jobLevelScore - resumeExpScore);
      score += Math.max(0, 15 - levelDiff * 3);
    }

    // Normalize to 0-100
    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  }

  /**
   * Get job recommendations for a candidate
   */
  async getJobRecommendations(userId: string, query: JobRecommendationQueryDto) {
    const { limit = 10, categoryId, minMatchScore = 50 } = query;

    // Get user's resume
    const resume = await this.prisma.resume.findUnique({
      where: { userId },
      include: {
        skills: true,
        category: true,
      },
    });

    if (!resume) {
      return {
        data: [],
        message: 'No resume found. Please create a resume to get recommendations.',
      };
    }

    // Build job query
    const where: any = {
      isActive: true,
      deadline: {
        gte: new Date(),
      },
    };

    if (categoryId) {
      where.categoryId = categoryId;
    } else if (resume.categoryId) {
      // Prefer jobs in the same category
      where.categoryId = resume.categoryId;
    }

    // Get jobs with related data
    const jobs = await this.prisma.job.findMany({
      where,
      take: limit * 3, // Get more to filter by match score
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            city: true,
            country: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
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

    // Calculate match scores and filter
    const jobsWithScores = jobs
      .map((job) => {
        const matchScore = this.calculateMatchScore(job, resume);
        return {
          ...job,
          matchScore: Math.round(matchScore),
          matchReasons: this.getMatchReasons(job, resume),
        };
      })
      .filter((job) => job.matchScore >= minMatchScore)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    return {
      data: jobsWithScores.map((job) => ({
        id: job.id,
        title: job.title,
        slug: job.slug,
        company: job.company,
        category: job.category,
        jobType: job.jobType,
        jobLevel: job.jobLevel,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryNegotiate: job.salaryNegotiate,
        city: job.city,
        country: job.country,
        deadline: job.deadline,
        viewCount: job.viewCount,
        applicationCount: job._count.applications,
        matchScore: job.matchScore,
        matchReasons: job.matchReasons,
        createdAt: job.createdAt,
      })),
      meta: {
        total: jobsWithScores.length,
        resumeId: resume.id,
      },
    };
  }

  /**
   * Get match reasons between job and resume
   */
  private getMatchReasons(job: any, resume: any): string[] {
    const reasons: string[] = [];

    // Category match
    if (job.categoryId === resume.categoryId) {
      reasons.push(`Same category: ${job.category?.name}`);
    }

    // Skills match
    if (job.skills && job.skills.length > 0 && resume.skills && resume.skills.length > 0) {
      const resumeSkillIds = new Set(resume.skills.map((s: any) => s.skillId));

      const matchingSkills = job.skills.filter((js: any) => resumeSkillIds.has(js.skillId));

      if (matchingSkills.length > 0) {
        const skillNames = matchingSkills
          .slice(0, 3)
          .map((s: any) => s.skill.name)
          .join(', ');
        reasons.push(`Matching skills: ${skillNames}${matchingSkills.length > 3 ? '...' : ''}`);
      }
    }

    // Location match
    if (job.city && resume.city && job.city.toLowerCase() === resume.city.toLowerCase()) {
      reasons.push(`Same location: ${job.city}`);
    }

    // Experience level
    if (job.experience && resume.experience) {
      const experienceLevels = [
        ExperienceLevel.NO_EXPERIENCE,
        ExperienceLevel.UNDER_1_YEAR,
        ExperienceLevel.ONE_TO_THREE_YEARS,
        ExperienceLevel.THREE_TO_FIVE_YEARS,
        ExperienceLevel.FIVE_TO_TEN_YEARS,
        ExperienceLevel.OVER_TEN_YEARS,
      ];

      const jobExpIndex = experienceLevels.indexOf(job.experience);
      const resumeExpIndex = experienceLevels.indexOf(resume.experience);

      if (resumeExpIndex >= jobExpIndex) {
        reasons.push('Experience level matches job requirements');
      }
    }

    return reasons;
  }

  /**
   * Get candidate recommendations for a job (Employer feature)
   */
  async getCandidateRecommendations(userId: string, query: CandidateRecommendationQueryDto) {
    const { jobId, limit = 10, minMatchScore = 60 } = query;

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
        category: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found or unauthorized');
    }

    // Get public resumes with related data
    const resumes = await this.prisma.resume.findMany({
      where: {
        isPublic: true,
        // Exclude users who already applied
        user: {
          applications: {
            none: {
              jobId: jobId,
            },
          },
        },
      },
      take: limit * 3,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
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

    // Calculate match scores
    const candidatesWithScores = resumes
      .map((resume) => {
        const matchScore = this.calculateMatchScore(job, resume);
        return {
          ...resume,
          matchScore: Math.round(matchScore),
          matchReasons: this.getMatchReasons(job, resume),
        };
      })
      .filter((candidate) => candidate.matchScore >= minMatchScore)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    return {
      data: candidatesWithScores.map((candidate) => ({
        id: candidate.id,
        user: candidate.user,
        title: candidate.title,
        category: candidate.category,
        experience: candidate.experience,
        city: candidate.city,
        country: candidate.country,
        objective: candidate.objective,
        skills: candidate.skills.map((s) => ({
          id: s.skill.id,
          name: s.skill.name,
          level: s.level,
        })),
        matchScore: candidate.matchScore,
        matchReasons: candidate.matchReasons,
        createdAt: candidate.createdAt,
        updatedAt: candidate.updatedAt,
      })),
      meta: {
        total: candidatesWithScores.length,
        jobId: job.id,
        jobTitle: job.title,
      },
    };
  }

  /**
   * Calculate match score for a specific job and resume
   */
  async getMatchScore(userId: string, dto: MatchScoreDto) {
    const { jobId, resumeId } = dto;

    // Get job
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
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

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Get resume
    let resume;
    if (resumeId) {
      resume = await this.prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId,
        },
        include: {
          category: true,
          skills: {
            include: {
              skill: true,
            },
          },
        },
      });
    } else {
      resume = await this.prisma.resume.findUnique({
        where: { userId },
        include: {
          category: true,
          skills: {
            include: {
              skill: true,
            },
          },
        },
      });
    }

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    const matchScore = this.calculateMatchScore(job, resume);
    const matchReasons = this.getMatchReasons(job, resume);

    return {
      matchScore: Math.round(matchScore),
      matchReasons,
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        category: job.category,
        jobType: job.jobType,
        jobLevel: job.jobLevel,
        experience: job.experience,
        city: job.city,
      },
      resume: {
        id: resume.id,
        title: resume.title,
        category: resume.category,
        experience: resume.experience,
        city: resume.city,
      },
    };
  }

  /**
   * Get similar jobs based on a job
   */
  async getSimilarJobs(jobId: string, limit: number = 5) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        skills: true,
        category: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Find similar jobs
    const similarJobs = await this.prisma.job.findMany({
      where: {
        id: {
          not: jobId,
        },
        isActive: true,
        deadline: {
          gte: new Date(),
        },
        OR: [
          {
            categoryId: job.categoryId,
          },
          {
            jobLevel: job.jobLevel,
          },
          {
            city: job.city,
          },
        ],
      },
      take: limit * 2,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
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

    // Calculate similarity scores
    const jobsWithSimilarity = similarJobs
      .map((similarJob) => {
        let similarityScore = 0;

        // Category match (40%)
        if (similarJob.categoryId === job.categoryId) {
          similarityScore += 40;
        }

        // Skills overlap (30%)
        if (job.skills.length > 0 && similarJob.skills.length > 0) {
          const jobSkillIds = new Set(job.skills.map((s) => s.skillId));
          const similarJobSkillIds = new Set(similarJob.skills.map((s) => s.skillId));

          const commonSkills = [...jobSkillIds].filter((id) => similarJobSkillIds.has(id));

          const skillOverlap =
            commonSkills.length / Math.max(jobSkillIds.size, similarJobSkillIds.size);
          similarityScore += skillOverlap * 30;
        }

        // Job level match (15%)
        if (similarJob.jobLevel === job.jobLevel) {
          similarityScore += 15;
        }

        // Location match (15%)
        if (similarJob.city === job.city) {
          similarityScore += 15;
        }

        return {
          ...similarJob,
          similarityScore: Math.round(similarityScore),
        };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    return jobsWithSimilarity.map((job) => ({
      id: job.id,
      title: job.title,
      slug: job.slug,
      company: job.company,
      category: job.category,
      jobType: job.jobType,
      jobLevel: job.jobLevel,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      city: job.city,
      deadline: job.deadline,
      viewCount: job.viewCount,
      applicationCount: job._count.applications,
      similarityScore: job.similarityScore,
      createdAt: job.createdAt,
    }));
  }
}

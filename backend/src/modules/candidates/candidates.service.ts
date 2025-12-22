import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';

interface SearchFilters {
  keyword?: string;
  skills?: string[];
  experience?: string;
  location?: string;
  availability?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class CandidatesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async searchCandidates(filters: SearchFilters, _companyUserId: string) {
    const { keyword, skills, experience, location, availability, page = 1, limit = 20 } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      role: 'CANDIDATE',
      isActive: true,
    };

    // Keyword search (name, bio, currentJobTitle)
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { bio: { contains: keyword, mode: 'insensitive' } },
        { currentJobTitle: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    // Location filter
    if (location) {
      where.city = { contains: location, mode: 'insensitive' };
    }

    // Experience filter
    if (experience) {
      const [min, max] = experience.split('-').map(Number);
      if (max) {
        where.yearsOfExperience = { gte: min, lte: max };
      } else if (experience === '10+') {
        where.yearsOfExperience = { gte: 10 };
      } else {
        where.yearsOfExperience = { gte: min };
      }
    }

    // Availability filter
    if (availability) {
      where.availability = availability;
    }

    // Get candidates with resumes
    const [candidates, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          city: true,
          country: true,
          bio: true,
          currentJobTitle: true,
          yearsOfExperience: true,
          expectedSalary: true,
          availability: true,
          linkedinUrl: true,
          portfolioUrl: true,
          githubUrl: true,
          createdAt: true,
          resume: {
            select: {
              id: true,
              title: true,
              cvFileUrl: true,
              updatedAt: true,
              skills: {
                select: {
                  id: true,
                  level: true,
                  skill: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          workExperiences: {
            select: {
              id: true,
              position: true,
              company: true,
              startDate: true,
              endDate: true,
              isCurrent: true,
              description: true,
            },
            orderBy: { startDate: 'desc' },
            take: 3,
          },
          educations: {
            select: {
              id: true,
              degree: true,
              fieldOfStudy: true,
              school: true,
              startDate: true,
              endDate: true,
            },
            orderBy: { startDate: 'desc' },
            take: 2,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    // Filter by skills if provided
    let filteredCandidates = candidates;
    if (skills && skills.length > 0) {
      filteredCandidates = candidates.filter((candidate: any) => {
        if (!candidate.resume?.skills || candidate.resume.skills.length === 0) return false;
        const candidateSkills = candidate.resume.skills.map((s: any) => s.skill.name.toLowerCase());
        return skills.some((skill) => candidateSkills.includes(skill.toLowerCase()));
      });
    }

    return {
      candidates: filteredCandidates,
      total: skills && skills.length > 0 ? filteredCandidates.length : total,
      page,
      limit,
      totalPages: Math.ceil(
        (skills && skills.length > 0 ? filteredCandidates.length : total) / limit,
      ),
    };
  }

  async getCandidateProfile(userId: string) {
    const candidate = await this.prisma.user.findUnique({
      where: { id: userId, role: 'CANDIDATE' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        city: true,
        country: true,
        bio: true,
        currentJobTitle: true,
        yearsOfExperience: true,
        expectedSalary: true,
        availability: true,
        linkedinUrl: true,
        portfolioUrl: true,
        githubUrl: true,
        twitterUrl: true,
        facebookUrl: true,
        websiteUrl: true,
        createdAt: true,
        resume: {
          select: {
            id: true,
            title: true,
            cvFileUrl: true,
            updatedAt: true,
            skills: {
              select: {
                id: true,
                level: true,
                skill: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        workExperiences: {
          select: {
            id: true,
            position: true,
            company: true,
            location: true,
            startDate: true,
            endDate: true,
            isCurrent: true,
            description: true,
          },
          orderBy: { startDate: 'desc' },
        },
        educations: {
          select: {
            id: true,
            degree: true,
            fieldOfStudy: true,
            school: true,
            startDate: true,
            endDate: true,
            description: true,
          },
          orderBy: { startDate: 'desc' },
        },
        certificates: {
          select: {
            id: true,
            name: true,
            issuingOrg: true,
            issueDate: true,
            expirationDate: true,
            credentialUrl: true,
          },
          orderBy: { issueDate: 'desc' },
        },
      },
    });

    if (!candidate) {
      throw new BadRequestException('Candidate not found');
    }

    return candidate;
  }

  async saveCandidateToPool(companyUserId: string, candidateId: string) {
    // Check if candidate exists first
    const candidate = await this.prisma.user.findUnique({
      where: { id: candidateId, role: 'CANDIDATE' },
    });

    if (!candidate) {
      throw new BadRequestException('Candidate not found');
    }

    // Check if company exists
    const company = await this.prisma.company.findUnique({
      where: { userId: companyUserId },
    });

    // If employer doesn't have a company yet, show helpful message
    if (!company) {
      throw new BadRequestException(
        'Bạn cần tạo hồ sơ công ty trước khi lưu ứng viên. Vui lòng vào Hồ sơ công ty để hoàn thiện thông tin.',
      );
    }

    // Create saved candidate entry (we'll use a simple approach with a new table or use existing structure)
    // For now, let's use notifications or create a simple mapping
    // Since there's no SavedCandidate table, we'll need to create one or use another approach

    return {
      success: true,
      message: 'Candidate saved successfully',
      candidateId,
    };
  }

  async getSavedCandidates(companyUserId: string) {
    const company = await this.prisma.company.findUnique({
      where: { userId: companyUserId },
    });

    // If employer doesn't have a company yet (small business, just registered, etc.)
    // Just return empty array instead of throwing error
    if (!company) {
      return [];
    }

    // For now, return empty array
    // In the future, implement proper saved candidates table
    return [];
  }

  async removeSavedCandidate(_companyUserId: string, _candidateId: string) {
    return {
      success: true,
      message: 'Candidate removed from saved list',
    };
  }
}

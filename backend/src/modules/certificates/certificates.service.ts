import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateCertificateDto) {
    return this.prisma.certificate.create({
      data: {
        userId,
        name: data.name,
        issuingOrg: data.issuingOrg,
        issueDate: new Date(data.issueDate),
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
        credentialId: data.credentialId,
        credentialUrl: data.credentialUrl,
        description: data.description,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { issueDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }

  async update(id: string, userId: string, data: UpdateCertificateDto) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (certificate.userId !== userId) {
      throw new ForbiddenException('You can only update your own certificate');
    }

    return this.prisma.certificate.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.issuingOrg && { issuingOrg: data.issuingOrg }),
        ...(data.issueDate && { issueDate: new Date(data.issueDate) }),
        ...(data.expirationDate !== undefined && {
          expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
        }),
        ...(data.credentialId !== undefined && { credentialId: data.credentialId }),
        ...(data.credentialUrl !== undefined && { credentialUrl: data.credentialUrl }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
  }

  async remove(id: string, userId: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (certificate.userId !== userId) {
      throw new ForbiddenException('You can only delete your own certificate');
    }

    return this.prisma.certificate.delete({
      where: { id },
    });
  }
}

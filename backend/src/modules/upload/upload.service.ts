import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { PrismaService } from '@/core/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly useCloudinary: boolean;

  constructor(
    @Inject(CloudinaryService) private readonly cloudinaryService: CloudinaryService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {
    // Check if Cloudinary is configured
    this.useCloudinary = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    // Create uploads directory if using local storage
    if (!this.useCloudinary && !fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadCV(file: Express.Multer.File, userId: string) {
    this.validateFile(file, ['application/pdf'], 10); // 10MB max

    if (this.useCloudinary) {
      const result = await this.cloudinaryService.uploadFile(file, 'cvs');

      // Update user resume with CV URL
      await this.prisma.resume.updateMany({
        where: { userId },
        data: { cvFileUrl: result.url },
      });

      return {
        url: result.url,
        publicId: result.publicId,
        message: 'CV uploaded successfully',
      };
    } else {
      return this.uploadToLocal(file, 'cvs', userId);
    }
  }

  async uploadAvatar(file: Express.Multer.File, userId: string) {
    this.validateFile(file, ['image/jpeg', 'image/png', 'image/jpg'], 5); // 5MB max

    if (this.useCloudinary) {
      const result = await this.cloudinaryService.uploadImage(file, 'avatars', [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
      ]);

      // Update user avatar
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatar: result.url },
      });

      return {
        url: result.url,
        publicId: result.publicId,
        message: 'Avatar uploaded successfully',
      };
    } else {
      return this.uploadToLocal(file, 'avatars', userId);
    }
  }

  async uploadCompanyLogo(file: Express.Multer.File, userId: string) {
    this.validateFile(file, ['image/jpeg', 'image/png', 'image/jpg'], 5);

    if (this.useCloudinary) {
      const result = await this.cloudinaryService.uploadImage(file, 'logos', [
        { width: 500, height: 500, crop: 'fit' },
        { quality: 'auto' },
      ]);

      // Update company logo
      await this.prisma.company.updateMany({
        where: { userId },
        data: { logo: result.url },
      });

      return {
        url: result.url,
        publicId: result.publicId,
        message: 'Company logo uploaded successfully',
      };
    } else {
      return this.uploadToLocal(file, 'logos', userId);
    }
  }

  async uploadCompanyCover(file: Express.Multer.File, userId: string) {
    this.validateFile(file, ['image/jpeg', 'image/png', 'image/jpg'], 10);

    if (this.useCloudinary) {
      const result = await this.cloudinaryService.uploadImage(file, 'covers', [
        { width: 1920, height: 600, crop: 'fill' },
        { quality: 'auto' },
      ]);

      // Update company cover image
      await this.prisma.company.updateMany({
        where: { userId },
        data: { coverImage: result.url },
      });

      return {
        url: result.url,
        publicId: result.publicId,
        message: 'Company cover uploaded successfully',
      };
    } else {
      return this.uploadToLocal(file, 'covers', userId);
    }
  }

  private validateFile(file: Express.Multer.File, allowedMimeTypes: string[], maxSizeMB: number) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }

    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    if (file.size > maxSize) {
      throw new BadRequestException(`File size exceeds ${maxSizeMB}MB limit`);
    }
  }

  private async uploadToLocal(file: Express.Multer.File, folder: string, userId: string) {
    const folderPath = path.join(this.uploadDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileName = `${userId}-${Date.now()}-${file.originalname}`;
    const filePath = path.join(folderPath, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const url = `/uploads/${folder}/${fileName}`;

    // Update database based on folder type
    if (folder === 'cvs') {
      await this.prisma.resume.updateMany({
        where: { userId },
        data: { cvFileUrl: url },
      });
    } else if (folder === 'avatars') {
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatar: url },
      });
    } else if (folder === 'logos') {
      await this.prisma.company.updateMany({
        where: { userId },
        data: { logo: url },
      });
    } else if (folder === 'covers') {
      await this.prisma.company.updateMany({
        where: { userId },
        data: { coverImage: url },
      });
    }

    return {
      url,
      fileName,
      message: 'File uploaded successfully',
    };
  }

  async deleteFile(publicId: string) {
    if (this.useCloudinary) {
      await this.cloudinaryService.deleteFile(publicId);
      return { message: 'File deleted successfully' };
    } else {
      // Delete from local storage
      const filePath = path.join(this.uploadDir, publicId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return { message: 'File deleted successfully' };
    }
  }
}

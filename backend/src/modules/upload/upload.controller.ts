import {
  Controller,
  Post,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(@Inject(UploadService) private readonly uploadService: UploadService) {}

  @Post('cv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCV(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadCV(file, user.userId);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadAvatar(file, user.userId);
  }

  @Post('company-logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCompanyLogo(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadCompanyLogo(file, user.userId);
  }

  @Post('company-cover')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCompanyCover(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadCompanyCover(file, user.userId);
  }

  @Delete(':publicId')
  async deleteFile(@Param('publicId') publicId: string) {
    return this.uploadService.deleteFile(publicId);
  }
}

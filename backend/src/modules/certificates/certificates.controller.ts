import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
  Request,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@Controller('certificates')
@UseGuards(JwtAuthGuard)
export class CertificatesController {
  constructor(
    @Inject(CertificatesService)
    private readonly certificatesService: CertificatesService,
  ) {}

  @Post()
  create(@Request() req: any, @Body() createDto: CreateCertificateDto) {
    return this.certificatesService.create(req.user.id, createDto);
  }

  @Get('my')
  findMy(@Request() req: any) {
    return this.certificatesService.findAllByUser(req.user.id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.certificatesService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificatesService.findOne(id);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateDto: UpdateCertificateDto) {
    return this.certificatesService.update(id, req.user.id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.certificatesService.remove(id, req.user.id);
  }
}

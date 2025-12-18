import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/application.dto';
import { CreateApplicationNoteDto } from './dto/create-application-note.dto';
import { UpdateApplicationNoteDto } from './dto/update-application-note.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(
    @Inject(ApplicationsService) private readonly applicationsService: ApplicationsService,
  ) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(user.id, dto);
  }

  @Get('my-applications')
  getMyApplications(@CurrentUser() user: any) {
    return this.applicationsService.findByUser(user.id);
  }

  @Get('employer/applications')
  getEmployerApplications(@CurrentUser() user: any) {
    return this.applicationsService.findByEmployer(user.id);
  }

  @Get('job/:jobId')
  getJobApplications(@Param('jobId') jobId: string) {
    return this.applicationsService.findByJob(jobId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, dto.status, user.id, user.role);
  }

  @Patch(':id/withdraw')
  withdrawApplication(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.withdrawApplication(id, user.id);
  }

  // Application Notes
  @Post(':id/notes')
  createNote(
    @Param('id') applicationId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateApplicationNoteDto,
  ) {
    return this.applicationsService.createNote(applicationId, user.id, dto);
  }

  @Get(':id/notes')
  getNotes(@Param('id') applicationId: string, @CurrentUser() user: any) {
    return this.applicationsService.getNotes(applicationId, user.id);
  }

  @Patch('notes/:noteId')
  updateNote(
    @Param('noteId') noteId: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateApplicationNoteDto,
  ) {
    return this.applicationsService.updateNote(noteId, user.id, dto);
  }

  @Delete('notes/:noteId')
  deleteNote(@Param('noteId') noteId: string, @CurrentUser() user: any) {
    return this.applicationsService.deleteNote(noteId, user.id);
  }
}

/**
 * Application & Interview related types
 */

import type { Job } from './job.types';
import type { User } from './user.types';

// ==================== Enums ====================

export type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'SHORTLISTED'
  | 'INTERVIEWED'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type InterviewStatus =
  | 'SCHEDULED'
  | 'RESCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type InterviewType = 'PHONE_SCREEN' | 'VIDEO_CALL' | 'ONSITE' | 'TECHNICAL' | 'HR' | 'FINAL';

// ==================== Application Interface ====================

export interface Application {
  id: string;

  // Job & User
  jobId: string;
  job?: Job;
  userId: string;
  user?: User;

  // Application details
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;

  // Additional info
  expectedSalary?: number;
  availability?: string;
  noticePeriod?: string;
  willingToRelocate?: boolean;

  // Screening questions
  answers?: ApplicationAnswer[];

  // Admin & Review
  notes?: string;
  adminNote?: string;
  rejectionReason?: string;
  rating?: number;
  reviewedBy?: string;
  reviewer?: User;

  // Timeline
  appliedAt: string;
  reviewedAt?: string;
  shortlistedAt?: string;
  interviewedAt?: string;
  offeredAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  withdrawnAt?: string;

  createdAt: string;
  updatedAt: string;

  // Relations
  interviews?: Interview[];

  _count?: {
    interviews?: number;
  };
}

// ==================== Application Answer ====================

export interface ApplicationAnswer {
  id: string;
  applicationId: string;
  questionId: string;
  question: string;
  answer: string;
  createdAt: string;
}

// ==================== Interview Interface ====================

export interface Interview {
  id: string;

  // Application
  applicationId: string;
  application?: Application;

  // Interview details
  type: InterviewType;
  status: InterviewStatus;
  title?: string;
  description?: string;

  // Schedule
  scheduledAt: string;
  duration: number; // in minutes
  timezone?: string;

  // Location (physical or virtual)
  location?: string;
  address?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;

  // Interviewers
  interviewers?: InterviewerAssignment[];

  // Notes & Feedback
  notes?: string;
  feedback?: string;
  internalNotes?: string;

  // Rating
  rating?: number;
  ratingCriteria?: InterviewRating[];

  // Attachments
  attachments?: InterviewAttachment[];

  // Admin
  createdBy?: string;
  creator?: User;

  // Timeline
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;

  // Reminders
  reminderSent?: boolean;
  reminderSentAt?: string;
}

// ==================== Interviewer Assignment ====================

export interface InterviewerAssignment {
  id: string;
  interviewId: string;
  userId: string;
  user?: User;
  role?: 'PRIMARY' | 'SECONDARY' | 'OBSERVER';
  notes?: string;
  createdAt: string;
}

// ==================== Interview Rating ====================

export interface InterviewRating {
  id: string;
  interviewId: string;
  criterion: string;
  rating: number;
  maxRating: number;
  notes?: string;
  createdBy?: string;
}

// ==================== Interview Attachment ====================

export interface InterviewAttachment {
  id: string;
  interviewId: string;
  filename: string;
  url: string;
  fileType: string;
  fileSize: number;
  uploadedBy?: string;
  createdAt: string;
}

// ==================== Application Activity ====================

export interface ApplicationActivity {
  id: string;
  applicationId: string;
  type: 'STATUS_CHANGE' | 'NOTE_ADDED' | 'INTERVIEW_SCHEDULED' | 'EMAIL_SENT' | 'OTHER';
  action: string;
  description?: string;
  metadata?: Record<string, unknown>;
  userId?: string;
  user?: User;
  createdAt: string;
}

// ==================== Query Params ====================

export interface ApplicationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ApplicationStatus;
  jobId?: string;
  userId?: string;
  companyId?: string;
  rating?: number;
  hasInterview?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface InterviewQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: InterviewStatus;
  type?: InterviewType;
  applicationId?: string;
  jobId?: string;
  userId?: string;
  interviewerId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ==================== Form Data ====================

export interface ApplicationUpdateData {
  status?: ApplicationStatus;
  notes?: string;
  adminNote?: string;
  rejectionReason?: string;
  rating?: number;
}

export interface InterviewFormData {
  applicationId: string;
  type: InterviewType;
  title?: string;
  description?: string;
  scheduledAt: string;
  duration: number;
  timezone?: string;
  location?: string;
  address?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  interviewerIds?: string[];
  notes?: string;
}

export interface InterviewUpdateData {
  type?: InterviewType;
  status?: InterviewStatus;
  title?: string;
  description?: string;
  scheduledAt?: string;
  duration?: number;
  timezone?: string;
  location?: string;
  address?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  notes?: string;
  feedback?: string;
  internalNotes?: string;
  rating?: number;
  cancellationReason?: string;
}

export interface InterviewFeedbackData {
  feedback: string;
  rating?: number;
  ratingCriteria?: Array<{
    criterion: string;
    rating: number;
    maxRating: number;
    notes?: string;
  }>;
  recommendation?: 'HIRE' | 'MAYBE' | 'NO_HIRE';
  strengths?: string;
  weaknesses?: string;
  notes?: string;
}

// ==================== Application Stats ====================

export interface ApplicationStats {
  totalApplications: number;
  pendingApplications: number;
  reviewingApplications: number;
  shortlistedApplications: number;
  interviewedApplications: number;
  offeredApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  withdrawnApplications: number;
  newApplicationsToday: number;
  newApplicationsThisWeek: number;
  newApplicationsThisMonth: number;
  averageTimeToReview?: number;
  averageTimeToHire?: number;
  conversionRate?: number;
  applicationsByStatus?: Record<ApplicationStatus, number>;
  applicationsByMonth?: Array<{ month: string; count: number }>;
  topJobs?: Array<{ job: string; count: number }>;
}

// ==================== Interview Stats ====================

export interface InterviewStats {
  totalInterviews: number;
  scheduledInterviews: number;
  completedInterviews: number;
  cancelledInterviews: number;
  noShowInterviews: number;
  upcomingInterviews: number;
  todayInterviews: number;
  thisWeekInterviews: number;
  averageRating?: number;
  interviewsByType?: Record<InterviewType, number>;
  interviewsByStatus?: Record<InterviewStatus, number>;
  interviewsByMonth?: Array<{ month: string; count: number }>;
}

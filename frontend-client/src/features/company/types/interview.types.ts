export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
  NO_SHOW = 'NO_SHOW',
}

export interface Interview {
  id: string;
  applicationId: string;
  scheduledAt: string;
  duration: number;
  location?: string;
  meetingLink?: string;
  interviewers?: string;
  notes?: string;
  status: InterviewStatus;
  feedback?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  application: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      avatar?: string;
      bio?: string;
      currentJobTitle?: string;
      yearsOfExperience?: number;
    };
    job: {
      id: string;
      title: string;
    };
    resume?: unknown;
  };
}

export interface CreateInterviewData {
  applicationId: string;
  scheduledAt: string;
  duration?: number;
  location?: string;
  meetingLink?: string;
  interviewers?: string;
  notes?: string;
}

export interface UpdateInterviewData {
  scheduledAt?: string;
  duration?: number;
  location?: string;
  meetingLink?: string;
  interviewers?: string;
  notes?: string;
  status?: InterviewStatus;
  feedback?: string;
}

export interface InterviewFilters {
  status?: InterviewStatus;
  from?: string;
  to?: string;
}

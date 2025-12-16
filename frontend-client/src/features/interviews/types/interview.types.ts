export interface Interview {
  id: string;
  applicationId: string;
  scheduledAt: string;
  duration: number; // minutes
  location?: string;
  meetingLink?: string;
  interviewers?: string;
  notes?: string;
  status: InterviewStatus;
  feedback?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  application?: {
    id: string;
    jobId: string;
    userId: string;
    status: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      phone?: string;
    };
    job: {
      id: string;
      title: string;
      companyId?: string;
      company?: {
        id: string;
        name: string;
        logo?: string;
      };
    };
  };
}

export type InterviewStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED'
  | 'NO_SHOW';

export interface CreateInterviewDto {
  applicationId: string;
  scheduledAt: string;
  duration: number;
  location?: string;
  meetingLink?: string;
  interviewers?: string;
  notes?: string;
}

export interface UpdateInterviewDto {
  scheduledAt?: string;
  duration?: number;
  location?: string;
  meetingLink?: string;
  interviewers?: string;
  notes?: string;
  status?: InterviewStatus;
  feedback?: string;
}

export interface InterviewsQuery {
  page?: number;
  limit?: number;
  status?: InterviewStatus;
  applicationId?: string;
  startDate?: string;
  endDate?: string;
}

export interface InterviewsResponse {
  data: Interview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

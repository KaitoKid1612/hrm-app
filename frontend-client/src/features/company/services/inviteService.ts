import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';

export interface InviteCandidate {
  email: string;
  name: string;
  phone?: string;
  note?: string;
}

export interface BulkInviteRequest {
  jobId: string;
  candidates: InviteCandidate[];
  customMessage?: string;
}

export interface BulkInviteResponse {
  total: number;
  sent: number;
  failed: number;
  errors: Array<{
    email: string;
    error: string;
  }>;
}

export interface JobInvite {
  id: string;
  jobId: string;
  email: string;
  name: string;
  phone?: string;
  note?: string;
  sentBy: string;
  sentAt: string;
  job: {
    title: string;
  };
}

export const inviteService = {
  /**
   * Bulk invite candidates via JSON
   */
  async bulkInvite(data: BulkInviteRequest): Promise<BulkInviteResponse> {
    const response = await api.post(API_ENDPOINTS.INVITES.BULK, data);
    return response.data;
  },

  /**
   * Upload CSV and invite candidates
   */
  async uploadCsvInvite(jobId: string, file: File): Promise<BulkInviteResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(API_ENDPOINTS.INVITES.UPLOAD_CSV(jobId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get invites for a specific job
   */
  async getJobInvites(jobId: string): Promise<JobInvite[]> {
    const response = await api.get(API_ENDPOINTS.INVITES.JOB_INVITES(jobId));
    return response.data;
  },

  /**
   * Get all invites for employer
   */
  async getMyInvites(): Promise<JobInvite[]> {
    const response = await api.get(API_ENDPOINTS.INVITES.MY_INVITES);
    return response.data;
  },
};

import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from './users.service';

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  pros?: string;
  cons?: string;
  isApproved: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  company: {
    id: string;
    name: string;
    logo?: string;
  };
}

export interface ReviewsQueryParams {
  page?: number;
  limit?: number;
  companyId?: string;
  isApproved?: boolean;
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const moderationService = {
  // Get all reviews
  async getReviews(params?: ReviewsQueryParams): Promise<PaginatedResponse<Review>> {
    const response = await apiClient.get<PaginatedResponse<Review>>('/admin/moderation/reviews', {
      params,
    });
    return response.data;
  },

  // Get review stats
  async getReviewStats(): Promise<{
    total: number;
    approved: number;
    rejected: number;
    verified: number;
    pending: number;
  }> {
    const response = await apiClient.get('/admin/moderation/reviews/stats/overview');
    return response.data;
  },

  // Approve review
  async approveReview(id: string): Promise<Review> {
    const response = await apiClient.post<Review>(`/admin/moderation/reviews/${id}/approve`);
    return response.data;
  },

  // Reject review
  async rejectReview(id: string): Promise<Review> {
    const response = await apiClient.post<Review>(`/admin/moderation/reviews/${id}/reject`);
    return response.data;
  },

  // Verify review
  async verifyReview(id: string): Promise<Review> {
    const response = await apiClient.post<Review>(`/admin/moderation/reviews/${id}/verify`);
    return response.data;
  },

  // Delete review
  async deleteReview(id: string): Promise<void> {
    await apiClient.delete(`/admin/moderation/reviews/${id}`);
  },
};

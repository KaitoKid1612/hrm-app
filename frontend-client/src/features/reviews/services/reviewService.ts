import api from '@/lib/axios';
import {
  Review,
  CreateReviewDto,
  UpdateReviewDto,
  ReviewsQuery,
  ReviewsResponse,
  CompanyRating,
} from '../types/review.types';

const BASE_URL = '/reviews';

export const reviewService = {
  // Get all reviews with filters
  async getReviews(query: ReviewsQuery = {}): Promise<ReviewsResponse> {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.companyId) params.append('companyId', query.companyId);
    if (query.rating) params.append('rating', query.rating.toString());
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);

    const response = await api.get(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Get reviews for a specific company
  async getCompanyReviews(companyId: string, query: ReviewsQuery = {}): Promise<ReviewsResponse> {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.rating) params.append('rating', query.rating.toString());
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);

    const response = await api.get(`${BASE_URL}/company/${companyId}?${params.toString()}`);
    return response.data;
  },

  // Get company rating summary
  async getCompanyRating(companyId: string): Promise<CompanyRating> {
    const response = await api.get(`${BASE_URL}/company/${companyId}/rating`);
    return response.data;
  },

  // Get single review
  async getReview(reviewId: string): Promise<Review> {
    const response = await api.get(`${BASE_URL}/${reviewId}`);
    return response.data;
  },

  // Get my reviews
  async getMyReviews(): Promise<Review[]> {
    const response = await api.get(`${BASE_URL}/my/reviews`);
    return response.data;
  },

  // Create a new review
  async createReview(data: CreateReviewDto): Promise<Review> {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Update a review
  async updateReview(reviewId: string, data: UpdateReviewDto): Promise<Review> {
    const response = await api.put(`${BASE_URL}/${reviewId}`, data);
    return response.data;
  },

  // Delete a review
  async deleteReview(reviewId: string): Promise<void> {
    await api.delete(`${BASE_URL}/${reviewId}`);
  },

  // Mark review as helpful
  async markHelpful(reviewId: string): Promise<Review> {
    const response = await api.patch(`${BASE_URL}/${reviewId}/helpful`);
    return response.data;
  },
};

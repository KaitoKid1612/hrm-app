export interface Review {
  id: string;
  userId: string;
  companyId: string;
  rating: number; // 1-5 stars
  title: string;
  content: string;
  pros?: string;
  cons?: string;
  isAnonymous: boolean;
  isVerified: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
    currentJobTitle?: string;
  };
  company?: {
    id: string;
    name: string;
    logo?: string;
  };
}

export interface CreateReviewDto {
  companyId: string;
  rating: number;
  title: string;
  content: string;
  pros?: string;
  cons?: string;
  isAnonymous?: boolean;
}

export interface UpdateReviewDto {
  rating?: number;
  title?: string;
  content?: string;
  pros?: string;
  cons?: string;
  isAnonymous?: boolean;
}

export interface ReviewsQuery {
  page?: number;
  limit?: number;
  companyId?: string;
  rating?: number;
  sortBy?: 'createdAt' | 'rating' | 'helpfulCount';
  sortOrder?: 'asc' | 'desc';
}

export interface ReviewsResponse {
  data: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CompanyRating {
  companyId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

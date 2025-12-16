import { useState, useEffect } from 'react';
import { reviewService } from '../services/reviewService';
import { Review, ReviewsQuery, CompanyRating } from '../types/review.types';

export const useCompanyReviews = (companyId: string, query: ReviewsQuery = {}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(query.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await reviewService.getCompanyReviews(companyId, {
        ...query,
        page,
      });
      setReviews(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Không thể tải đánh giá');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchReviews();
    }
  }, [companyId, page, query.rating, query.sortBy, query.sortOrder]);

  return {
    reviews,
    total,
    page,
    totalPages,
    isLoading,
    error,
    setPage,
    refetch: fetchReviews,
  };
};

export const useCompanyRating = (companyId: string) => {
  const [rating, setRating] = useState<CompanyRating | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await reviewService.getCompanyRating(companyId);
        setRating(data);
      } catch (err) {
        setError('Không thể tải đánh giá');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (companyId) {
      fetchRating();
    }
  }, [companyId]);

  return { rating, isLoading, error };
};

export const useMyReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await reviewService.getMyReviews();
      setReviews(data);
    } catch (err) {
      setError('Không thể tải đánh giá của bạn');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  return { reviews, isLoading, error, refetch: fetchMyReviews };
};

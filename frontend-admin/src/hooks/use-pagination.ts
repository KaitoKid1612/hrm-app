/**
 * Generic Pagination Hook
 * Reusable pagination state management
 * Reduces boilerplate in list pages
 */

import { useState, useCallback } from 'react';
import { PAGINATION } from '@/lib/constants';

export interface PaginationState {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export interface UsePaginationReturn {
  pagination: PaginationState;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setTotalPages: (total: number) => void;
  setTotalItems: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  resetPagination: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

/**
 * Hook for managing pagination state
 */
export function usePagination(
  initialPage = PAGINATION.DEFAULT_PAGE,
  initialLimit = PAGINATION.DEFAULT_LIMIT,
): UsePaginationReturn {
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
    totalPages: 0,
    totalItems: 0,
  });

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 })); // Reset to page 1 when limit changes
  }, []);

  const setTotalPages = useCallback((total: number) => {
    setPagination((prev) => ({ ...prev, totalPages: total }));
  }, []);

  const setTotalItems = useCallback((total: number) => {
    setPagination((prev) => ({ ...prev, totalItems: total }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.totalPages || prev.page + 1),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination({
      page: initialPage,
      limit: initialLimit,
      totalPages: 0,
      totalItems: 0,
    });
  }, [initialPage, initialLimit]);

  return {
    pagination,
    setPage,
    setLimit,
    setTotalPages,
    setTotalItems,
    nextPage,
    prevPage,
    resetPagination,
    canGoNext: pagination.page < pagination.totalPages,
    canGoPrev: pagination.page > 1,
  };
}

/**
 * Calculate pagination metadata from API response
 */
export function calculatePagination(
  total: number,
  page: number,
  limit: number,
): Pick<PaginationState, 'totalPages' | 'totalItems'> {
  return {
    totalPages: Math.ceil(total / limit),
    totalItems: total,
  };
}

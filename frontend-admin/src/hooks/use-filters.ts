/**
 * Generic Filters Hook
 * Type-safe filter state management
 * Reduces boilerplate in list pages with filters
 */

import { useState, useCallback, useMemo } from 'react';

export interface UseFiltersReturn<T> {
  filters: T;
  setFilters: (filters: T) => void;
  updateFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  resetFilters: () => void;
  clearFilter: <K extends keyof T>(key: K) => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

/**
 * Hook for managing filter state
 * Usage:
 * const filters = useFilters<JobFilters>({ status: undefined, type: undefined });
 * filters.updateFilter('status', 'PUBLISHED');
 */
export function useFilters<T extends Record<string, unknown>>(
  initialFilters: T,
): UseFiltersReturn<T> {
  const [filters, setFiltersState] = useState<T>(initialFilters);

  const setFilters = useCallback((newFilters: T) => {
    setFiltersState(newFilters);
  }, []);

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFiltersState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilter = useCallback(<K extends keyof T>(key: K) => {
    setFiltersState((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
  }, [initialFilters]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(
      (value) => value !== undefined && value !== null && value !== '',
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) => value !== undefined && value !== null && value !== '',
    ).length;
  }, [filters]);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    clearFilter,
    hasActiveFilters,
    activeFilterCount,
  };
}

/**
 * Convert filters object to query params for API calls
 * Removes undefined/null values
 */
export function filtersToParams<T extends Record<string, unknown>>(
  filters: T,
): Record<string, string> {
  return Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}

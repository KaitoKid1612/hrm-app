/**
 * Generic Entity Mutations Hook
 * Reusable mutations for CRUD operations with consistent patterns
 * Reduces boilerplate across all entity pages
 */

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { successMessage, errorMessage, getApiErrorMessage } from '@/lib/toast-messages';

type EntityType = 'user' | 'company' | 'job' | 'application' | 'category' | 'skill' | 'interview';

interface UseEntityMutationsOptions<T = unknown> {
  entity: EntityType;
  queryKeys: readonly (readonly unknown[])[];
  onSuccess?: (data?: T) => void;
  onError?: (error: unknown) => void;
}

interface EntityMutationsResult<T = unknown> {
  createMutation: UseMutationResult<T, unknown, unknown, unknown>;
  updateMutation: UseMutationResult<T, unknown, { id: string; data: unknown }, unknown>;
  deleteMutation: UseMutationResult<void, unknown, string, unknown>;
  bulkDeleteMutation: UseMutationResult<void, unknown, string[], unknown>;
}

/**
 * Create standard CRUD mutations for any entity
 */
export function useEntityMutations<T = unknown>(
  options: UseEntityMutationsOptions<T> & {
    createFn?: (data: unknown) => Promise<T>;
    updateFn?: (id: string, data: unknown) => Promise<T>;
    deleteFn?: (id: string) => Promise<void>;
    bulkDeleteFn?: (ids: string[]) => Promise<void>;
  },
): EntityMutationsResult<T> {
  const queryClient = useQueryClient();
  const { entity, queryKeys, createFn, updateFn, deleteFn, bulkDeleteFn, onSuccess, onError } =
    options;

  // Helper to invalidate all related queries
  const invalidateEntityQueries = () => {
    queryKeys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createFn || (() => Promise.reject('Create function not provided')),
    onSuccess: (data) => {
      invalidateEntityQueries();
      toast.success(successMessage(entity, 'create'));
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || errorMessage(entity, 'create'));
      onError?.(error);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateFn
      ? ({ id, data }: { id: string; data: unknown }) => updateFn(id, data)
      : () => Promise.reject('Update function not provided'),
    onSuccess: (data) => {
      invalidateEntityQueries();
      toast.success(successMessage(entity, 'update'));
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || errorMessage(entity, 'update'));
      onError?.(error);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteFn || (() => Promise.reject('Delete function not provided')),
    onSuccess: () => {
      invalidateEntityQueries();
      toast.success(successMessage(entity, 'delete'));
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || errorMessage(entity, 'delete'));
      onError?.(error);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteFn || (() => Promise.reject('Bulk delete function not provided')),
    onSuccess: () => {
      invalidateEntityQueries();
      toast.success(`${entity}s deleted successfully`);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || `Failed to delete ${entity}s`);
      onError?.(error);
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    bulkDeleteMutation,
  };
}

/**
 * Create status change mutation (for jobs, applications, users)
 */
export function useStatusMutation(
  options: UseEntityMutationsOptions & {
    statusFn: (id: string, status: string) => Promise<unknown>;
    actionName: string;
  },
) {
  const queryClient = useQueryClient();
  const { entity, queryKeys, statusFn, actionName, onSuccess, onError } = options;

  const invalidateEntityQueries = () => {
    queryKeys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => statusFn(id, status),
    onSuccess: (data) => {
      invalidateEntityQueries();
      toast.success(`${entity} ${actionName} successfully`);
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || `Failed to ${actionName} ${entity}`);
      onError?.(error);
    },
  });
}

/**
 * Create bulk status change mutation
 */
export function useBulkStatusMutation(
  options: UseEntityMutationsOptions & {
    bulkStatusFn: (ids: string[], status: string) => Promise<unknown>;
    actionName: string;
  },
) {
  const queryClient = useQueryClient();
  const { entity, queryKeys, bulkStatusFn, actionName, onSuccess, onError } = options;

  const invalidateEntityQueries = () => {
    queryKeys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) => bulkStatusFn(ids, status),
    onSuccess: (data) => {
      invalidateEntityQueries();
      toast.success(`${entity}s ${actionName} successfully`);
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || `Failed to ${actionName} ${entity}s`);
      onError?.(error);
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/export';

interface UseMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccessMessage?: string;
  onErrorMessage?: string;
  invalidateQueries?: string[][];
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
}

export const useOptimisticMutation = <TData = unknown, TVariables = unknown>({
  mutationFn,
  onSuccessMessage,
  onErrorMessage,
  invalidateQueries = [],
  onSuccess,
  onError,
}: UseMutationOptions<TData, TVariables>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      // Invalidate specified queries
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });

      // Show success toast
      if (onSuccessMessage) {
        toast.success(onSuccessMessage);
      }

      // Call custom success handler
      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      const message = onErrorMessage || getErrorMessage(error);
      toast.error(message);
      onError?.(error);
    },
  });
};

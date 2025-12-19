import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { jobsService } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import type { Job } from '@/types';

export const useJobMutations = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: jobsService.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success('Job deleted successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to delete job');
    },
  });

  const closeJobMutation = useMutation({
    mutationFn: jobsService.closeJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success('Job closed successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to close job');
    },
  });

  const reopenJobMutation = useMutation({
    mutationFn: jobsService.reopenJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success('Job reopened successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to reopen job');
    },
  });

  const createMutation = useMutation({
    mutationFn: jobsService.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success('Job created successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to create job');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) =>
      jobsService.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success('Job updated successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to update job');
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: jobsService.bulkAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success('Bulk action completed successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to complete bulk action');
    },
  });

  return {
    delete: deleteMutation,
    close: closeJobMutation,
    reopen: reopenJobMutation,
    create: createMutation,
    update: updateMutation,
    bulkAction: bulkActionMutation,
  };
};

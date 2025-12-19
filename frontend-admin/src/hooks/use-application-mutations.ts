import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { applicationsService } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import type { ApplicationStatus, Application } from '@/types';

export const useApplicationMutations = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Application> }) =>
      applicationsService.updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      toast.success('Application updated successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to update application');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: applicationsService.deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      toast.success('Application deleted successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to delete application');
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      applicationsService.changeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      toast.success('Application status updated');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to update status');
    },
  });

  return {
    update: updateMutation,
    delete: deleteMutation,
    changeStatus: changeStatusMutation,
  };
};

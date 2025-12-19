import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { companiesService } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import type { Company } from '@/types';

export const useCompanyMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: companiesService.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      toast.success('Company created successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to create company');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) =>
      companiesService.updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      toast.success('Company updated successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to update company');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: companiesService.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      toast.success('Company deleted successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to delete company');
    },
  });

  const verifyMutation = useMutation({
    mutationFn: companiesService.verifyCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      toast.success('Company verified successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to verify company');
    },
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      companiesService.toggleFeature(id, isFeatured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      toast.success('Company feature status updated');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to update feature status');
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: companiesService.bulkAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      toast.success('Bulk action completed successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to complete bulk action');
    },
  });

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    verify: verifyMutation,
    toggleFeature: toggleFeatureMutation,
    bulkAction: bulkActionMutation,
  };
};

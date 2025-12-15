import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companiesService, type CompaniesQueryParams, type UpdateCompanyData } from '@/services';
import { toast } from 'sonner';

// Query key factory
export const COMPANIES_KEYS = {
  all: ['companies'] as const,
  lists: () => [...COMPANIES_KEYS.all, 'list'] as const,
  list: (params?: CompaniesQueryParams) => [...COMPANIES_KEYS.lists(), params] as const,
  details: () => [...COMPANIES_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...COMPANIES_KEYS.details(), id] as const,
  stats: () => [...COMPANIES_KEYS.all, 'stats'] as const,
};

// Get companies list
export function useCompanies(params?: CompaniesQueryParams) {
  return useQuery({
    queryKey: COMPANIES_KEYS.list(params),
    queryFn: () => companiesService.getCompanies(params),
  });
}

// Get single company
export function useCompany(id: string) {
  return useQuery({
    queryKey: COMPANIES_KEYS.detail(id),
    queryFn: () => companiesService.getCompanyById(id),
    enabled: !!id,
  });
}

// Get company stats
export function useCompanyStats() {
  return useQuery({
    queryKey: COMPANIES_KEYS.stats(),
    queryFn: () => companiesService.getCompanyStats(),
  });
}

// Update company
export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCompanyData }) =>
      companiesService.updateCompany(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEYS.stats() });
      toast.success('Company updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update company');
    },
  });
}

// Delete company
export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => companiesService.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEYS.stats() });
      toast.success('Company deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete company');
    },
  });
}

// Verify company
export function useVerifyCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => companiesService.verifyCompany(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEYS.stats() });
      toast.success('Company verified successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to verify company');
    },
  });
}

// Reject company
export function useRejectCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      companiesService.rejectCompany(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEYS.stats() });
      toast.success('Company rejected');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reject company');
    },
  });
}

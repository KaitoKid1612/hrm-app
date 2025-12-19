import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services';
import type { UserQueryParams, UserUpdateData, User } from '@/types';
import { toast } from '@/lib/toast';

// Query key factory
export const USERS_KEYS = {
  all: ['users'] as const,
  lists: () => [...USERS_KEYS.all, 'list'] as const,
  list: (params?: UserQueryParams) => [...USERS_KEYS.lists(), params] as const,
  details: () => [...USERS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...USERS_KEYS.details(), id] as const,
  stats: () => [...USERS_KEYS.all, 'stats'] as const,
};

// Get users list
export function useUsers(params?: UserQueryParams) {
  return useQuery({
    queryKey: USERS_KEYS.list(params),
    queryFn: () => usersService.getAllUsers(params),
  });
}

// Get single user
export function useUser(id: string) {
  return useQuery({
    queryKey: USERS_KEYS.detail(id),
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  });
}

// Get user stats
export function useUserStats() {
  return useQuery({
    queryKey: USERS_KEYS.stats(),
    queryFn: () => usersService.getUserStats(),
  });
}

// Create user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserUpdateData> & { password: string }) =>
      usersService.createUser(data as Partial<User> & { password: string }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.stats() });
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });
}

// Update user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdateData }) =>
      usersService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.stats() });
      toast.success('User updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user');
    },
  });
}

// Delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.stats() });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
}

// Toggle user status
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'BANNED' }) =>
      usersService.toggleUserStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.detail(variables.id) });
      toast.success('User status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update status');
    },
  });
}

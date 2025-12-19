import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, type LoginCredentials, type RegisterData } from '@/services';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/toast';
import { handleApiError } from '@/lib/api-client';

// Query key constants
export const AUTH_KEYS = {
  currentUser: ['auth', 'currentUser'] as const,
};

// Hook to get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to login
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, data.user);
      toast.success('Đăng nhập thành công!');
      router.push('/dashboard');
    },
    onError: (error: unknown) => {
      toast.error(handleApiError(error));
    },
  });
}

// Hook to register
export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, data.user);
      toast.success('Đăng ký thành công!');
      router.push('/dashboard');
    },
    onError: (error: unknown) => {
      toast.error(handleApiError(error));
    },
  });
}

// Hook to logout
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success('Đăng xuất thành công');
      router.push('/login');
    },
    onError: (error: unknown) => {
      toast.error(handleApiError(error));
    },
  });
}

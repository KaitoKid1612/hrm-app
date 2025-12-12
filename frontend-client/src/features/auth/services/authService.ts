import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { AuthResponse, LoginFormData, RegisterFormData, AuthUser } from '../types';

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  async getProfile(): Promise<AuthUser> {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
    return response.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
  },
};

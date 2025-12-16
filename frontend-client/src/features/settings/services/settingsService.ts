import axios from 'axios';
import type { AuthUser } from '@/features/auth/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  currentJobTitle?: string;
  yearsOfExperience?: number;
  expectedSalary?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  jobAlerts: boolean;
  applicationUpdates: boolean;
  messageNotifications: boolean;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

class SettingsService {
  async updateProfile(data: UpdateProfileRequest): Promise<{ user: AuthUser }> {
    const response = await axios.put(`${API_BASE_URL}/auth/profile`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await axios.post(`${API_BASE_URL}/auth/change-password`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async getPreferences(): Promise<UserPreferences> {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/preferences`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch {
      // Fallback to localStorage if API fails
      const stored = localStorage.getItem('userPreferences');
      return stored
        ? JSON.parse(stored)
        : {
            emailNotifications: true,
            jobAlerts: true,
            applicationUpdates: true,
            messageNotifications: true,
          };
    }
  }

  async updatePreferences(preferences: UserPreferences): Promise<UserPreferences> {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/preferences`, preferences, {
        headers: getAuthHeaders(),
      });
      return response.data.preferences;
    } catch {
      // Fallback to localStorage if API fails
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      return preferences;
    }
  }

  async deleteAccount(): Promise<void> {
    await axios.delete(`${API_BASE_URL}/auth/account`, {
      headers: getAuthHeaders(),
    });
  }
}

export const settingsService = new SettingsService();

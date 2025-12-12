import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { ProfileFormData } from '../types';

interface ProfileData {
  id: string;
  email: string;
  name: string;
  [key: string]: unknown;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (data: ProfileFormData) => {
    try {
      const response = await profileService.updateProfile(data);
      setProfile(response.data);
      return response;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update profile');
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const response = await profileService.uploadAvatar(file);
      await fetchProfile(); // Refresh profile after upload
      return response;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to upload avatar');
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    uploadAvatar,
    refetch: fetchProfile,
  };
};

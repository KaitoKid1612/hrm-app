import { useState, useEffect } from 'react';
import { companyProfileService, CompanyProfileData } from '../services/companyProfileService';

export const useCompanyProfile = () => {
  const [profile, setProfile] = useState<CompanyProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await companyProfileService.getMyProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<CompanyProfileData>) => {
    if (!profile?.id) throw new Error('No profile ID');
    const updated = await companyProfileService.updateProfile(profile.id, data);
    setProfile(updated);
    return updated;
  };

  const uploadLogo = async (file: File) => {
    const result = await companyProfileService.uploadLogo(file);
    if (profile) {
      const updatedProfile = { ...profile, logo: result.url };
      setProfile(updatedProfile);
    }
    return result;
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    uploadLogo,
    reload: loadProfile,
  };
};

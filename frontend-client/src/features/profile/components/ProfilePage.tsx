import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useProfile } from '../hooks/useProfile';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { ROUTES } from '@/constants';
import { ProfileAvatar } from './sections/ProfileAvatar';
import { ProfilePersonalInfo } from './sections/ProfilePersonalInfo';
import { ProfileProfessionalInfo } from './sections/ProfileProfessionalInfo';
import { ProfileSocialLinks } from './sections/ProfileSocialLinks';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProfile, uploadAvatar, isLoading } = useProfile();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    gender: 'OTHER' as 'MALE' | 'FEMALE' | 'OTHER',
    dateOfBirth: '',
    address: user?.address || '',
    city: '',
    country: 'Vietnam',
    bio: '',
    currentJobTitle: '',
    yearsOfExperience: 0,
    expectedSalary: 0,
    linkedinUrl: '',
    portfolioUrl: '',
    githubUrl: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (file: File) => {
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Chỉ chấp nhận file ảnh');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setError('');
      await uploadAvatar(file);
      setSuccess('Cập nhật ảnh đại diện thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải ảnh lên');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      await updateProfile(formData);
      setSuccess('Cập nhật thông tin thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân của bạn</p>
        </div>
        <Button variant="ghost" onClick={() => navigate(ROUTES.DASHBOARD)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          {success}
        </div>
      )}

      {/* Avatar Section */}
      <ProfileAvatar
        avatar={user?.avatar}
        isUploading={isUploadingAvatar}
        onAvatarChange={handleAvatarChange}
      />

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProfilePersonalInfo
          formData={{
            name: formData.name,
            phone: formData.phone,
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            bio: formData.bio,
          }}
          userEmail={user?.email}
          onChange={handleChange}
        />

        <ProfileProfessionalInfo
          formData={{
            currentJobTitle: formData.currentJobTitle,
            yearsOfExperience: formData.yearsOfExperience,
            expectedSalary: formData.expectedSalary,
          }}
          onChange={handleChange}
        />

        <ProfileSocialLinks
          formData={{
            linkedinUrl: formData.linkedinUrl,
            githubUrl: formData.githubUrl,
            portfolioUrl: formData.portfolioUrl,
          }}
          onChange={handleChange}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.DASHBOARD)}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;

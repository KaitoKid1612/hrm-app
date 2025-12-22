import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useAuth } from '@/features/auth';
import {
  settingsService,
  UpdateProfileRequest,
  UserPreferences,
} from '../services/settingsService';
import { authService } from '@/features/auth/services/authService';
import { toast } from '@/lib/toast';
import { Settings, User, Lock, Bell, Trash2 } from 'lucide-react';
import { ProfileTab } from './tabs/ProfileTab';
import { PasswordTab } from './tabs/PasswordTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { AccountTab } from './tabs/AccountTab';

type TabType = 'profile' | 'password' | 'notifications' | 'account';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSaving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState<UpdateProfileRequest>({
    name: '',
    phone: '',
    city: '',
    address: '',
    bio: '',
    currentJobTitle: '',
    linkedinUrl: '',
    githubUrl: '',
    websiteUrl: '',
  });

  // Notifications preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
    messageNotifications: true,
  });

  useEffect(() => {
    if (user) {
      const userData = user as unknown as Record<string, unknown>;
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        city: (userData.city as string) || '',
        address: user.address || '',
        bio: (userData.bio as string) || '',
        currentJobTitle: (userData.currentJobTitle as string) || '',
        linkedinUrl: (userData.linkedinUrl as string) || '',
        githubUrl: (userData.githubUrl as string) || '',
        websiteUrl: (userData.websiteUrl as string) || '',
      });
    }
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    try {
      const prefs = await settingsService.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      await settingsService.updateProfile(profileForm);
      // Reload profile to get updated data
      const updatedProfile = await authService.getProfile();
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      toast.success('Cập nhật thông tin thành công!');
      // Force reload to update auth context
      window.location.reload();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (data.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setSaving(true);
      await settingsService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Đổi mật khẩu thành công!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu';
      toast.error(message);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      setSaving(true);
      await settingsService.updatePreferences(preferences);
      toast.success('Cập nhật tùy chọn thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = prompt('Nhập "XOA TAI KHOAN" để xác nhận:');
    if (confirmText !== 'XOA TAI KHOAN') {
      toast.error('Xác nhận không đúng');
      return;
    }

    try {
      setSaving(true);
      await settingsService.deleteAccount();
      toast.success('Đã xóa tài khoản');
      setShowDeleteDialog(false);
      // Redirect to home after a delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      toast.error('Tính năng này chưa được triển khai');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Thông tin cá nhân', icon: User },
    { id: 'password' as TabType, label: 'Đổi mật khẩu', icon: Lock },
    { id: 'notifications' as TabType, label: 'Thông báo', icon: Bell },
    { id: 'account' as TabType, label: 'Tài khoản', icon: Trash2 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <ProfileTab
          profileForm={profileForm}
          isSaving={isSaving}
          onFormChange={setProfileForm}
          onSave={handleUpdateProfile}
        />
      )}

      {activeTab === 'password' && (
        <PasswordTab isSaving={isSaving} onChangePassword={handleChangePassword} />
      )}

      {activeTab === 'notifications' && (
        <NotificationsTab
          preferences={preferences}
          isSaving={isSaving}
          onPreferencesChange={setPreferences}
          onSave={handleUpdatePreferences}
        />
      )}

      {activeTab === 'account' && (
        <AccountTab
          user={user}
          isSaving={isSaving}
          onDeleteAccount={() => setShowDeleteDialog(true)}
        />
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Xóa tài khoản"
        description="Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác và tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn."
        onConfirm={handleDeleteAccount}
        confirmText="Xóa tài khoản"
        variant="destructive"
        icon={Trash2}
      />
    </div>
  );
};

export default SettingsPage;

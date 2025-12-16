import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/features/auth';
import {
  settingsService,
  UpdateProfileRequest,
  UserPreferences,
} from '../services/settingsService';
import { authService } from '@/features/auth/services/authService';
import { toast } from '@/lib/toast';
import { Settings, User, Lock, Bell, Trash2, Save, Eye, EyeOff } from 'lucide-react';

type TabType = 'profile' | 'password' | 'notifications' | 'account';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSaving, setSaving] = useState(false);

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

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
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

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setSaving(true);
      await settingsService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Đổi mật khẩu thành công!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
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
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) {
      return;
    }

    const confirmText = prompt('Nhập "XOA TAI KHOAN" để xác nhận:');
    if (confirmText !== 'XOA TAI KHOAN') {
      toast.error('Xác nhận không đúng');
      return;
    }

    try {
      setSaving(true);
      await settingsService.deleteAccount();
      toast.success('Đã xóa tài khoản');
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

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="0901234567"
                />
              </div>
              <div>
                <Label htmlFor="city">Thành phố</Label>
                <Input
                  id="city"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  placeholder="Hà Nội"
                />
              </div>
              <div>
                <Label htmlFor="currentJobTitle">Chức danh hiện tại</Label>
                <Input
                  id="currentJobTitle"
                  value={profileForm.currentJobTitle}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, currentJobTitle: e.target.value })
                  }
                  placeholder="Senior Developer"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                placeholder="123 Đường ABC, Quận XYZ"
              />
            </div>

            <div>
              <Label htmlFor="bio">Giới thiệu bản thân</Label>
              <Textarea
                id="bio"
                rows={4}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Viết vài dòng giới thiệu về bản thân..."
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Liên kết mạng xã hội</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="linkedinUrl">LinkedIn</Label>
                  <Input
                    id="linkedinUrl"
                    value={profileForm.linkedinUrl}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, linkedinUrl: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                </div>
                <div>
                  <Label htmlFor="githubUrl">GitHub</Label>
                  <Input
                    id="githubUrl"
                    value={profileForm.githubUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/your-username"
                  />
                </div>
                <div>
                  <Label htmlFor="websiteUrl">Website</Label>
                  <Input
                    id="websiteUrl"
                    value={profileForm.websiteUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, websiteUrl: e.target.value })}
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleUpdateProfile} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <Card>
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  placeholder="Nhập mật khẩu hiện tại"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button onClick={handleChangePassword} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Tùy chọn thông báo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Thông báo qua email</h3>
                  <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        emailNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Thông báo việc làm mới</h3>
                  <p className="text-sm text-gray-600">Nhận thông báo khi có việc làm phù hợp</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.jobAlerts}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        jobAlerts: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Cập nhật đơn ứng tuyển</h3>
                  <p className="text-sm text-gray-600">
                    Nhận thông báo khi có thay đổi về đơn ứng tuyển
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.applicationUpdates}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        applicationUpdates: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Tin nhắn</h3>
                  <p className="text-sm text-gray-600">Nhận thông báo khi có tin nhắn mới</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.messageNotifications}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        messageNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <Button onClick={handleUpdatePreferences} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu tùy chọn
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <Card>
          <CardHeader>
            <CardTitle>Quản lý tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Xóa tài khoản</h3>
              <p className="text-sm text-red-800 mb-4">
                Hành động này sẽ xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn. Hành động này
                không thể hoàn tác!
              </p>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa tài khoản
                  </>
                )}
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Thông tin tài khoản</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Vai trò:</strong>{' '}
                  {user?.role === 'EMPLOYER' ? 'Nhà tuyển dụng' : 'Ứng viên'}
                </p>
                <p>
                  <strong>Ngày tham gia:</strong>{' '}
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SettingsPage;

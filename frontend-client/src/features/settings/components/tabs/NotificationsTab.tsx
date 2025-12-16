import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { UserPreferences } from '../../services/settingsService';

interface NotificationsTabProps {
  preferences: UserPreferences;
  isSaving: boolean;
  onPreferencesChange: (preferences: UserPreferences) => void;
  onSave: () => void;
}

export const NotificationsTab = ({
  preferences,
  isSaving,
  onPreferencesChange,
  onSave,
}: NotificationsTabProps) => {
  const notificationItems = [
    {
      key: 'emailNotifications' as keyof UserPreferences,
      title: 'Thông báo qua email',
      description: 'Nhận thông báo qua email',
    },
    {
      key: 'jobAlerts' as keyof UserPreferences,
      title: 'Thông báo việc làm mới',
      description: 'Nhận thông báo khi có việc làm phù hợp',
    },
    {
      key: 'applicationUpdates' as keyof UserPreferences,
      title: 'Cập nhật đơn ứng tuyển',
      description: 'Nhận thông báo khi có thay đổi về đơn ứng tuyển',
    },
    {
      key: 'messageNotifications' as keyof UserPreferences,
      title: 'Tin nhắn',
      description: 'Nhận thông báo khi có tin nhắn mới',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tùy chọn thông báo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {notificationItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences[item.key]}
                  onChange={(e) =>
                    onPreferencesChange({
                      ...preferences,
                      [item.key]: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>

        <Button onClick={onSave} disabled={isSaving} className="w-full">
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
  );
};

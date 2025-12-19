import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation';
import { settingsService } from '@/services';
import type {
  SystemSettings,
  EmailSettings,
  NotificationSettings,
  SecuritySettings,
} from '@/services/settings.service';

export const useSettingsMutations = () => {
  const updateSystemMutation = useOptimisticMutation<SystemSettings, Partial<SystemSettings>>({
    mutationFn: settingsService.updateSystemSettings,
    onSuccessMessage: 'System settings updated successfully',
    invalidateQueries: [['settings']],
  });

  const updateEmailMutation = useOptimisticMutation<EmailSettings, Partial<EmailSettings>>({
    mutationFn: settingsService.updateEmailSettings,
    onSuccessMessage: 'Email settings updated successfully',
    invalidateQueries: [['settings']],
  });

  const updateNotificationMutation = useOptimisticMutation<
    NotificationSettings,
    Partial<NotificationSettings>
  >({
    mutationFn: settingsService.updateNotificationSettings,
    onSuccessMessage: 'Notification settings updated successfully',
    invalidateQueries: [['settings']],
  });

  const updateSecurityMutation = useOptimisticMutation<SecuritySettings, Partial<SecuritySettings>>(
    {
      mutationFn: settingsService.updateSecuritySettings,
      onSuccessMessage: 'Security settings updated successfully',
      invalidateQueries: [['settings']],
    },
  );

  const testEmailMutation = useOptimisticMutation<{ success: boolean; message: string }, void>({
    mutationFn: settingsService.testEmailConnection,
  });

  const clearCacheMutation = useOptimisticMutation<void, void>({
    mutationFn: settingsService.clearCache,
    onSuccessMessage: 'Cache cleared successfully',
  });

  return {
    updateSystem: updateSystemMutation,
    updateEmail: updateEmailMutation,
    updateNotification: updateNotificationMutation,
    updateSecurity: updateSecurityMutation,
    testEmail: testEmailMutation,
    clearCache: clearCacheMutation,
  };
};

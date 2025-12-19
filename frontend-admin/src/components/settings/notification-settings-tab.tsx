'use client';

import { Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { NotificationSettings } from '@/services/settings.service';

interface NotificationSettingsTabProps {
  settings?: NotificationSettings;
  onSubmit: (data: Partial<NotificationSettings>) => void;
  isLoading?: boolean;
}

const NOTIFICATION_OPTIONS = [
  {
    id: 'emailNotifications',
    label: 'Email Notifications',
    description: 'Send email notifications for important events',
  },
  {
    id: 'applicationAlerts',
    label: 'Application Alerts',
    description: 'Notify about new job applications',
  },
  {
    id: 'jobExpiryReminders',
    label: 'Job Expiry Reminders',
    description: 'Send reminders before jobs expire',
  },
  {
    id: 'weeklyReports',
    label: 'Weekly Reports',
    description: 'Receive weekly summary reports',
  },
] as const;

export const NotificationSettingsTab = ({
  settings,
  onSubmit,
  isLoading,
}: NotificationSettingsTabProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      emailNotifications: formData.get('emailNotifications') === 'on',
      applicationAlerts: formData.get('applicationAlerts') === 'on',
      jobExpiryReminders: formData.get('jobExpiryReminders') === 'on',
      weeklyReports: formData.get('weeklyReports') === 'on',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage system notification settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {NOTIFICATION_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={option.id}>{option.label}</Label>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                <Switch id={option.id} name={option.id} defaultChecked={settings?.[option.id]} />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

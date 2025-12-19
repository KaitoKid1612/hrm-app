'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Shield, Bell, Settings as SettingsIcon } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState } from '@/components/shared/states';
import { settingsService } from '@/services';
import { useSettingsMutations } from '@/hooks/use-settings-mutations';
import { GeneralSettingsTab } from '@/components/settings/general-settings-tab';
import { EmailSettingsTab } from '@/components/settings/email-settings-tab';
import { NotificationSettingsTab } from '@/components/settings/notification-settings-tab';
import { SecuritySettingsTab } from '@/components/settings/security-settings-tab';

const TABS = [
  { value: 'general', label: 'General', icon: SettingsIcon },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'notifications', label: 'Notifications', icon: Bell },
  { value: 'security', label: 'Security', icon: Shield },
] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  // Fetch settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings,
  });

  // Mutations
  const mutations = useSettingsMutations();

  if (isLoading) {
    return <LoadingState text="Loading settings..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage system configuration and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value}>
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <GeneralSettingsTab
            settings={settings?.system}
            onSubmit={mutations.updateSystem.mutate}
            onClearCache={mutations.clearCache.mutate}
            isLoading={mutations.updateSystem.isPending}
            isClearingCache={mutations.clearCache.isPending}
          />
        </TabsContent>

        <TabsContent value="email">
          <EmailSettingsTab
            settings={settings?.email}
            onSubmit={mutations.updateEmail.mutate}
            onTestConnection={mutations.testEmail.mutate}
            isLoading={mutations.updateEmail.isPending}
            isTesting={mutations.testEmail.isPending}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettingsTab
            settings={settings?.notifications}
            onSubmit={mutations.updateNotification.mutate}
            isLoading={mutations.updateNotification.isPending}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettingsTab
            settings={settings?.security}
            onSubmit={mutations.updateSecurity.mutate}
            isLoading={mutations.updateSecurity.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

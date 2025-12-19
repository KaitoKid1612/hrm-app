'use client';

import { Save, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { SystemSettings } from '@/services/settings.service';

interface GeneralSettingsTabProps {
  settings?: SystemSettings;
  onSubmit: (data: Partial<SystemSettings>) => void;
  onClearCache: () => void;
  isLoading?: boolean;
  isClearingCache?: boolean;
}

export const GeneralSettingsTab = ({
  settings,
  onSubmit,
  onClearCache,
  isLoading,
  isClearingCache,
}: GeneralSettingsTabProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      siteName: formData.get('siteName') as string,
      siteDescription: formData.get('siteDescription') as string,
      supportEmail: formData.get('supportEmail') as string,
      maintenanceMode: formData.get('maintenanceMode') === 'on',
      allowRegistration: formData.get('allowRegistration') === 'on',
      emailVerificationRequired: formData.get('emailVerificationRequired') === 'on',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Configuration</CardTitle>
        <CardDescription>Basic system settings and configuration</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                name="siteName"
                defaultValue={settings?.siteName}
                placeholder="HRM Platform"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                name="supportEmail"
                type="email"
                defaultValue={settings?.supportEmail}
                placeholder="support@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input
              id="siteDescription"
              name="siteDescription"
              defaultValue={settings?.siteDescription}
              placeholder="Human Resource Management System"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable maintenance mode to restrict access
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                name="maintenanceMode"
                defaultChecked={settings?.maintenanceMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowRegistration">Allow Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new users to register</p>
              </div>
              <Switch
                id="allowRegistration"
                name="allowRegistration"
                defaultChecked={settings?.allowRegistration}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailVerificationRequired">Email Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Require email verification for new accounts
                </p>
              </div>
              <Switch
                id="emailVerificationRequired"
                name="emailVerificationRequired"
                defaultChecked={settings?.emailVerificationRequired}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClearCache}
              disabled={isClearingCache}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cache
            </Button>
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

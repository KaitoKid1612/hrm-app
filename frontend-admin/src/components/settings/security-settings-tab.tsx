'use client';

import { Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { SecuritySettings } from '@/services/settings.service';

interface SecuritySettingsTabProps {
  settings?: SecuritySettings;
  onSubmit: (data: Partial<SecuritySettings>) => void;
  isLoading?: boolean;
}

export const SecuritySettingsTab = ({
  settings,
  onSubmit,
  isLoading,
}: SecuritySettingsTabProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      maxLoginAttempts: parseInt(formData.get('maxLoginAttempts') as string, 10),
      sessionTimeout: parseInt(formData.get('sessionTimeout') as string, 10),
      passwordMinLength: parseInt(formData.get('passwordMinLength') as string, 10),
      requireStrongPassword: formData.get('requireStrongPassword') === 'on',
      twoFactorEnabled: formData.get('twoFactorEnabled') === 'on',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Configuration</CardTitle>
        <CardDescription>Manage security policies and access controls</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                name="maxLoginAttempts"
                type="number"
                min="1"
                max="10"
                defaultValue={settings?.maxLoginAttempts}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
              <Input
                id="sessionTimeout"
                name="sessionTimeout"
                type="number"
                min="300"
                defaultValue={settings?.sessionTimeout}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordMinLength">Min Password Length</Label>
              <Input
                id="passwordMinLength"
                name="passwordMinLength"
                type="number"
                min="6"
                max="20"
                defaultValue={settings?.passwordMinLength}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="requireStrongPassword">Strong Password Policy</Label>
                <p className="text-sm text-muted-foreground">
                  Require uppercase, lowercase, numbers, and special characters
                </p>
              </div>
              <Switch
                id="requireStrongPassword"
                name="requireStrongPassword"
                defaultChecked={settings?.requireStrongPassword}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="twoFactorEnabled">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Enable 2FA for admin accounts</p>
              </div>
              <Switch
                id="twoFactorEnabled"
                name="twoFactorEnabled"
                defaultChecked={settings?.twoFactorEnabled}
              />
            </div>
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

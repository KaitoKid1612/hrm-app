'use client';

import { Save, TestTube } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { EmailSettings } from '@/services/settings.service';

interface EmailSettingsTabProps {
  settings?: EmailSettings;
  onSubmit: (data: Partial<EmailSettings>) => void;
  onTestConnection: () => void;
  isLoading?: boolean;
  isTesting?: boolean;
}

export const EmailSettingsTab = ({
  settings,
  onSubmit,
  onTestConnection,
  isLoading,
  isTesting,
}: EmailSettingsTabProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      mailHost: formData.get('mailHost') as string,
      mailPort: parseInt(formData.get('mailPort') as string, 10),
      mailSecure: formData.get('mailSecure') === 'on',
      mailUser: formData.get('mailUser') as string,
      mailFrom: formData.get('mailFrom') as string,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Configuration</CardTitle>
        <CardDescription>Configure SMTP settings for sending emails</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mailHost">SMTP Host</Label>
              <Input
                id="mailHost"
                name="mailHost"
                defaultValue={settings?.mailHost}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailPort">SMTP Port</Label>
              <Input
                id="mailPort"
                name="mailPort"
                type="number"
                defaultValue={settings?.mailPort}
                placeholder="587"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mailUser">SMTP Username</Label>
              <Input
                id="mailUser"
                name="mailUser"
                defaultValue={settings?.mailUser}
                placeholder="username@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailFrom">From Email</Label>
              <Input
                id="mailFrom"
                name="mailFrom"
                type="email"
                defaultValue={settings?.mailFrom}
                placeholder="noreply@example.com"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mailSecure">Use SSL/TLS</Label>
              <p className="text-sm text-muted-foreground">Enable secure connection</p>
            </div>
            <Switch id="mailSecure" name="mailSecure" defaultChecked={settings?.mailSecure} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onTestConnection} disabled={isTesting}>
              <TestTube className="mr-2 h-4 w-4" />
              Test Connection
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

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

const recentActivities: Activity[] = [
  {
    id: '1',
    user: { name: 'John Doe', email: 'john@example.com' },
    action: 'applied to',
    target: 'Senior Developer position',
    timestamp: '2 minutes ago',
    type: 'info',
  },
  {
    id: '2',
    user: { name: 'Tech Corp', email: 'hr@techcorp.com' },
    action: 'posted',
    target: 'Frontend Engineer job',
    timestamp: '15 minutes ago',
    type: 'success',
  },
  {
    id: '3',
    user: { name: 'Jane Smith', email: 'jane@example.com' },
    action: 'updated profile',
    target: 'with new skills',
    timestamp: '1 hour ago',
    type: 'info',
  },
  {
    id: '4',
    user: { name: 'Admin', email: 'admin@hrm.com' },
    action: 'verified',
    target: 'StartUp Inc company',
    timestamp: '2 hours ago',
    type: 'success',
  },
  {
    id: '5',
    user: { name: 'Bob Wilson', email: 'bob@example.com' },
    action: 'got hired for',
    target: 'Backend Developer role',
    timestamp: '3 hours ago',
    type: 'success',
  },
];

const badgeVariants = {
  success: 'default',
  warning: 'secondary',
  info: 'outline',
  error: 'destructive',
} as const;

export function RecentActivity() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions happening in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>
                  {activity.user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user.name}{' '}
                  <span className="text-muted-foreground font-normal">{activity.action}</span>{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
              <Badge variant={badgeVariants[activity.type]}>{activity.type}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Building2, Briefcase, FileText, BarChart3, Settings } from 'lucide-react';

const quickActions = [
  {
    title: 'Manage Users',
    description: 'Add, edit or remove users',
    icon: Users,
    href: '/dashboard/users',
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Verify Companies',
    description: 'Review pending companies',
    icon: Building2,
    href: '/dashboard/companies',
    color: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Manage Jobs',
    description: 'Review and approve jobs',
    icon: Briefcase,
    href: '/dashboard/jobs',
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    title: 'View Applications',
    description: 'Track all applications',
    icon: FileText,
    href: '/dashboard/applications',
    color: 'text-orange-600 dark:text-orange-400',
  },
  {
    title: 'Analytics',
    description: 'View detailed reports',
    icon: BarChart3,
    href: '/dashboard/analytics',
    color: 'text-pink-600 dark:text-pink-400',
  },
  {
    title: 'Settings',
    description: 'System configuration',
    icon: Settings,
    href: '/dashboard/settings',
    color: 'text-gray-600 dark:text-gray-400',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-start gap-2 p-4 hover:bg-accent"
              >
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <div className="text-left">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

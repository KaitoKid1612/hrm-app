'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navItems } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser, useLogout } from '@/hooks/use-auth';

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        {/* Logo/Brand */}
        <div className="px-3 py-2">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
              <span className="text-lg font-bold">H</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">HRM Admin</span>
              <span className="text-xs text-muted-foreground">Dashboard</span>
            </div>
          </Link>
        </div>

        <Separator />

        {/* Navigation */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            Menu
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => {
              // Special handling for dashboard root - exact match only
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn('w-full justify-start', isActive && 'bg-secondary font-medium')}
                  asChild
                  disabled={item.disabled}
                >
                  <Link href={item.href}>
                    <span className="mr-2 text-lg">{item.icon}</span>
                    {item.title}
                    {item.label && <span className="ml-auto text-xs">{item.label}</span>}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* User Profile */}
        <div className="px-3 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user?.avatar} alt={user?.name || 'Admin'} />
                  <AvatarFallback>{user?.name?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>👤 Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>⚙️ Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <span>🚪 {logoutMutation.isPending ? 'Đang đăng xuất...' : 'Logout'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

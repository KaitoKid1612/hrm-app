'use client';

import * as React from 'react';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  onMenuClick?: () => void;
}

export function Header({ className, onMenuClick }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60',
        className,
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Page Title - Will be dynamic */}
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <span className="text-lg">🔔</span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

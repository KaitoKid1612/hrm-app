'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

export function ThemeShowcase() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {theme === 'dark' ? (
            <MoonIcon className="h-5 w-5 text-blue-500" />
          ) : (
            <SunIcon className="h-5 w-5 text-yellow-500" />
          )}
          Theme Showcase
        </CardTitle>
        <CardDescription>Current theme: {theme}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Buttons</h4>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="secondary">
              Secondary
            </Button>
            <Button size="sm" variant="outline">
              Outline
            </Button>
            <Button size="sm" variant="ghost">
              Ghost
            </Button>
            <Button size="sm" variant="destructive">
              Destructive
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Badges</h4>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Quick Switch</h4>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
            >
              <SunIcon className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button
              size="sm"
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
            >
              <MoonIcon className="mr-2 h-4 w-4" />
              Dark
            </Button>
            <Button
              size="sm"
              variant={theme === 'system' ? 'default' : 'outline'}
              onClick={() => setTheme('system')}
            >
              💻 System
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">
            Thử chuyển theme để xem sự thay đổi mượt mà của colors, backgrounds, và borders! 🎨
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

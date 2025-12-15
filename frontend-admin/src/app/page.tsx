import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeToggleSimple } from '@/components/theme-toggle-simple';
import { ThemeShowcase } from '@/components/theme-showcase';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Theme Toggle */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">HRM Admin</h2>
            <Badge variant="secondary">v1.0</Badge>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggleSimple />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <h1 className="text-5xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quản lý toàn bộ hệ thống tuyển dụng với giao diện hiện đại và dễ sử dụng
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Badge className="text-xs">Phase 1 Complete ✓</Badge>
              <Badge variant="secondary">Next.js 15</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="secondary">Shadcn UI</Badge>
              <Badge variant="outline">Dark Mode ✨</Badge>
            </div>
          </div>

          {/* CTA - Enter Dashboard */}
          <div className="flex flex-col items-center gap-4 py-8">
            <Link href="/dashboard">
              <Button size="lg" className="font-semibold text-lg px-8 py-6">
                <span className="mr-2">🚀</span>
                Vào Dashboard
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">Click để truy cập trang quản trị</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  <CardTitle>Theme System</CardTitle>
                </div>
                <CardDescription>Light & Dark mode tự động</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Chuyển đổi theme mượt mà với next-themes. Hỗ trợ system preference.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧩</span>
                  <CardTitle>UI Components</CardTitle>
                </div>
                <CardDescription>15+ components sẵn sàng</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Button, Card, Dialog, Table, Form và nhiều components đẹp từ Shadcn UI.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <CardTitle>Performance</CardTitle>
                </div>
                <CardDescription>Next.js 15 + Turbopack</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build cực nhanh với Turbopack. Hot reload trong chớp mắt.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <CardTitle>Type Safety</CardTitle>
                </div>
                <CardDescription>Full TypeScript support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  100% type-safe với TypeScript strict mode. Catch lỗi ngay lúc code.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📱</span>
                  <CardTitle>Responsive</CardTitle>
                </div>
                <CardDescription>Mobile-first design</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Giao diện responsive hoàn hảo trên mọi thiết bị từ mobile đến desktop.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔒</span>
                  <CardTitle>Security</CardTitle>
                </div>
                <CardDescription>Authentication ready</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sẵn sàng tích hợp authentication và authorization system.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Theme Showcase */}
          <div className="max-w-2xl mx-auto">
            <ThemeShowcase />
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="font-semibold">
                🚀 Bắt đầu quản lý
              </Button>
              <Button variant="secondary" size="lg">
                📚 Xem tài liệu
              </Button>
              <Button variant="outline" size="lg">
                ⚙️ Cài đặt
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Thử chuyển theme bằng nút ở góc trên bên phải ↗️
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with ❤️ using Next.js, TypeScript & Shadcn UI</p>
            <p className="mt-2">HRM Admin Dashboard © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">Quản lý tất cả users trong hệ thống</p>
        </div>
        <Button>
          <span className="mr-2">➕</span>
          Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <Badge variant="secondary" className="mt-2">
              All Roles
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">987</div>
            <Badge className="mt-2">Active</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Employers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <Badge variant="outline" className="mt-2">
              Verified
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>Coming soon - User management table</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page will contain user CRUD operations, filters, and bulk actions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useUsers, useUserStats } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ApiTestPage() {
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: users, isLoading: usersLoading } = useUsers({ page: 1, limit: 5 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API & React Query Test</h1>
        <p className="text-muted-foreground">Testing API integration and state management</p>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
          <CardDescription>Real-time data from API</CardDescription>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Candidates</p>
                <p className="text-2xl font-bold">{stats.candidates}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employers</p>
                <p className="text-2xl font-bold">{stats.employers}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data available</p>
          )}
        </CardContent>
      </Card>

      {/* Users List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest 5 users from the database</CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : users?.data ? (
            <div className="space-y-2">
              {users.data.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">Role: {user.role}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-secondary rounded">{user.role}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No users found</p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
        <Button variant="secondary">Open React Query DevTools (Cmd/Ctrl + Shift + D)</Button>
      </div>
    </div>
  );
}

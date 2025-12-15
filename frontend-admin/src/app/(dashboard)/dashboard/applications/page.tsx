import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">Theo dõi tất cả đơn ứng tuyển</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Management</CardTitle>
          <CardDescription>Coming soon - Application tracking system</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Track and manage all job applications across the platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs Management</h1>
          <p className="text-muted-foreground">Quản lý tất cả công việc được đăng</p>
        </div>
        <Button>
          <span className="mr-2">💼</span>
          Add Job
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Listings</CardTitle>
          <CardDescription>Coming soon - Job management interface</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage all job postings, approve/reject, and monitor activity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

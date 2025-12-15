import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-muted-foreground">Thống kê và phân tích dữ liệu hệ thống</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Coming soon - Advanced analytics and reporting</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            View detailed analytics, charts, and generate reports.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

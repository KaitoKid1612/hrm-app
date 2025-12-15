import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies Management</h1>
          <p className="text-muted-foreground">Quản lý và xác minh các công ty</p>
        </div>
        <Button>
          <span className="mr-2">🏢</span>
          Add Company
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company List</CardTitle>
          <CardDescription>Coming soon - Company management interface</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Approve, verify, and manage company profiles here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

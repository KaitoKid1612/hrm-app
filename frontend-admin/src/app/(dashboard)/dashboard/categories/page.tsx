import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories & Skills</h1>
        <p className="text-muted-foreground">Quản lý danh mục ngành nghề và kỹ năng</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>Coming soon - Category and skills management</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage job categories, industries, and skill sets.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

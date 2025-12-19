'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2, Plus, Tag, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { LoadingState, ErrorState } from '@/components/shared/states';
import { CategoryDialog, CategoryFormData } from '@/components/categories/category-dialog';
import { BulkActionsBar } from '@/components/categories/bulk-actions-bar';
import { categoriesService, Category } from '@/services/categories.service';
import { useCategoryMutations } from '@/hooks/use-category-mutations';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function CategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const mutations = useCategoryMutations();

  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoriesService.getCategories(),
  });

  const handleCreate = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      mutations.delete.mutate(categoryToDelete);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmMsg = `Are you sure you want to delete ${selectedIds.length} categor${selectedIds.length > 1 ? 'ies' : 'y'}?`;
    if (!confirm(confirmMsg)) return;

    try {
      await Promise.all(selectedIds.map((id) => categoriesService.deleteCategory(id)));
      toast.success(`${selectedIds.length} categor${selectedIds.length > 1 ? 'ies' : 'y'} deleted`);
      setSelectedIds([]);
      refetch();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to delete categories');
    }
  };

  const handleSubmit = (data: CategoryFormData) => {
    if (selectedCategory) {
      mutations.update.mutate({ id: selectedCategory.id, data });
      setDialogOpen(false);
      setSelectedCategory(null);
    } else {
      mutations.create.mutate(data);
      setDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  const columns: ColumnDef<Category>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              setSelectedIds(categories?.map((c) => c.id) || []);
            } else {
              setSelectedIds([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            setSelectedIds((prev) =>
              value ? [...prev, row.original.id] : prev.filter((id) => id !== row.original.id),
            );
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Category Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="max-w-md truncate text-muted-foreground">
          {row.original.description || 'No description'}
        </div>
      ),
    },
    {
      accessorKey: 'jobCount',
      header: 'Jobs',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span>{row.original._count?.jobs || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM dd, yyyy'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const category = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEdit(category)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return <LoadingState text="Loading categories..." />;
  }

  if (error) {
    return <ErrorState error="Failed to load categories" retry={refetch} />;
  }

  const totalCategories = categories?.length || 0;
  const categoriesWithJobs = categories?.filter((c) => (c._count?.jobs || 0) > 0).length || 0;
  const totalJobs = categories?.reduce((sum, c) => sum + (c._count?.jobs || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage job categories and classifications</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesWithJobs}</div>
            <p className="text-xs text-muted-foreground">With active jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={categories || []} />
        </CardContent>
      </Card>

      {/* Category Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        onSubmit={handleSubmit}
        isPending={mutations.create.isPending || mutations.update.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category. Jobs in this
              category will not be deleted but will lose their category association.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onDelete={handleBulkDelete}
      />
    </div>
  );
}

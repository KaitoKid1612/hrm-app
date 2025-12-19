'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Eye,
  Download,
  Users,
  UserCog,
  Activity,
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingState, ErrorState } from '@/components/shared/states';
import { UserDialog } from '@/components/users/user-dialog';
import { UserFiltersComponent, type UserFilters } from '@/components/users/user-filters';
import { BulkActionsBar } from '@/components/users/bulk-actions-bar';
import { usersService } from '@/services';
import { useUserMutations } from '@/hooks/use-user-mutations';
import { queryKeys } from '@/lib/query-keys';
import type { User } from '@/types';
import { toast } from 'sonner';
import { exportUsersToCSV, exportUsersToJSON } from '@/lib/export-utils';

export default function UsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 20;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const mutations = useUserMutations();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.users.list({ page, limit, ...filters }),
    queryFn: () =>
      usersService.getAllUsers({
        page,
        limit,
        ...filters,
      }),
  });

  const { data: stats } = useQuery({
    queryKey: queryKeys.users.stats,
    queryFn: () => usersService.getUserStats(),
  });

  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              setSelectedIds(data?.data.map((u) => u.id) || []);
            } else {
              setSelectedIds([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.includes(row.original.id)}
          onCheckedChange={(value) => {
            if (value) {
              setSelectedIds([...selectedIds, row.original.id]);
            } else {
              setSelectedIds(selectedIds.filter((id) => id !== row.original.id));
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">{user.name?.charAt(0)}</span>
              </div>
            )}
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <Badge
            variant={role === 'ADMIN' ? 'default' : role === 'EMPLOYER' ? 'secondary' : 'outline'}
          >
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <Badge variant={isActive ? 'default' : 'destructive'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => row.original.phone || '-',
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM dd, yyyy'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
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
              <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${user.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setDialogOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  mutations.toggleStatus.mutate({
                    id: user.id,
                    status: user.isActive ? 'inactive' : 'active',
                  })
                }
              >
                {user.isActive ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this user?')) {
                    mutations.delete.mutate(user.id);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} retry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">Quản lý tất cả users trong hệ thống</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (data?.data) {
                    exportUsersToCSV(data.data);
                    toast.success('Users exported to CSV');
                  }
                }}
              >
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (data?.data) {
                    exportUsersToJSON(data.data);
                    toast.success('Users exported to JSON');
                  }
                }}
              >
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => {
              setSelectedUser(null);
              setDialogOpen(true);
            }}
          >
            <Shield className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidates</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.candidates || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Looking for opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employers</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.employers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Posting jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>Manage and monitor all users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserFiltersComponent filters={filters} onFiltersChange={setFilters} />

          {data?.data && (
            <>
              <div className="rounded-md border">
                <DataTable columns={columns} data={data.data} showPagination={false} />
              </div>

              {data.pagination && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1} to{' '}
                    {Math.min(page * limit, data.pagination.total)} of {data.pagination.total} users
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= (data.pagination.totalPages || 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <UserDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <BulkActionsBar selectedIds={selectedIds} onClearSelection={() => setSelectedIds([])} />
    </div>
  );
}

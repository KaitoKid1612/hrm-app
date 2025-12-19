'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  FileText,
  User,
  Briefcase,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { ApplicationDialog } from '@/components/applications/application-dialog';
import {
  ApplicationFiltersComponent,
  type ApplicationFilters,
} from '@/components/applications/application-filters';
import { BulkActionsBar } from '@/components/applications/bulk-actions-bar';
import { applicationsService } from '@/services';
import { useApplicationMutations } from '@/hooks/use-application-mutations';
import { queryKeys } from '@/lib/query-keys';
import type { Application } from '@/types';
import { toast } from 'sonner';

export default function ApplicationsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filters, setFilters] = useState<ApplicationFilters>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const mutations = useApplicationMutations();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.applications.list({ page, limit, ...filters }),
    queryFn: () =>
      applicationsService.getApplications({
        page,
        limit,
        ...filters,
      }),
  });

  const { data: stats } = useQuery({
    queryKey: queryKeys.applications.stats,
    queryFn: () => applicationsService.getApplicationStats(),
  });

  const handleEdit = (application: Application) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      mutations.delete.mutate(id);
    }
  };

  const handleAccept = (id: string) => {
    mutations.changeStatus.mutate({ id, status: 'ACCEPTED' });
  };

  const handleReject = (id: string) => {
    mutations.changeStatus.mutate({ id, status: 'REJECTED' });
  };

  const handleExportCSV = () => {
    if (!data?.data) return;
    const csv = convertToCSV(data.data);
    downloadFile(csv, 'applications.csv', 'text/csv');
    toast.success('Exported to CSV');
  };

  const handleExportJSON = () => {
    if (!data?.data) return;
    const json = JSON.stringify(data.data, null, 2);
    downloadFile(json, 'applications.json', 'application/json');
    toast.success('Exported to JSON');
  };

  const convertToCSV = (applications: Application[]) => {
    const headers = [
      'ID',
      'Candidate',
      'Job',
      'Status',
      'Applied Date',
      'Email',
      'Expected Salary',
    ];
    const rows = applications.map((app) => [
      app.id,
      app.user?.name || 'N/A',
      app.job?.title || 'N/A',
      app.status,
      format(new Date(app.appliedAt), 'yyyy-MM-dd'),
      app.user?.email || 'N/A',
      app.expectedSalary || 'N/A',
    ]);
    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color?: string }
    > = {
      PENDING: { variant: 'secondary' },
      REVIEWING: { variant: 'default' },
      SHORTLISTED: { variant: 'default', color: 'bg-blue-500' },
      INTERVIEWED: { variant: 'default', color: 'bg-purple-500' },
      OFFERED: { variant: 'default', color: 'bg-green-500' },
      ACCEPTED: { variant: 'default', color: 'bg-green-600' },
      REJECTED: { variant: 'destructive' },
      WITHDRAWN: { variant: 'outline' },
    };

    const config = variants[status] || { variant: 'default' };
    return (
      <Badge variant={config.variant} className={config.color}>
        {status}
      </Badge>
    );
  };

  const columns: ColumnDef<Application>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              setSelectedIds(data?.data.map((app) => app.id) || []);
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
      accessorKey: 'user',
      header: 'Candidate',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{row.original.user?.name || 'N/A'}</div>
            <div className="text-sm text-muted-foreground">{row.original.user?.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'job',
      header: 'Job',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{row.original.job?.title || 'N/A'}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.job?.company?.name || 'No company'}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'expectedSalary',
      header: 'Expected Salary',
      cell: ({ row }) =>
        row.original.expectedSalary ? `${row.original.expectedSalary.toLocaleString()} VND` : 'N/A',
    },
    {
      accessorKey: 'appliedAt',
      header: 'Applied Date',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(row.original.appliedAt), 'MMM dd, yyyy')}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const application = row.original;

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
              <DropdownMenuItem onClick={() => handleEdit(application)}>
                <Pencil className="mr-2 h-4 w-4" />
                Review
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/applications/${application.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAccept(application.id)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleReject(application.id)}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(application.id)}
                className="text-destructive"
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

  if (error) {
    return <ErrorState error="There was an error loading the applications list." retry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications Management</h1>
          <p className="text-muted-foreground">Theo dõi tất cả đơn ứng tuyển</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportCSV}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviewing</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reviewing}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accepted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <ApplicationFiltersComponent filters={filters} onFiltersChange={setFilters} />

      {/* Data Table */}
      {isLoading ? (
        <LoadingState text="Loading applications..." />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <DataTable columns={columns} data={data?.data || []} showPagination={false} />

            {/* Custom Pagination */}
            {data?.pagination && (
              <div className="flex items-center justify-between px-2 mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {Math.min((page - 1) * limit + 1, data.pagination.total)} to{' '}
                  {Math.min(page * limit, data.pagination.total)} of {data.pagination.total}{' '}
                  applications
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {page} of {data.pagination.totalPages || 1}
                  </span>
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
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      <BulkActionsBar selectedIds={selectedIds} onClearSelection={() => setSelectedIds([])} />

      {/* Application Dialog */}
      <ApplicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        application={selectedApplication}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  XCircle,
  CheckCircle,
  Plus,
  Download,
  Briefcase,
  Building2,
  Users,
  Flame,
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
import { JobDialog } from '@/components/jobs/job-dialog';
import { JobFiltersComponent, type JobFilters } from '@/components/jobs/job-filters';
import { BulkActionsBar } from '@/components/jobs/bulk-actions-bar';
import { jobsService } from '@/services';
import { useJobMutations } from '@/hooks/use-job-mutations';
import { queryKeys } from '@/lib/query-keys';
import type { Job } from '@/types';
import { toast } from 'sonner';

export default function JobsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const mutations = useJobMutations();

  // Fetch jobs
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.jobs.list({ page, limit, ...filters }),
    queryFn: () =>
      jobsService.getAllJobs({
        page,
        limit,
        ...filters,
      }),
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: queryKeys.jobs.stats,
    queryFn: () => jobsService.getJobStats(),
  });

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      mutations.delete.mutate(id);
    }
  };

  const handleCloseJob = (id: string) => {
    mutations.close.mutate(id);
  };

  const handleReopenJob = (id: string) => {
    mutations.reopen.mutate(id);
  };

  const handleExportCSV = () => {
    if (!data?.data) return;
    const csv = convertToCSV(data.data);
    downloadFile(csv, 'jobs.csv', 'text/csv');
    toast.success('Exported to CSV');
  };

  const handleExportJSON = () => {
    if (!data?.data) return;
    const json = JSON.stringify(data.data, null, 2);
    downloadFile(json, 'jobs.json', 'application/json');
    toast.success('Exported to JSON');
  };

  const convertToCSV = (jobs: Job[]) => {
    const headers = ['ID', 'Title', 'Company', 'Type', 'Level', 'Status', 'Location', 'Created'];
    const rows = jobs.map((job) => [
      job.id,
      job.title,
      job.company?.name || 'N/A',
      job.type,
      job.level,
      job.status,
      job.location || 'N/A',
      format(new Date(job.createdAt), 'yyyy-MM-dd'),
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
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      PUBLISHED: 'default',
      DRAFT: 'secondary',
      CLOSED: 'destructive',
      ARCHIVED: 'outline',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const columns: ColumnDef<Job>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              setSelectedIds(data?.data.map((job) => job.id) || []);
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
      accessorKey: 'title',
      header: 'Job Title',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-medium">{row.original.title}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.company?.name || 'No company'}
            </div>
          </div>
          {row.original.isHot && <Flame className="h-4 w-4 text-orange-500" />}
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.type?.replace('_', ' ') || 'N/A'}</Badge>
      ),
    },
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.level?.replace('_', ' ') || 'N/A'}</Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.original.location || 'Remote',
    },
    {
      accessorKey: 'applicationCount',
      header: 'Applications',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{row.original._count?.applications || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: 'viewCount',
      header: 'Views',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.viewCount || 0}</span>
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
        const job = row.original;

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
              <DropdownMenuItem onClick={() => handleEdit(job)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/jobs/${job.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {job.status === 'CLOSED' ? (
                <DropdownMenuItem onClick={() => handleReopenJob(job.id)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Reopen
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleCloseJob(job.id)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Close
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(job.id)} className="text-destructive">
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
    return <ErrorState error="There was an error loading the jobs list." retry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs Management</h1>
          <p className="text-muted-foreground">Quản lý tất cả công việc được đăng</p>
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
          <Button
            onClick={() => {
              setSelectedJob(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed Jobs</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.closed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Jobs</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draft}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <JobFiltersComponent filters={filters} onFiltersChange={setFilters} />

      {/* Data Table */}
      {isLoading ? (
        <LoadingState text="Loading jobs..." />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <DataTable columns={columns} data={data?.data || []} showPagination={false} />

            {/* Custom Pagination */}
            {data?.pagination && (
              <div className="flex items-center justify-between px-2 mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {Math.min((page - 1) * limit + 1, data.pagination.total)} to{' '}
                  {Math.min(page * limit, data.pagination.total)} of {data.pagination.total} jobs
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

      {/* Job Dialog */}
      <JobDialog open={dialogOpen} onOpenChange={setDialogOpen} job={selectedJob} />
    </div>
  );
}

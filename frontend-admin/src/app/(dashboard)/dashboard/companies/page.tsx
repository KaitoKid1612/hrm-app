'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle,
  Star,
  Building2,
  Plus,
  Download,
  Users,
  Briefcase,
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
import { CompanyDialog } from '@/components/companies/company-dialog';
import {
  CompanyFiltersComponent,
  type CompanyFilters,
} from '@/components/companies/company-filters';
import { BulkActionsBar } from '@/components/companies/bulk-actions-bar';
import { companiesService } from '@/services';
import { useCompanyMutations } from '@/hooks/use-company-mutations';
import { queryKeys } from '@/lib/query-keys';
import { exportCompaniesToCSV, exportCompaniesToJSON } from '@/lib/export-utils';
import type { Company } from '@/types';
import { toast } from 'sonner';

export default function CompaniesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [filters, setFilters] = useState<CompanyFilters>({});

  const mutations = useCompanyMutations();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.companies.list({ page, limit, ...filters }),
    queryFn: () =>
      companiesService.getAllCompanies({
        page,
        limit,
        ...filters,
      }),
  });

  const { data: stats } = useQuery({
    queryKey: queryKeys.companies.stats,
    queryFn: () => companiesService.getCompanyStats(),
  });

  // Handle export
  const handleExport = (format: 'csv' | 'json') => {
    if (!data?.data) return;
    if (format === 'csv') {
      exportCompaniesToCSV(data.data);
    } else {
      exportCompaniesToJSON(data.data);
    }
    toast.success(`Exported ${data.data.length} companies to ${format.toUpperCase()}`);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked && data?.data) {
      setSelectedCompanies(data.data.map((company) => company.id));
    } else {
      setSelectedCompanies([]);
    }
  };

  // Handle single select
  const handleSelectCompany = (companyId: string, checked: boolean) => {
    if (checked) {
      setSelectedCompanies((prev) => [...prev, companyId]);
    } else {
      setSelectedCompanies((prev) => prev.filter((id) => id !== companyId));
    }
  };

  // Handle edit
  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingCompany(null);
    }
  };

  const columns: ColumnDef<Company>[] = [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={
            data?.data && data.data.length > 0 && selectedCompanies.length === data.data.length
          }
          onCheckedChange={(value) => handleSelectAll(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedCompanies.includes(row.original.id)}
          onCheckedChange={(value) => handleSelectCompany(row.original.id, !!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Company',
      cell: ({ row }) => {
        const company = row.original;
        return (
          <Link
            href={`/dashboard/companies/${company.id}`}
            className="flex items-center gap-3 hover:underline"
          >
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-10 w-10 rounded object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <div className="font-medium">{company.name}</div>
              {company.website && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {new URL(company.website).hostname}
                </span>
              )}
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.type;
        return type ? <Badge variant="outline">{type}</Badge> : '-';
      },
    },
    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ row }) => {
        const size = row.original.size;
        return size ? (
          <span className="text-sm flex items-center gap-1">
            <Users className="h-3 w-3" />
            {size}
          </span>
        ) : (
          '-'
        );
      },
    },
    {
      accessorKey: 'industry',
      header: 'Industry',
      cell: ({ row }) => row.original.industry || '-',
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.original.location || '-',
    },
    {
      accessorKey: 'isVerified',
      header: 'Status',
      cell: ({ row }) => {
        const isVerified = row.original.isVerified;
        return (
          <div className="flex items-center gap-2">
            <Badge variant={isVerified ? 'default' : 'secondary'}>
              {isVerified ? 'Verified' : 'Pending'}
            </Badge>
            {row.original.isFeatured && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: '_count',
      header: 'Jobs',
      cell: ({ row }) => {
        const count = row.original._count?.jobs || 0;
        return (
          <span className="text-sm flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {count}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM dd, yyyy'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const company = row.original;
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
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/companies/${company.id}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(company.id)}>
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEdit(company)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Company
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this company?')) {
                    mutations.delete.mutate(company.id);
                    setSelectedCompanies((prev) => prev.filter((id) => id !== company.id));
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

  const totalPages = data?.pagination
    ? Math.ceil(data.pagination.total / data.pagination.limit)
    : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies Management</h1>
          <p className="text-muted-foreground">Quản lý và xác minh các công ty</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>Export to CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                Export to JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">All registered companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.verified || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.total ? ((stats.verified / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.featured || 0}</div>
            <p className="text-xs text-muted-foreground">Premium listings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CompanyFiltersComponent filters={filters} onFiltersChange={setFilters} />

          {data?.data && <DataTable columns={columns} data={data.data} showPagination={false} />}

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {data?.data?.length || 0} of {data?.pagination?.total || 0} companies
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CompanyDialog open={dialogOpen} onOpenChange={handleDialogClose} company={editingCompany} />
      <BulkActionsBar
        selectedCompanies={selectedCompanies}
        onClearSelection={() => setSelectedCompanies([])}
      />
    </div>
  );
}

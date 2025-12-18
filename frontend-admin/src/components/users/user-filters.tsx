'use client';

import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserRole, UserStatus } from '@/types';

export interface UserFilters {
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
  isActive?: boolean;
}

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

export function UserFiltersComponent({ filters, onFiltersChange }: UserFiltersProps) {
  const updateFilter = (key: keyof UserFilters, value: string | boolean | undefined) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof UserFilters] !== undefined,
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, or phone..."
            value={filters.keyword || ''}
            onChange={(e) => updateFilter('keyword', e.target.value || undefined)}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.role === 'CANDIDATE'}
              onCheckedChange={(checked) => updateFilter('role', checked ? 'CANDIDATE' : undefined)}
            >
              Candidate
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.role === 'EMPLOYER'}
              onCheckedChange={(checked) => updateFilter('role', checked ? 'EMPLOYER' : undefined)}
            >
              Employer
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.role === 'ADMIN'}
              onCheckedChange={(checked) => updateFilter('role', checked ? 'ADMIN' : undefined)}
            >
              Admin
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.status === 'ACTIVE'}
              onCheckedChange={(checked) => updateFilter('status', checked ? 'ACTIVE' : undefined)}
            >
              Active
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status === 'INACTIVE'}
              onCheckedChange={(checked) =>
                updateFilter('status', checked ? 'INACTIVE' : undefined)
              }
            >
              Inactive
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status === 'SUSPENDED'}
              onCheckedChange={(checked) =>
                updateFilter('status', checked ? 'SUSPENDED' : undefined)
              }
            >
              Suspended
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status === 'BANNED'}
              onCheckedChange={(checked) => updateFilter('status', checked ? 'BANNED' : undefined)}
            >
              Banned
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Account Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.isActive === true}
              onCheckedChange={(checked) => updateFilter('isActive', checked ? true : undefined)}
            >
              Active Accounts
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.isActive === false}
              onCheckedChange={(checked) => updateFilter('isActive', checked ? false : undefined)}
            >
              Inactive Accounts
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.keyword && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.keyword}
              <button
                onClick={() => updateFilter('keyword', undefined)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.role && (
            <Badge variant="secondary" className="gap-1">
              Role: {filters.role}
              <button
                onClick={() => updateFilter('role', undefined)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <button
                onClick={() => updateFilter('status', undefined)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.isActive !== undefined && (
            <Badge variant="secondary" className="gap-1">
              {filters.isActive ? 'Active Accounts' : 'Inactive Accounts'}
              <button
                onClick={() => updateFilter('isActive', undefined)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

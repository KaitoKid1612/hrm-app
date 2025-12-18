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
import type { CompanyType, CompanySize } from '@/types';

export interface CompanyFilters {
  keyword?: string;
  type?: CompanyType;
  size?: CompanySize;
  isVerified?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
}

interface CompanyFiltersProps {
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
}

export function CompanyFiltersComponent({ filters, onFiltersChange }: CompanyFiltersProps) {
  const updateFilter = (key: keyof CompanyFilters, value: string | boolean | undefined) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof CompanyFilters] !== undefined,
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies by name, industry, or location..."
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
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.type === 'COMPANY'}
              onCheckedChange={(checked) => updateFilter('type', checked ? 'COMPANY' : undefined)}
            >
              Company
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.type === 'STARTUP'}
              onCheckedChange={(checked) => updateFilter('type', checked ? 'STARTUP' : undefined)}
            >
              Startup
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.type === 'SMALL_BUSINESS'}
              onCheckedChange={(checked) =>
                updateFilter('type', checked ? 'SMALL_BUSINESS' : undefined)
              }
            >
              Small Business
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.type === 'CORPORATION'}
              onCheckedChange={(checked) =>
                updateFilter('type', checked ? 'CORPORATION' : undefined)
              }
            >
              Corporation
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.type === 'HEADHUNTER'}
              onCheckedChange={(checked) =>
                updateFilter('type', checked ? 'HEADHUNTER' : undefined)
              }
            >
              Headhunter
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Size</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.size === '1-10'}
              onCheckedChange={(checked) => updateFilter('size', checked ? '1-10' : undefined)}
            >
              1-10 employees
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.size === '11-50'}
              onCheckedChange={(checked) => updateFilter('size', checked ? '11-50' : undefined)}
            >
              11-50 employees
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.size === '51-200'}
              onCheckedChange={(checked) => updateFilter('size', checked ? '51-200' : undefined)}
            >
              51-200 employees
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.size === '501-1000'}
              onCheckedChange={(checked) => updateFilter('size', checked ? '501-1000' : undefined)}
            >
              501-1000 employees
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.size === '5000+'}
              onCheckedChange={(checked) => updateFilter('size', checked ? '5000+' : undefined)}
            >
              5000+ employees
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.isVerified === true}
              onCheckedChange={(checked) => updateFilter('isVerified', checked ? true : undefined)}
            >
              Verified Only
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.isFeatured === true}
              onCheckedChange={(checked) => updateFilter('isFeatured', checked ? true : undefined)}
            >
              Featured Only
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.isActive === true}
              onCheckedChange={(checked) => updateFilter('isActive', checked ? true : undefined)}
            >
              Active Only
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
          {filters.type && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.type}
              <button
                onClick={() => updateFilter('type', undefined)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.size && (
            <Badge variant="secondary" className="gap-1">
              Size: {filters.size}
              <button
                onClick={() => updateFilter('size', undefined)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.isVerified !== undefined && (
            <Badge variant="secondary" className="gap-1">
              Verified Only
              <button
                onClick={() => updateFilter('isVerified', undefined)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.isFeatured !== undefined && (
            <Badge variant="secondary" className="gap-1">
              Featured Only
              <button
                onClick={() => updateFilter('isFeatured', undefined)}
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

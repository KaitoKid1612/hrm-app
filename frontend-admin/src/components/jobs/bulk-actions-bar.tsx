'use client';

import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, XCircle, Archive } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsService } from '@/services';
import type { BulkAction } from '@/types';

interface BulkActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export function BulkActionsBar({ selectedIds, onClearSelection }: BulkActionsBarProps) {
  const queryClient = useQueryClient();

  const bulkActionMutation = useMutation({
    mutationFn: ({ action, ids }: { action: BulkAction; ids: string[] }) =>
      jobsService.bulkAction({ action, ids }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job-stats'] });
      toast.success(`Đã ${getActionLabel(variables.action)} ${variables.ids.length} công việc`);
      onClearSelection();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Thao tác thất bại');
    },
  });

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'publish':
        return 'xuất bản';
      case 'close':
        return 'đóng';
      case 'archive':
        return 'lưu trữ';
      case 'delete':
        return 'xóa';
      default:
        return action;
    }
  };

  const handleBulkAction = (action: BulkAction) => {
    if (action === 'delete') {
      if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.length} công việc?`)) {
        return;
      }
    }
    bulkActionMutation.mutate({ action, ids: selectedIds });
  };

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4">
        <span className="text-sm font-medium">Đã chọn {selectedIds.length} công việc</span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('publish')}
            disabled={bulkActionMutation.isPending}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Xuất bản
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('close')}
            disabled={bulkActionMutation.isPending}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Đóng
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('archive')}
            disabled={bulkActionMutation.isPending}
          >
            <Archive className="mr-2 h-4 w-4" />
            Lưu trữ
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleBulkAction('delete')}
            disabled={bulkActionMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={bulkActionMutation.isPending}
        >
          Hủy
        </Button>
      </div>
    </div>
  );
}

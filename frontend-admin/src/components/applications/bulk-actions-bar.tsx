'use client';

import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsService } from '@/services';
import type { ApplicationStatus } from '@/types';

interface BulkActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export function BulkActionsBar({ selectedIds, onClearSelection }: BulkActionsBarProps) {
  const queryClient = useQueryClient();

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => applicationsService.deleteApplication(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-stats'] });
      toast.success(`Đã xóa ${selectedIds.length} đơn ứng tuyển`);
      onClearSelection();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Thao tác thất bại');
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: ApplicationStatus }) => {
      await Promise.all(ids.map((id) => applicationsService.changeStatus(id, status)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-stats'] });
      toast.success(`Đã cập nhật ${selectedIds.length} đơn ứng tuyển`);
      onClearSelection();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Thao tác thất bại');
    },
  });

  const handleBulkDelete = () => {
    if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.length} đơn ứng tuyển?`)) {
      return;
    }
    bulkDeleteMutation.mutate(selectedIds);
  };

  const handleBulkStatus = (status: ApplicationStatus) => {
    bulkStatusMutation.mutate({ ids: selectedIds, status });
  };

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4">
        <span className="text-sm font-medium">Đã chọn {selectedIds.length} đơn ứng tuyển</span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatus('REVIEWING')}
            disabled={bulkStatusMutation.isPending}
          >
            <Eye className="mr-2 h-4 w-4" />
            Đang xem xét
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatus('ACCEPTED')}
            disabled={bulkStatusMutation.isPending}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Chấp nhận
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatus('REJECTED')}
            disabled={bulkStatusMutation.isPending}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Từ chối
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={bulkDeleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={bulkDeleteMutation.isPending || bulkStatusMutation.isPending}
        >
          Hủy
        </Button>
      </div>
    </div>
  );
}

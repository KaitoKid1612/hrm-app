'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { usersService } from '@/services';
import { toast } from 'sonner';

interface BulkActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export function BulkActionsBar({ selectedIds, onClearSelection }: BulkActionsBarProps) {
  const queryClient = useQueryClient();
  const [actionType, setActionType] = useState<'delete' | 'activate' | 'deactivate' | null>(null);

  const bulkMutation = useMutation({
    mutationFn: (data: { action: 'activate' | 'deactivate' | 'delete'; ids: string[] }) =>
      usersService.bulkAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users-stats'] });
      toast.success('Bulk action completed successfully');
      onClearSelection();
      setActionType(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to perform bulk action');
      setActionType(null);
    },
  });

  const handleBulkAction = (action: 'delete' | 'activate' | 'deactivate') => {
    setActionType(action);
  };

  const confirmBulkAction = () => {
    if (!actionType) return;

    bulkMutation.mutate({
      action: actionType,
      ids: selectedIds,
    });
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-background border rounded-lg shadow-lg px-4 py-3 flex items-center gap-4">
          <span className="text-sm font-medium">
            {selectedIds.length} user{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('activate')}
              disabled={bulkMutation.isPending}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Activate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('deactivate')}
              disabled={bulkMutation.isPending}
            >
              <UserX className="mr-2 h-4 w-4" />
              Deactivate
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleBulkAction('delete')}
              disabled={bulkMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
          <div className="h-4 w-px bg-border" />
          <Button size="sm" variant="ghost" onClick={onClearSelection}>
            Clear
          </Button>
        </div>
      </div>

      <AlertDialog open={!!actionType} onOpenChange={() => setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'delete' && (
                <>
                  This will permanently delete {selectedIds.length} user
                  {selectedIds.length > 1 ? 's' : ''}. This action cannot be undone.
                </>
              )}
              {actionType === 'activate' && (
                <>
                  This will activate {selectedIds.length} user
                  {selectedIds.length > 1 ? 's' : ''}.
                </>
              )}
              {actionType === 'deactivate' && (
                <>
                  This will deactivate {selectedIds.length} user
                  {selectedIds.length > 1 ? 's' : ''}.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkAction}
              className={actionType === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {bulkMutation.isPending ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

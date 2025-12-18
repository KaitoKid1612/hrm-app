'use client';

import { useState } from 'react';
import { CheckCircle, Star, Trash2, X } from 'lucide-react';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesService } from '@/services/companies.service';
import { toast } from 'sonner';

interface BulkActionsBarProps {
  selectedCompanies: string[];
  onClearSelection: () => void;
}

export function BulkActionsBar({ selectedCompanies, onClearSelection }: BulkActionsBarProps) {
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [featureDialogOpen, setFeatureDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const verifyMutation = useMutation({
    mutationFn: () =>
      companiesService.bulkAction({
        ids: selectedCompanies,
        action: 'verify',
      }),
    onSuccess: () => {
      toast.success(`Verified ${selectedCompanies.length} companies`);
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      onClearSelection();
      setVerifyDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to verify companies');
    },
  });

  const featureMutation = useMutation({
    mutationFn: () =>
      companiesService.bulkAction({
        ids: selectedCompanies,
        action: 'feature',
      }),
    onSuccess: () => {
      toast.success(`Featured ${selectedCompanies.length} companies`);
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      onClearSelection();
      setFeatureDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to feature companies');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      companiesService.bulkAction({
        ids: selectedCompanies,
        action: 'delete',
      }),
    onSuccess: () => {
      toast.success(`Deleted ${selectedCompanies.length} companies`);
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      onClearSelection();
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to delete companies');
    },
  });

  if (selectedCompanies.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
        <div className="rounded-lg border bg-background px-4 py-3 shadow-lg">
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium">
              {selectedCompanies.length} {selectedCompanies.length === 1 ? 'company' : 'companies'}{' '}
              selected
            </p>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => setVerifyDialogOpen(true)}
              >
                <CheckCircle className="h-4 w-4" />
                Verify
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => setFeatureDialogOpen(true)}
              >
                <Star className="h-4 w-4" />
                Feature
              </Button>

              <Button
                size="sm"
                variant="destructive"
                className="gap-2"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>

              <div className="mx-2 h-6 w-px bg-border" />

              <Button size="sm" variant="ghost" onClick={onClearSelection}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Companies</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to verify {selectedCompanies.length}{' '}
              {selectedCompanies.length === 1 ? 'company' : 'companies'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => verifyMutation.mutate()}>
              {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={featureDialogOpen} onOpenChange={setFeatureDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Feature Companies</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to feature {selectedCompanies.length}{' '}
              {selectedCompanies.length === 1 ? 'company' : 'companies'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => featureMutation.mutate()}>
              {featureMutation.isPending ? 'Featuring...' : 'Feature'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Companies</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCompanies.length}{' '}
              {selectedCompanies.length === 1 ? 'company' : 'companies'}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

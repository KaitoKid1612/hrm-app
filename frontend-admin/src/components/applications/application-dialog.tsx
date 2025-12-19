'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { applicationsService } from '@/services';
import type { Application, ApplicationStatus } from '@/types';

interface ApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: Application | null;
}

interface ApplicationFormData {
  status: ApplicationStatus;
  notes?: string;
}

export function ApplicationDialog({ open, onOpenChange, application }: ApplicationDialogProps) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, watch } = useForm<ApplicationFormData>({
    defaultValues: {
      status: 'PENDING',
      notes: '',
    },
  });

  const status = watch('status');

  useEffect(() => {
    if (application) {
      reset({
        status: application.status,
        notes: application.notes || '',
      });
    } else {
      reset();
    }
  }, [application, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      if (!application) {
        throw new Error('No application selected');
      }
      return applicationsService.updateApplication(application.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-stats'] });
      toast.success('Application updated successfully');
      onOpenChange(false);
      reset();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to update application');
    },
  });

  const onSubmit = (data: ApplicationFormData) => {
    mutation.mutate(data);
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Application</DialogTitle>
          <DialogDescription>Update application status and notes</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Application Info */}
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Candidate:</span> {application.user?.name || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Job:</span> {application.job?.title || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Applied:</span>{' '}
                {new Date(application.appliedAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Current Status:</span>{' '}
                <span className="font-semibold">{application.status}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setValue('status', e.target.value as ApplicationStatus)}
            >
              <option value="PENDING">Pending</option>
              <option value="REVIEWING">Reviewing</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEWED">Interviewed</option>
              <option value="OFFERED">Offered</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this application..."
              rows={4}
              {...register('notes')}
            />
          </div>

          {/* Cover Letter Preview */}
          {application.coverLetter && (
            <div className="space-y-2">
              <Label>Cover Letter</Label>
              <div className="p-3 bg-muted rounded-md max-h-40 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">{application.coverLetter}</p>
              </div>
            </div>
          )}

          {/* Resume & Portfolio Links */}
          <div className="space-y-2">
            <Label>Documents</Label>
            <div className="flex flex-col gap-2 text-sm">
              {application.resumeUrl && (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  📄 View Resume
                </a>
              )}
              {application.portfolioUrl && (
                <a
                  href={application.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  🌐 View Portfolio
                </a>
              )}
              {application.linkedInUrl && (
                <a
                  href={application.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  💼 LinkedIn Profile
                </a>
              )}
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Update Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

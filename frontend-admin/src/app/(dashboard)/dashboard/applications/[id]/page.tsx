'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  ArrowLeft,
  User,
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Globe,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingState, ErrorState } from '@/components/shared/states';
import { applicationsService } from '@/services';
import Link from 'next/link';
import { useState } from 'react';
import { ApplicationDialog } from '@/components/applications/application-dialog';
import { useApplicationMutations } from '@/hooks/use-application-mutations';

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const mutations = useApplicationMutations();

  // Fetch application details
  const {
    data: application,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['application', params.id],
    queryFn: () => applicationsService.getApplicationById(params.id),
  });

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this application?')) {
      mutations.delete.mutate(params.id, {
        onSuccess: () => router.push('/dashboard/applications'),
      });
    }
  };

  const handleAccept = () => {
    mutations.changeStatus.mutate({ id: params.id, status: 'ACCEPTED' });
  };

  const handleReject = () => {
    mutations.changeStatus.mutate({ id: params.id, status: 'REJECTED' });
  };

  if (isLoading) {
    return <LoadingState text="Loading application details..." />;
  }

  if (error || !application) {
    return (
      <ErrorState error="The application you're looking for doesn't exist or has been removed." />
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/applications">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Application Details</h1>
            <p className="text-muted-foreground">
              {application.user?.name} - {application.job?.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Update
          </Button>
          <Button
            onClick={handleAccept}
            disabled={mutations.changeStatus.isPending || application.status === 'ACCEPTED'}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Accept
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={mutations.changeStatus.isPending || application.status === 'REJECTED'}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={mutations.delete.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">{getStatusBadge(application.status)}</div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Candidate Info */}
          <Card>
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{application.user?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{application.user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{application.user?.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{application.user?.city || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Info */}
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Job Title</p>
                    <p className="font-medium">{application.job?.title || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{application.job?.company?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{application.job?.location || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Job Salary</p>
                    <p className="font-medium">
                      {application.job?.salaryMin && application.job?.salaryMax
                        ? `${application.job.salaryMin.toLocaleString()} - ${application.job.salaryMax.toLocaleString()}`
                        : 'Negotiable'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Details */}
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Expected Salary</p>
                  <p className="font-medium">
                    {application.expectedSalary
                      ? `${application.expectedSalary.toLocaleString()} VND`
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Notice Period</p>
                  <p className="font-medium">{application.noticePeriod || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Availability</p>
                  <p className="font-medium">{application.availability || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Willing to Relocate</p>
                  <p className="font-medium">{application.willingToRelocate ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cover Letter */}
          {application.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle>Cover Letter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          {application.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{application.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {application.resumeUrl && (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  View Resume
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {application.portfolioUrl && (
                <a
                  href={application.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Portfolio
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {application.linkedInUrl && (
                <a
                  href={application.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <User className="h-4 w-4" />
                  LinkedIn Profile
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {!application.resumeUrl && !application.portfolioUrl && !application.linkedInUrl && (
                <p className="text-sm text-muted-foreground">No documents attached</p>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Applied</p>
                <p className="font-medium">{format(new Date(application.appliedAt), 'PPP')}</p>
              </div>
              {application.reviewedAt && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground">Reviewed</p>
                    <p className="font-medium">{format(new Date(application.reviewedAt), 'PPP')}</p>
                  </div>
                </>
              )}
              {application.shortlistedAt && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground">Shortlisted</p>
                    <p className="font-medium">
                      {format(new Date(application.shortlistedAt), 'PPP')}
                    </p>
                  </div>
                </>
              )}
              {application.interviewedAt && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground">Interviewed</p>
                    <p className="font-medium">
                      {format(new Date(application.interviewedAt), 'PPP')}
                    </p>
                  </div>
                </>
              )}
              {application.acceptedAt && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground">Accepted</p>
                    <p className="font-medium">{format(new Date(application.acceptedAt), 'PPP')}</p>
                  </div>
                </>
              )}
              {application.rejectedAt && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground">Rejected</p>
                    <p className="font-medium">{format(new Date(application.rejectedAt), 'PPP')}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{format(new Date(application.createdAt), 'PPP')}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(new Date(application.updatedAt), 'PPP')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <ApplicationDialog open={dialogOpen} onOpenChange={setDialogOpen} application={application} />
    </div>
  );
}

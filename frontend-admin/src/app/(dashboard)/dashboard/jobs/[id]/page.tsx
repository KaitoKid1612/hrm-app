'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Eye,
  Users,
  Edit,
  Trash2,
  XCircle,
  CheckCircle,
  Flame,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingState, ErrorState } from '@/components/shared/states';
import { jobsService } from '@/services';
import Link from 'next/link';
import { useState } from 'react';
import { JobDialog } from '@/components/jobs/job-dialog';
import { useJobMutations } from '@/hooks/use-job-mutations';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const mutations = useJobMutations();

  // Fetch job details
  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['job', params.id],
    queryFn: () => jobsService.getJobById(params.id),
  });

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this job?')) {
      mutations.delete.mutate(params.id, {
        onSuccess: () => router.push('/dashboard/jobs'),
      });
    }
  };

  const handleClose = () => {
    mutations.close.mutate(params.id);
  };

  const handleReopen = () => {
    mutations.reopen.mutate(params.id);
  };

  if (isLoading) {
    return <LoadingState text="Loading job details..." />;
  }

  if (error || !job) {
    return <ErrorState error="The job you're looking for doesn't exist or has been removed." />;
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      PUBLISHED: 'default',
      DRAFT: 'secondary',
      CLOSED: 'destructive',
      ARCHIVED: 'outline',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/jobs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
            <p className="text-muted-foreground">Job Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {job.status === 'CLOSED' ? (
            <Button onClick={handleReopen} disabled={mutations.reopen.isPending}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Reopen
            </Button>
          ) : (
            <Button onClick={handleClose} disabled={mutations.close.isPending}>
              <XCircle className="mr-2 h-4 w-4" />
              Close
            </Button>
          )}
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

      {/* Status & Badges */}
      <div className="flex items-center gap-2">
        {getStatusBadge(job.status)}
        <Badge variant="outline">{job.type?.replace('_', ' ') || 'N/A'}</Badge>
        <Badge variant="secondary">{job.level?.replace('_', ' ') || 'N/A'}</Badge>
        {job.isHot && (
          <Badge variant="destructive">
            <Flame className="mr-1 h-3 w-3" />
            Hot Job
          </Badge>
        )}
        {job.isActive && <Badge variant="default">Active</Badge>}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Job Info */}
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{job.company?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{job.location || 'Remote'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Work Mode</p>
                    <p className="font-medium">{job.workMode || 'Onsite'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="font-medium">
                      {job.salaryMin && job.salaryMax
                        ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${job.salaryCurrency || 'VND'}`
                        : job.salaryType || 'Negotiable'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="font-medium">
                      {job.deadline ? format(new Date(job.deadline), 'MMM dd, yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Positions</p>
                    <p className="font-medium">{job.positions || 1}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {job.requirements && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{job.requirements}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Responsibilities */}
          {job.responsibilities && (
            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{job.responsibilities}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{job.benefits}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Views</span>
                </div>
                <span className="font-semibold">{job.viewCount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Applications</span>
                </div>
                <span className="font-semibold">{job._count?.applications || 0}</span>
              </div>
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
                <p className="font-medium">{format(new Date(job.createdAt), 'PPP')}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(new Date(job.updatedAt), 'PPP')}</p>
              </div>
              {job.publishedAt && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground">Published</p>
                    <p className="font-medium">{format(new Date(job.publishedAt), 'PPP')}</p>
                  </div>
                </>
              )}
              {job.closedAt && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground">Closed</p>
                    <p className="font-medium">{format(new Date(job.closedAt), 'PPP')}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Category & Skills */}
          {(job.category || job.skills) && (
            <Card>
              <CardHeader>
                <CardTitle>Category & Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.category && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Category</p>
                    <Badge>{job.category.name}</Badge>
                  </div>
                )}
                {job.skills && job.skills.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill.id} variant="outline">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <JobDialog open={dialogOpen} onOpenChange={setDialogOpen} job={job} />
    </div>
  );
}

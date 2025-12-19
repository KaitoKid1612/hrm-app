import { Badge } from '@/components/ui/badge';

export const JOB_STATUS_CONFIG = {
  PUBLISHED: { variant: 'default' as const, label: 'Published' },
  DRAFT: { variant: 'secondary' as const, label: 'Draft' },
  CLOSED: { variant: 'destructive' as const, label: 'Closed' },
  ARCHIVED: { variant: 'outline' as const, label: 'Archived' },
} as const;

export const APPLICATION_STATUS_CONFIG = {
  PENDING: { variant: 'outline' as const, label: 'Pending', color: 'text-yellow-600' },
  REVIEWING: { variant: 'secondary' as const, label: 'Reviewing', color: 'text-blue-600' },
  SHORTLISTED: { variant: 'default' as const, label: 'Shortlisted', color: 'text-purple-600' },
  INTERVIEWED: { variant: 'default' as const, label: 'Interviewed', color: 'text-indigo-600' },
  OFFERED: { variant: 'default' as const, label: 'Offered', color: 'text-green-600' },
  ACCEPTED: { variant: 'default' as const, label: 'Accepted', color: 'text-emerald-600' },
  REJECTED: { variant: 'destructive' as const, label: 'Rejected', color: 'text-red-600' },
  WITHDRAWN: { variant: 'outline' as const, label: 'Withdrawn', color: 'text-gray-600' },
} as const;

type JobStatus = keyof typeof JOB_STATUS_CONFIG;
type ApplicationStatus = keyof typeof APPLICATION_STATUS_CONFIG;
type StatusVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface StatusConfig {
  variant: StatusVariant;
  label: string;
  color?: string;
}

interface StatusBadgeProps {
  status: JobStatus | ApplicationStatus;
  config: typeof JOB_STATUS_CONFIG | typeof APPLICATION_STATUS_CONFIG;
}

export const StatusBadge = ({ status, config }: StatusBadgeProps) => {
  const statusConfig = config[status as keyof typeof config] as StatusConfig | undefined;

  if (!statusConfig) {
    return <Badge>{status}</Badge>;
  }

  return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
};

export const getJobStatusBadge = (status: JobStatus) => (
  <StatusBadge status={status} config={JOB_STATUS_CONFIG} />
);

export const getApplicationStatusBadge = (status: ApplicationStatus) => (
  <StatusBadge status={status} config={APPLICATION_STATUS_CONFIG} />
);

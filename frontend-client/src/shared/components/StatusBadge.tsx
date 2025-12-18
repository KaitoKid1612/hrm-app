import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { APPLICATION_STATUS_CONFIG, INTERVIEW_STATUS_CONFIG } from '../constants/status';
import type { ApplicationStatus, InterviewStatus } from '../constants/status';

interface StatusBadgeProps {
  status: ApplicationStatus | InterviewStatus;
  type?: 'application' | 'interview';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'application',
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const config =
    type === 'application'
      ? APPLICATION_STATUS_CONFIG[status as ApplicationStatus]
      : INTERVIEW_STATUS_CONFIG[status as InterviewStatus];

  if (!config) return null;

  const Icon = config.icon as LucideIcon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.color} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon className="w-4 h-4" />}
      {config.label}
    </span>
  );
};

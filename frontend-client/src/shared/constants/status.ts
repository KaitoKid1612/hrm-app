import {
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  type LucideIcon,
} from 'lucide-react';

// Application Status Configuration
export const APPLICATION_STATUS_CONFIG = {
  PENDING: {
    label: 'Đang chờ',
    icon: Clock,
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
    textColor: 'text-yellow-600',
    bgLight: 'bg-yellow-50',
  },
  REVIEWING: {
    label: 'Đang xem xét',
    icon: AlertCircle,
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    textColor: 'text-blue-600',
    bgLight: 'bg-blue-50',
  },
  SHORTLISTED: {
    label: 'Đã lọc',
    icon: CheckCircle2,
    color: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-200',
    textColor: 'text-green-600',
    bgLight: 'bg-green-50',
  },
  INTERVIEWED: {
    label: 'Đã phỏng vấn',
    icon: Eye,
    color: 'text-purple-700',
    bg: 'bg-purple-100',
    border: 'border-purple-200',
    textColor: 'text-purple-600',
    bgLight: 'bg-purple-50',
  },
  ACCEPTED: {
    label: 'Đã chấp nhận',
    icon: CheckCircle2,
    color: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-200',
    textColor: 'text-green-600',
    bgLight: 'bg-green-50',
  },
  REJECTED: {
    label: 'Từ chối',
    icon: XCircle,
    color: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-200',
    textColor: 'text-red-600',
    bgLight: 'bg-red-50',
  },
  WITHDRAWN: {
    label: 'Rút đơn',
    icon: XCircle,
    color: 'text-gray-700',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    textColor: 'text-gray-600',
    bgLight: 'bg-gray-50',
  },
} as const;

export type ApplicationStatus = keyof typeof APPLICATION_STATUS_CONFIG;

// Interview Status Configuration
export const INTERVIEW_STATUS_CONFIG = {
  SCHEDULED: {
    label: 'Đã lên lịch',
    icon: Calendar,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-100',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    icon: CheckCircle2,
    color: 'text-gray-600',
    bg: 'bg-gray-100',
  },
  CANCELLED: {
    label: 'Đã hủy',
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-100',
  },
  RESCHEDULED: {
    label: 'Dời lịch',
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
  },
  NO_SHOW: {
    label: 'Vắng mặt',
    icon: AlertCircle,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
} as const;

export type InterviewStatus = keyof typeof INTERVIEW_STATUS_CONFIG;

export interface StatusConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border?: string;
  textColor?: string;
  bgLight?: string;
}

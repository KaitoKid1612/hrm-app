import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Job } from '../../types';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  TrendingUp,
  Users,
  Bookmark,
  BookmarkCheck,
  Share2,
} from 'lucide-react';

interface JobHeaderProps {
  job: Job;
  isJobHot: boolean;
  isJobNew: boolean;
  hasApplied: boolean;
  isSaved: boolean;
  isAuthenticated: boolean;
  shareMessage: string;
  onApply: () => void;
  onSave: () => void;
  onShare: () => void;
  formatSalary: (min: number | null, max: number | null) => string;
  getJobTypeLabel: (type: string) => string;
}

export const JobHeader = ({
  job,
  isJobHot,
  isJobNew,
  hasApplied,
  isSaved,
  isAuthenticated,
  shareMessage,
  onApply,
  onSave,
  onShare,
  formatSalary,
  getJobTypeLabel,
}: JobHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-white">
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Briefcase className="w-10 h-10" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                {job.company ? (
                  <Link
                    to={`/companies/${job.company.id}`}
                    className="text-lg text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {job.company.name}
                  </Link>
                ) : (
                  <p className="text-lg text-gray-600 font-medium">Nhà tuyển dụng</p>
                )}
              </div>
              <div className="flex gap-2">
                {isJobHot && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                    <TrendingUp className="w-4 h-4" />
                    Hot
                  </span>
                )}
                {isJobNew && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    ✨ Mới
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Mức lương</p>
              <p className="font-semibold text-green-600 text-sm">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Địa điểm</p>
              <p className="font-semibold text-sm">{job.city || 'Chưa cập nhật'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-xs text-gray-500">Hình thức</p>
              <p className="font-semibold text-sm">{getJobTypeLabel(job.jobType)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-xs text-gray-500">Số lượng</p>
              <p className="font-semibold text-sm">{job.positions} vị trí</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onApply}
            size="lg"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg"
            disabled={hasApplied}
          >
            {hasApplied
              ? 'Đã ứng tuyển'
              : isAuthenticated
                ? 'Ứng tuyển ngay'
                : 'Đăng nhập để ứng tuyển'}
          </Button>
          <Button onClick={onSave} size="lg" variant="outline" className="px-6">
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-blue-600" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </Button>
          <Button onClick={onShare} size="lg" variant="outline" className="px-6 relative">
            <Share2 className="w-5 h-5" />
            {shareMessage && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded whitespace-nowrap shadow-lg">
                {shareMessage}
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

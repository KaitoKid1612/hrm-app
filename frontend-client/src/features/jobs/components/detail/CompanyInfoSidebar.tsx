import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Job } from '../../types';
import { Building2, MapPin, Calendar, Briefcase, Users } from 'lucide-react';
import { getImageUrl } from '@/lib/image-utils';

interface CompanyInfoSidebarProps {
  job: Job;
  getJobLevelLabel: (level: string) => string;
}

export const CompanyInfoSidebar = ({ job, getJobLevelLabel }: CompanyInfoSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Thông tin công ty
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white">
              {job.company?.logo ? (
                <img
                  src={getImageUrl(job.company.logo)}
                  alt={job.company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Building2 className="w-8 h-8" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{job.company?.name || 'Nhà tuyển dụng'}</h3>
              {job.company?.city && <p className="text-sm text-gray-600">{job.company.city}</p>}
            </div>
          </div>
          {job.address && (
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-gray-600">{job.address}</span>
              </div>
            </div>
          )}
          {job.company && (
            <Link to={`/companies/${job.company.id}`}>
              <Button variant="outline" className="w-full">
                Xem trang công ty
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Job Meta */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {job.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Hạn nộp: <strong>{new Date(job.deadline).toLocaleDateString('vi-VN')}</strong>
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              Ngày đăng: <strong>{new Date(job.createdAt).toLocaleDateString('vi-VN')}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              Cấp bậc: <strong>{getJobLevelLabel(job.jobLevel)}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              Lượt xem: <strong>{job.viewCount}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              Ứng viên: <strong>{job._count.applications}</strong>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

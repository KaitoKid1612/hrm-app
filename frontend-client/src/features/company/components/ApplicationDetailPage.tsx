import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApplicationDetail } from '../hooks/useApplicationManagement';
import type { ApplicationDetail } from '../services/applicationManagementService';
import { ROUTES } from '@/constants';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  GraduationCap,
  User,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

const statusConfig = {
  PENDING: { label: 'Đang chờ', icon: Clock, color: 'text-yellow-700', bg: 'bg-yellow-100' },
  REVIEWING: {
    label: 'Đang xem xét',
    icon: AlertCircle,
    color: 'text-blue-700',
    bg: 'bg-blue-100',
  },
  SHORTLISTED: {
    label: 'Lọt vòng',
    icon: CheckCircle2,
    color: 'text-green-700',
    bg: 'bg-green-100',
  },
  INTERVIEWED: {
    label: 'Đã phỏng vấn',
    icon: CheckCircle2,
    color: 'text-purple-700',
    bg: 'bg-purple-100',
  },
  ACCEPTED: { label: 'Chấp nhận', icon: CheckCircle2, color: 'text-green-700', bg: 'bg-green-100' },
  REJECTED: { label: 'Từ chối', icon: XCircle, color: 'text-red-700', bg: 'bg-red-100' },
  WITHDRAWN: { label: 'Đã rút', icon: XCircle, color: 'text-gray-700', bg: 'bg-gray-100' },
};

export const ApplicationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { application, isLoading, updateStatus } = useApplicationDetail(id);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateStatus(newStatus as ApplicationDetail['status']);
    } catch {
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy đơn ứng tuyển</h3>
          <Button onClick={() => navigate(ROUTES.MANAGE_APPLICATIONS)}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  const status = statusConfig[application.status];
  const StatusIcon = status?.icon || Clock;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.MANAGE_APPLICATIONS)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn ứng tuyển</h1>
            <p className="text-gray-600 mt-1">
              Nộp đơn ngày {new Date(application.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium ${status?.bg || 'bg-gray-100'} ${status?.color || 'text-gray-700'}`}
          >
            <StatusIcon className="w-4 h-4" />
            {status?.label || application.status}
          </span>

          {/* Status Change Dropdown */}
          <select
            value={application.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Info */}
          <Card>
            <CardHeader>
              <CardTitle>Vị trí ứng tuyển</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">{application.job?.title}</h3>
                <p className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {application.job?.location}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cover Letter */}
          {application.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle>Thư giới thiệu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{application.coverLetter}</p>
              </CardContent>
            </Card>
          )}

          {/* Resume */}
          {application.resume && (
            <>
              {/* Skills */}
              {application.resume.skills && application.resume.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Kỹ năng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {application.resume.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Work Experience */}
              {application.resume.workExperience &&
                application.resume.workExperience.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Kinh nghiệm làm việc
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {application.resume.workExperience.map((exp, index) => (
                          <div key={index} className="border-l-2 border-blue-200 pl-4">
                            <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                            <p className="text-gray-600">{exp.company}</p>
                            <p className="text-sm text-gray-500">{exp.duration}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Education */}
              {application.resume.education && application.resume.education.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Học vấn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {application.resume.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-green-200 pl-4">
                          <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.school}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Candidate Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin ứng viên</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
                  {application.candidate?.avatar ? (
                    <img
                      src={application.candidate.avatar}
                      alt={application.candidate.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {application.candidate?.fullName || 'N/A'}
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a
                    href={`mailto:${application.candidate?.email}`}
                    className="hover:text-blue-600"
                  >
                    {application.candidate?.email}
                  </a>
                </div>
                {application.candidate?.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${application.candidate.phone}`} className="hover:text-blue-600">
                      {application.candidate.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button className="w-full" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Gửi email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nộp đơn</p>
                    <p className="text-xs text-gray-500">
                      {new Date(application.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                {application.updatedAt !== application.createdAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cập nhật</p>
                      <p className="text-xs text-gray-500">
                        {new Date(application.updatedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;

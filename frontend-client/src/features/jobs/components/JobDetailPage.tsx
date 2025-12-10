import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/constants';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  TrendingUp,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  Gift,
} from 'lucide-react';

// Mock data - sẽ thay bằng API sau
const mockJobDetail = {
  id: '1',
  title: 'Senior Frontend Developer (ReactJS)',
  description:
    'Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm với ReactJS để tham gia đội ngũ phát triển sản phẩm của chúng tôi. Bạn sẽ làm việc trong một môi trường năng động, sáng tạo và có cơ hội phát triển bản thân.',
  salary: { min: 25000000, max: 35000000 },
  location: 'Hà Nội',
  type: 'FULL_TIME',
  level: 'SENIOR',
  requirements: [
    'Có ít nhất 4 năm kinh nghiệm phát triển Frontend với ReactJS',
    'Thành thạo TypeScript, NextJS, Redux/Context API',
    'Hiểu biết sâu về HTML5, CSS3, responsive design',
    'Kinh nghiệm làm việc với RESTful API, GraphQL',
    'Kỹ năng debug và tối ưu performance',
    'Có khả năng làm việc nhóm và giao tiếp tốt',
  ],
  benefits: [
    'Lương tháng 13, thưởng theo dự án',
    'Bảo hiểm sức khỏe cao cấp',
    'Du lịch công ty 2 lần/năm',
    'Làm việc remote 2 ngày/tuần',
    'Đào tạo và phát triển kỹ năng',
    'Môi trường làm việc trẻ trung, năng động',
  ],
  responsibilities: [
    'Phát triển và maintain các tính năng frontend',
    'Tối ưu hiệu suất ứng dụng web',
    'Review code và hỗ trợ team members',
    'Tham gia vào việc thiết kế kiến trúc hệ thống',
    'Làm việc chặt chẽ với Backend và UX/UI team',
  ],
  isHot: true,
  isNew: true,
  createdAt: '2025-12-10',
  expiresAt: '2026-01-10',
  numberOfPositions: 3,
  company: {
    id: '1',
    name: 'FPT Software',
    logo: 'https://via.placeholder.com/100',
    address: 'Tòa nhà FPT, Cầu Giấy, Hà Nội',
    description:
      'FPT Software là công ty phần mềm hàng đầu Việt Nam với hơn 20 năm kinh nghiệm trong lĩnh vực công nghệ thông tin.',
    size: '1000+ nhân viên',
    website: 'https://fptsoftware.com',
  },
};

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const job = mockJobDetail; // TODO: Fetch from API

  const handleApply = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate(`${ROUTES.LOGIN}?returnUrl=${ROUTES.JOB_DETAIL.replace(':id', id || '')}`);
    } else {
      // TODO: Navigate to application form
      alert('Chức năng nộp đơn đang được phát triển');
    }
  };

  const formatSalary = (min: number, max: number) => {
    return `${min.toLocaleString('vi-VN')} - ${max.toLocaleString('vi-VN')} VNĐ`;
  };

  const getJobTypeLabel = (type: string) => {
    const labels = {
      FULL_TIME: 'Full-time',
      PART_TIME: 'Part-time',
      CONTRACT: 'Hợp đồng',
      INTERNSHIP: 'Thực tập',
      FREELANCE: 'Freelance',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-white">
                      {job.company.logo ? (
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
                          <Link
                            to={`/companies/${job.company.id}`}
                            className="text-lg text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {job.company.name}
                          </Link>
                        </div>
                        <div className="flex gap-2">
                          {job.isHot && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                              <TrendingUp className="w-4 h-4" />
                              Hot
                            </span>
                          )}
                          {job.isNew && (
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
                          {formatSalary(job.salary.min, job.salary.max)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Địa điểm</p>
                        <p className="font-semibold text-sm">{job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Hình thức</p>
                        <p className="font-semibold text-sm">{getJobTypeLabel(job.type)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-xs text-gray-500">Số lượng</p>
                        <p className="font-semibold text-sm">{job.numberOfPositions} vị trí</p>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <Button
                    onClick={handleApply}
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg"
                  >
                    {isAuthenticated ? 'Ứng tuyển ngay' : 'Đăng nhập để ứng tuyển'}
                  </Button>
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Mô tả công việc</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </CardContent>
              </Card>

              {/* Responsibilities */}
              <Card>
                <CardHeader>
                  <CardTitle>Trách nhiệm công việc</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Yêu cầu ứng viên</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Quyền lợi</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Gift className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
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
                      <img
                        src={job.company.logo}
                        alt={job.company.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{job.company.name}</h3>
                      <p className="text-sm text-gray-600">{job.company.size}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{job.company.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-gray-600">{job.company.address}</span>
                    </div>
                  </div>
                  <Link to={`/companies/${job.company.id}`}>
                    <Button variant="outline" className="w-full">
                      Xem trang công ty
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Job Meta */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Hạn nộp:{' '}
                      <strong>{new Date(job.expiresAt).toLocaleDateString('vi-VN')}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Ngày đăng:{' '}
                      <strong>{new Date(job.createdAt).toLocaleDateString('vi-VN')}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Cấp bậc: <strong>{job.level}</strong>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobDetailPage;

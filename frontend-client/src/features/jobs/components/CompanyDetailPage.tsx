import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { companyService } from '../services/companyService';
import { jobService } from '../services/jobService';
import type { Company } from '../services/companyService';
import type { Job } from '../types';
import { ROUTES } from '@/constants';
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Mail,
  Phone,
  Briefcase,
  ArrowLeft,
  ExternalLink,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
} from 'lucide-react';

export const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'jobs'>('about');

  useEffect(() => {
    if (id) {
      loadCompanyData(id);
    }
  }, [id]);

  const loadCompanyData = async (companyId: string) => {
    try {
      setIsLoading(true);
      const [companyData, jobsData] = await Promise.all([
        companyService.getCompanyById(companyId),
        jobService.getJobs({ companyId, limit: 20 }),
      ]);
      setCompany(companyData);
      setJobs(jobsData.data || []);
    } catch (error) {
      console.error('Error loading company data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompanyTypeLabel = (type?: string) => {
    const types: Record<string, string> = {
      COMPANY: 'Công ty',
      SMALL_BUSINESS: 'Hộ kinh doanh',
      HEADHUNTER: 'Nhà tuyển dụng',
    };
    return type ? types[type] || 'Công ty' : 'Công ty';
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin công ty...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!company) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="py-16 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy công ty</h3>
              <p className="text-gray-600 mb-4">Công ty này không tồn tại hoặc đã bị xóa</p>
              <Button onClick={() => navigate(ROUTES.COMPANIES)}>Quay lại danh sách</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header with back button */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(ROUTES.COMPANIES)} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách công ty
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      {company.coverImage && (
        <div className="w-full h-48 sm:h-64 bg-gray-200">
          <img src={company.coverImage} alt={company.name} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Company Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-2 border-gray-200 flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 shrink-0 -mt-12 sm:-mt-16 bg-white shadow-lg">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-contain rounded-xl p-2"
                />
              ) : (
                <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400" />
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {getCompanyTypeLabel(company.type)}
                </span>
                {company.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{company.city}</span>
                  </div>
                )}
                {company.size && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{company.size} nhân viên</span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">{jobs.length}</span>
                  <span className="text-gray-600">việc làm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'about'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Giới thiệu
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'jobs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Việc làm ({jobs.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'about' && (
              <>
                {/* About Company */}
                {company.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Giới thiệu về công ty</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {company.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Industry */}
                {company.industry && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Lĩnh vực</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700 font-medium">{company.industry}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {activeTab === 'jobs' && (
              <div className="space-y-4">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <Card
                      key={job.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                              {job.city && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{job.city}</span>
                                </div>
                              )}
                              {job.jobType && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{job.jobType}</span>
                                </div>
                              )}
                              {job.jobLevel && (
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4" />
                                  <span>{job.jobLevel}</span>
                                </div>
                              )}
                            </div>
                            {(job.salaryMin || job.salaryMax) && (
                              <div className="flex items-center gap-2 text-green-600 font-semibold">
                                <DollarSign className="w-4 h-4" />
                                <span>
                                  {job.salaryMin?.toLocaleString()} -{' '}
                                  {job.salaryMax?.toLocaleString()} VND
                                </span>
                              </div>
                            )}
                          </div>
                          <Button size="sm" className="shrink-0">
                            Xem chi tiết
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">Công ty chưa có tin tuyển dụng nào</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    <span className="truncate">Website</span>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </a>
                )}
                {company.email && (
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="truncate">{company.email}</span>
                  </a>
                )}
                {company.phone && (
                  <a
                    href={`tel:${company.phone}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{company.phone}</span>
                  </a>
                )}
                {company.address && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 mt-0.5" />
                    <span>{company.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin công ty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Quy mô</span>
                  <span className="font-medium text-gray-900">
                    {company.size || 'Chưa cập nhật'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Lĩnh vực</span>
                  <span className="font-medium text-gray-900">
                    {company.industry || 'Chưa cập nhật'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Loại hình</span>
                  <span className="font-medium text-gray-900">
                    {getCompanyTypeLabel(company.type)}
                  </span>
                </div>
                {company.createdAt && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Tham gia</span>
                    <div className="flex items-center gap-1 text-gray-900">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">
                        {new Date(company.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyDetailPage;

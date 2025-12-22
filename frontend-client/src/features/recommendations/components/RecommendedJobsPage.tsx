import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useJobRecommendations } from '../hooks/useRecommendations';
import { getImageUrl } from '@/lib/image-utils';
import { JobRecommendation } from '../types/recommendation.types';
import {
  Sparkles,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  Target,
  CheckCircle,
  Building2,
} from 'lucide-react';

export const RecommendedJobsPage = () => {
  const navigate = useNavigate();
  const { recommendations, isLoading, error } = useJobRecommendations({ limit: 20 });

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tìm việc phù hợp với bạn...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Việc làm phù hợp với bạn</h1>
          </div>
          <p className="text-gray-600">
            Những công việc được gợi ý dựa trên hồ sơ, kỹ năng và kinh nghiệm của bạn
          </p>
        </div>

        {error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-600">{error}</p>
              <p className="text-gray-600 mt-2">
                Vui lòng hoàn thiện hồ sơ của bạn để nhận được gợi ý việc làm phù hợp
              </p>
              <Button className="mt-4" onClick={() => navigate('/profile')}>
                Cập nhật hồ sơ
              </Button>
            </CardContent>
          </Card>
        ) : recommendations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chưa có gợi ý nào</h3>
              <p className="text-gray-600 mb-4">
                Hoàn thiện hồ sơ của bạn để chúng tôi có thể gợi ý việc làm phù hợp nhất
              </p>
              <Button onClick={() => navigate('/profile')}>Cập nhật hồ sơ</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {recommendations.map((job) => (
              <JobRecommendationCard
                key={job.id}
                job={job}
                onClick={() => handleJobClick(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

interface JobRecommendationCardProps {
  job: JobRecommendation;
  onClick: () => void;
}

const JobRecommendationCard = ({ job, onClick }: JobRecommendationCardProps) => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-300">
      <CardContent className="p-6" onClick={onClick}>
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="w-16 h-16 rounded-lg border flex items-center justify-center bg-gray-50 shrink-0">
            {job.company?.logo ? (
              <img
                src={getImageUrl(job.company.logo)}
                alt={job.company.name}
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <Building2 className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            {/* Match Score */}
            {job.matchScore !== undefined && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-3">
                <Target className="w-4 h-4" />
                <span>{Math.round(job.matchScore)}% phù hợp</span>
              </div>
            )}

            {/* Job Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
              {job.title}
            </h3>

            {/* Company Name */}
            {job.company && (
              <p className="text-gray-700 font-medium mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {job.company.name}
              </p>
            )}

            {/* Job Details */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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

            {/* Salary */}
            {(job.salaryMin || job.salaryMax) && (
              <div className="flex items-center gap-2 text-green-600 font-semibold mb-4">
                <DollarSign className="w-5 h-5" />
                <span>
                  {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()} VND
                </span>
              </div>
            )}

            {/* Match Reasons */}
            {job.matchReasons && job.matchReasons.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Tại sao phù hợp với bạn:
                </h4>
                <ul className="space-y-2">
                  {job.matchReasons.slice(0, 3).map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button className="shrink-0">Xem chi tiết</Button>
        </div>
      </CardContent>
    </Card>
  );
};

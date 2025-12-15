import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { savedJobsService } from '../services/jobActionsService';
import { toast } from '@/lib/toast';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SavedJob {
  id: string;
  jobId: string;
  createdAt: string;
  job?: {
    title?: string;
    city?: string;
    salaryMin?: number;
    salaryMax?: number;
    company?: {
      name?: string;
      logo?: string;
    };
  };
}

export const SavedJobsPage = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      setIsLoading(true);
      const jobs = await savedJobsService.getMySavedJobs();
      setSavedJobs(jobs);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async (id: string) => {
    try {
      await savedJobsService.unsaveJob(id);
      setSavedJobs((prev) => prev.filter((job) => job.id !== id));
      toast.success('Đã bỏ lưu tin tuyển dụng');
    } catch (error) {
      console.error('Error unsaving job:', error);
      toast.error(error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-blue-600" />
              Việc làm đã lưu
            </h1>
            <p className="text-gray-600 mt-1">Bạn đã lưu {savedJobs.length} việc làm</p>
          </div>
        </div>

        {/* Saved Jobs List */}
        {savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((savedJob) => (
              <Card key={savedJob.id} className="relative group">
                <CardContent className="pt-6">
                  {/* Remove Button */}
                  <button
                    onClick={() => handleUnsave(savedJob.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-lg shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200"
                    title="Bỏ lưu"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>

                  {/* Job Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white shrink-0">
                        {savedJob.job?.company?.logo ? (
                          <img
                            src={savedJob.job.company.logo}
                            alt={savedJob.job.company.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Bookmark className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {savedJob.job?.title || 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {savedJob.job?.company?.name || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📍 {savedJob.job?.city || 'N/A'}</p>
                      <p>
                        💰{' '}
                        {savedJob.job?.salaryMin && savedJob.job?.salaryMax
                          ? `${(savedJob.job.salaryMin / 1000000).toFixed(0)} - ${(savedJob.job.salaryMax / 1000000).toFixed(0)} triệu`
                          : 'Thỏa thuận'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Lưu ngày: {new Date(savedJob.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>

                    <Button
                      onClick={() => navigate(`/jobs/${savedJob.jobId}`)}
                      className="w-full"
                      variant="outline"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chưa có việc làm nào được lưu
              </h3>
              <p className="text-gray-600 mb-4">
                Lưu các việc làm yêu thích để dễ dàng theo dõi và ứng tuyển sau
              </p>
              <Button onClick={() => navigate('/jobs')}>Khám phá việc làm</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedJobsPage;

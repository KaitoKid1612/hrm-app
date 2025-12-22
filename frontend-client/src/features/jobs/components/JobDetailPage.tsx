import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { toast } from '@/lib/toast';
import { ROUTES } from '@/constants';
import { ApplyJobModal } from './ApplyJobModal';
import { useJobApplication } from '../hooks/useJobApplication';
import { useSavedJob } from '../hooks/useSavedJob';
import { useJobDetail } from '../hooks/useJobs';
import { JobHeader } from './detail/JobHeader';
import { JobDescription } from './detail/JobDescription';
import { JobRequirements } from './detail/JobRequirements';
import { JobBenefits } from './detail/JobBenefits';
import { JobSkills } from './detail/JobSkills';
import { CompanyInfoSidebar } from './detail/CompanyInfoSidebar';

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  const { job, isLoading, error } = useJobDetail(id || '');
  const { hasApplied, applyJob } = useJobApplication(id || '');
  const { isSaved, toggleSave } = useSavedJob(id || '');

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate(`${ROUTES.LOGIN}?returnUrl=${ROUTES.JOB_DETAIL.replace(':id', id || '')}`);
    } else if (user?.role === 'EMPLOYER') {
      toast.error('Nhà tuyển dụng không thể ứng tuyển');
    } else {
      setIsApplyModalOpen(true);
    }
  };

  const handleApplySubmit = async (data: { resumeId?: string; coverLetter?: string }) => {
    await applyJob(data);
    toast.success('Nộp đơn thành công! Bạn có thể xem trạng thái tại "Đơn ứng tuyển của tôi"');
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate(`${ROUTES.LOGIN}?returnUrl=${ROUTES.JOB_DETAIL.replace(':id', id || '')}`);
      return;
    }

    if (user?.role === 'EMPLOYER') {
      toast.error('Nhà tuyển dụng không thể lưu việc làm');
      return;
    }

    try {
      await toggleSave();
    } catch (error) {
      console.error('Error toggling save:', error);
      toast.error(error);
    }
  };

  const handleShare = () => {
    if (!job) return;

    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: job.title,
          text: `${job.title}${job.company ? ` tại ${job.company.name}` : ''}`,
          url: url,
        })
        .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(url);
      setShareMessage('Đã sao chép link!');
      setTimeout(() => setShareMessage(''), 2000);
    }
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Thỏa thuận';
    if (!min) return `Lên đến ${max?.toLocaleString('vi-VN')} VNĐ`;
    if (!max) return `Từ ${min?.toLocaleString('vi-VN')} VNĐ`;
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

  const getJobLevelLabel = (level: string) => {
    const labels = {
      INTERN: 'Thực tập sinh',
      FRESHER: 'Fresher',
      JUNIOR: 'Junior',
      MIDDLE: 'Middle',
      SENIOR: 'Senior',
      LEADER: 'Leader',
      MANAGER: 'Manager',
      ENTRY_LEVEL: 'Nhập môn',
      EXPERIENCED: 'Có kinh nghiệm',
      NOT_REQUIRED: 'Không yêu cầu',
    };
    return labels[level as keyof typeof labels] || level;
  };

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin việc làm...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Không thể tải thông tin việc làm</p>
            <Button onClick={() => navigate(ROUTES.JOBS)}>Quay lại danh sách</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Check if job is new
  const isJobNew = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(job.createdAt) > sevenDaysAgo;
  };

  // Check if job is hot
  const isJobHot = () => {
    return job._count.applications > 10 || job.salaryMax > 20000000;
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <JobHeader
                job={job}
                isJobHot={isJobHot()}
                isJobNew={isJobNew()}
                hasApplied={hasApplied}
                isSaved={isSaved}
                isAuthenticated={isAuthenticated}
                userRole={user?.role}
                shareMessage={shareMessage}
                onApply={handleApply}
                onSave={handleSave}
                onShare={handleShare}
                formatSalary={formatSalary}
                getJobTypeLabel={getJobTypeLabel}
              />
              <JobDescription description={job.description} />
              <JobRequirements requirements={job.requirements} />
              <JobBenefits benefits={job.benefits || null} />
              <JobSkills skills={job.skills || []} />
            </div>

            {/* Sidebar */}
            <CompanyInfoSidebar job={job} getJobLevelLabel={getJobLevelLabel} />
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={job.title}
        onSubmit={handleApplySubmit}
      />
    </MainLayout>
  );
};

export default JobDetailPage;

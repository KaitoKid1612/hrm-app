import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobManagementService } from '../services/jobManagementService';
import { ROUTES } from '@/constants';
import { toast } from '@/lib/toast';
import { JobFormWrapper } from './job-form/JobFormWrapper';

export const EditJobPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialData, setInitialData] = useState<{
    formData: {
      title: string;
      description: string;
      location: string;
      type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
      level: 'INTERN' | 'FRESHER' | 'JUNIOR' | 'MIDDLE' | 'SENIOR' | 'LEAD';
      salaryMin: string;
      salaryMax: string;
      numberOfPositions: number;
      expiresAt: string;
      isHot: boolean;
    };
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
  } | null>(null);

  useEffect(() => {
    if (id) {
      loadJobData();
    }
  }, [id]);

  const loadJobData = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const job = await jobManagementService.getJobById(id);

      // Parse requirements, responsibilities, benefits
      const parseJsonArray = (data: unknown): string[] => {
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
          try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      };

      setInitialData({
        formData: {
          title: job.title || '',
          description: job.description || '',
          location: job.city || job.address || '',
          type: (job.type || 'FULL_TIME') as
            | 'FULL_TIME'
            | 'PART_TIME'
            | 'CONTRACT'
            | 'INTERNSHIP'
            | 'FREELANCE',
          level: (job.level || 'MIDDLE') as
            | 'INTERN'
            | 'FRESHER'
            | 'JUNIOR'
            | 'MIDDLE'
            | 'SENIOR'
            | 'LEAD',
          salaryMin: job.salaryMin?.toString() || '',
          salaryMax: job.salaryMax?.toString() || '',
          numberOfPositions: job.positions || 1,
          expiresAt: job.deadline ? job.deadline.split('T')[0] : '',
          isHot: job.isHot || false,
        },
        requirements: parseJsonArray(job.requirements),
        responsibilities: parseJsonArray(job.responsibilities),
        benefits: parseJsonArray(job.benefits),
      });
    } catch (err) {
      console.error('Error loading job:', err);
      toast.error('Không thể tải thông tin công việc');
      navigate(ROUTES.MANAGE_JOBS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: {
    formData: {
      title: string;
      description: string;
      location: string;
      type: string;
      level: string;
      salaryMin: string;
      salaryMax: string;
      numberOfPositions: number;
      expiresAt: string;
      isHot: boolean;
    };
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
  }) => {
    if (!id) return;

    setIsSaving(true);
    setError('');

    try {
      const jobData = {
        title: data.formData.title,
        description: data.formData.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        benefits: data.benefits,
        salary: {
          min: Number(data.formData.salaryMin),
          max: Number(data.formData.salaryMax),
          currency: 'VND' as const,
        },
        location: data.formData.location,
        type: data.formData.type as
          | 'FULL_TIME'
          | 'PART_TIME'
          | 'CONTRACT'
          | 'INTERNSHIP'
          | 'FREELANCE',
        level: data.formData.level as
          | 'INTERN'
          | 'FRESHER'
          | 'JUNIOR'
          | 'MIDDLE'
          | 'SENIOR'
          | 'LEAD',
        numberOfPositions: data.formData.numberOfPositions,
        expiresAt: data.formData.expiresAt,
        isHot: data.formData.isHot,
      };

      await jobManagementService.updateJob(id, jobData);
      toast.success('Cập nhật tin tuyển dụng thành công!');
      navigate(ROUTES.MANAGE_JOBS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật tin');
      toast.error('Có lỗi xảy ra khi cập nhật tin');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <JobFormWrapper
      title="Chỉnh sửa tin tuyển dụng"
      subtitle="Cập nhật thông tin tin tuyển dụng"
      submitButtonText="Cập nhật tin tuyển dụng"
      isLoading={isLoading}
      isSaving={isSaving}
      error={error}
      initialData={initialData || undefined}
      showCompanySelector={false}
      onSubmit={handleSubmit}
    />
  );
};

export default EditJobPage;

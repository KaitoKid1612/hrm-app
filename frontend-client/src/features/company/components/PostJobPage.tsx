import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobManagementService, CompanyType } from '../services/jobManagementService';
import { companyProfileService, CompanyProfileData } from '../services/companyProfileService';
import { CreateCompanyModal } from './CreateCompanyModal';
import { ROUTES } from '@/constants';
import { JobFormWrapper } from './job-form/JobFormWrapper';
import { CompanyTypeSelector } from './job-form/CompanyTypeSelector';

export const PostJobPage = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState<CompanyProfileData | null>(null);
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [companyType, setCompanyType] = useState<CompanyType>('SMALL_BUSINESS');
  const [useExistingCompany, setUseExistingCompany] = useState(true);

  // Check if user has company on mount
  useEffect(() => {
    checkCompanyProfile();
  }, []);

  const checkCompanyProfile = async () => {
    setIsLoading(true);
    try {
      const profile = await companyProfileService.getMyProfile();
      setCompany(profile);
    } catch (err) {
      console.error('Error checking company profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyCreated = () => {
    setShowCreateCompanyModal(false);
    checkCompanyProfile();
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
      salaryNegotiate: boolean;
      numberOfPositions: number;
      expiresAt: string;
      isHot: boolean;
    };
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
  }) => {
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
          min: data.formData.salaryNegotiate ? null : Number(data.formData.salaryMin) || null,
          max: data.formData.salaryNegotiate ? null : Number(data.formData.salaryMax) || null,
          currency: 'VND' as const,
          negotiate: data.formData.salaryNegotiate,
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
        ...(useExistingCompany && company ? { companyId: company.id } : { companyType }),
      };

      await jobManagementService.createJob(jobData);
      navigate(ROUTES.MANAGE_JOBS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng tin');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Show create company modal
  if (showCreateCompanyModal) {
    return (
      <CreateCompanyModal
        onSuccess={handleCompanyCreated}
        onCancel={() => navigate(ROUTES.MANAGE_JOBS)}
      />
    );
  }

  return (
    <JobFormWrapper
      title="Đăng tin tuyển dụng"
      subtitle="Tạo tin tuyển dụng mới để tìm kiếm ứng viên"
      submitButtonText="Đăng tin tuyển dụng"
      isLoading={isLoading}
      isSaving={isSaving}
      error={error}
      showCompanySelector={true}
      companySelectorComponent={
        <CompanyTypeSelector
          company={company}
          companyType={companyType}
          useExistingCompany={useExistingCompany}
          onCompanyTypeChange={setCompanyType}
          onUseExistingChange={setUseExistingCompany}
          onCreateCompany={() => setShowCreateCompanyModal(true)}
        />
      }
      onSubmit={handleSubmit}
    />
  );
};

export default PostJobPage;

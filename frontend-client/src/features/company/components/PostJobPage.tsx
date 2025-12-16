import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { jobManagementService, CompanyType } from '../services/jobManagementService';
import { companyProfileService, CompanyProfileData } from '../services/companyProfileService';
import { CreateCompanyModal } from './CreateCompanyModal';
import { ROUTES } from '@/constants';
import { Briefcase, Save, X } from 'lucide-react';
import { useJobForm } from '../hooks/useJobForm';
import { JobFormBasicInfo } from './job-form/JobFormBasicInfo';
import { ListInputField } from './job-form/ListInputField';
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

  const {
    formData,
    requirements,
    responsibilities,
    benefits,
    setRequirements,
    setResponsibilities,
    setBenefits,
    handleInputChange,
    addItem,
    removeItem,
    validateForm,
    buildJobData,
  } = useJobForm();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    try {
      const jobData = buildJobData(
        useExistingCompany && company ? company.id : undefined,
        !useExistingCompany || !company ? companyType : undefined,
      );

      await jobManagementService.createJob(jobData);
      navigate(ROUTES.MANAGE_JOBS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng tin');
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Đang kiểm tra hồ sơ công ty...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Đăng tin tuyển dụng
          </h1>
          <p className="text-gray-600 mt-1">Tạo tin tuyển dụng mới để tìm kiếm ứng viên</p>
        </div>
        <Button variant="outline" onClick={() => navigate(ROUTES.MANAGE_JOBS)}>
          <X className="w-4 h-4 mr-2" />
          Hủy
        </Button>
      </div>

      {/* Company Type Selector */}
      <CompanyTypeSelector
        company={company}
        companyType={companyType}
        useExistingCompany={useExistingCompany}
        onCompanyTypeChange={setCompanyType}
        onUseExistingChange={setUseExistingCompany}
        onCreateCompany={() => setShowCreateCompanyModal(true)}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <JobFormBasicInfo formData={formData} onChange={handleInputChange} />

        {/* Requirements */}
        <ListInputField
          title="Yêu cầu ứng viên"
          items={requirements}
          placeholder="Nhập yêu cầu..."
          onAdd={(value) => addItem(requirements, setRequirements, value)}
          onRemove={(index) => removeItem(requirements, setRequirements, index)}
        />

        {/* Responsibilities */}
        <ListInputField
          title="Trách nhiệm công việc"
          items={responsibilities}
          placeholder="Nhập trách nhiệm..."
          onAdd={(value) => addItem(responsibilities, setResponsibilities, value)}
          onRemove={(index) => removeItem(responsibilities, setResponsibilities, index)}
        />

        {/* Benefits */}
        <ListInputField
          title="Quyền lợi"
          items={benefits}
          placeholder="Nhập quyền lợi..."
          onAdd={(value) => addItem(benefits, setBenefits, value)}
          onRemove={(index) => removeItem(benefits, setBenefits, index)}
        />

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.MANAGE_JOBS)}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSaving} className="gap-2 bg-blue-500 hover:bg-blue-600">
            <Save className="w-4 h-4" />
            {isSaving ? 'Đang đăng...' : 'Đăng tin tuyển dụng'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostJobPage;

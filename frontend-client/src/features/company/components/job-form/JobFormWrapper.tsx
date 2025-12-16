import { useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import { Briefcase, Save, X } from 'lucide-react';
import { useJobForm, JobFormState } from '../../hooks/useJobForm';
import { JobFormBasicInfo } from './JobFormBasicInfo';
import { ListInputField } from './ListInputField';
import { CompanyProfileData } from '../../services/companyProfileService';
import { CompanyType } from '../../services/jobManagementService';

interface JobFormWrapperProps {
  title: string;
  subtitle: string;
  submitButtonText: string;
  isLoading?: boolean;
  isSaving?: boolean;
  error?: string;
  initialData?: {
    formData?: Partial<JobFormState>;
    requirements?: string[];
    responsibilities?: string[];
    benefits?: string[];
  };
  showCompanySelector?: boolean;
  company?: CompanyProfileData | null;
  companyType?: CompanyType;
  useExistingCompany?: boolean;
  onCompanyTypeChange?: (type: CompanyType) => void;
  onUseExistingChange?: (value: boolean) => void;
  onCreateCompany?: () => void;
  companySelectorComponent?: ReactNode;
  onSubmit: (data: {
    formData: JobFormState;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
  }) => Promise<void>;
}

export const JobFormWrapper = ({
  title,
  subtitle,
  submitButtonText,
  isLoading = false,
  isSaving = false,
  error,
  initialData,
  showCompanySelector = false,
  companySelectorComponent,
  onSubmit,
}: JobFormWrapperProps) => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');

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
  } = useJobForm(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Validation
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    try {
      await onSubmit({
        formData,
        requirements,
        responsibilities,
        benefits,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Đang tải...</p>
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
            {title}
          </h1>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
        <Button variant="outline" onClick={() => navigate(ROUTES.MANAGE_JOBS)}>
          <X className="w-4 h-4 mr-2" />
          Hủy
        </Button>
      </div>

      {/* Company Selector (if needed) */}
      {showCompanySelector && companySelectorComponent}

      {/* Error Message */}
      {(error || submitError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error || submitError}
        </div>
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
            {isSaving ? 'Đang lưu...' : submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

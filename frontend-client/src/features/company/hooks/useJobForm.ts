import { useState } from 'react';
import { JobFormData } from '../services/jobManagementService';

export interface JobFormState {
  title: string;
  description: string;
  location: string;
  type: JobFormData['type'];
  level: JobFormData['level'];
  salaryMin: string;
  salaryMax: string;
  numberOfPositions: number;
  expiresAt: string;
  isHot: boolean;
}

interface InitialData {
  formData?: Partial<JobFormState>;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
}

export const useJobForm = (initialData?: InitialData) => {
  const [formData, setFormData] = useState<JobFormState>({
    title: '',
    description: '',
    location: '',
    type: 'FULL_TIME' as JobFormData['type'],
    level: 'MIDDLE' as JobFormData['level'],
    salaryMin: '',
    salaryMax: '',
    numberOfPositions: 1,
    expiresAt: '',
    isHot: false,
    ...initialData?.formData,
  });

  const [requirements, setRequirements] = useState<string[]>(initialData?.requirements || []);
  const [responsibilities, setResponsibilities] = useState<string[]>(
    initialData?.responsibilities || [],
  );
  const [benefits, setBenefits] = useState<string[]>(initialData?.benefits || []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()]);
      return true;
    }
    return false;
  };

  const removeItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  const validateForm = (): string | null => {
    if (!formData.title || !formData.description || !formData.location) {
      return 'Vui lòng điền đầy đủ thông tin bắt buộc';
    }

    if (requirements.length === 0) {
      return 'Vui lòng thêm ít nhất một yêu cầu ứng viên';
    }

    if (!formData.salaryMin || !formData.salaryMax) {
      return 'Vui lòng nhập mức lương';
    }

    if (Number(formData.salaryMin) >= Number(formData.salaryMax)) {
      return 'Mức lương tối thiểu phải nhỏ hơn mức lương tối đa';
    }

    if (!formData.expiresAt) {
      return 'Vui lòng chọn hạn nộp hồ sơ';
    }

    const expiryDate = new Date(formData.expiresAt);
    if (expiryDate <= new Date()) {
      return 'Hạn nộp hồ sơ phải là ngày trong tương lai';
    }

    return null;
  };

  const buildJobData = (companyId?: string, companyType?: string): JobFormData => {
    const jobData: JobFormData = {
      title: formData.title,
      description: formData.description,
      requirements,
      responsibilities,
      benefits,
      salary: {
        min: Number(formData.salaryMin),
        max: Number(formData.salaryMax),
        currency: 'VND',
      },
      location: formData.location,
      type: formData.type,
      level: formData.level,
      numberOfPositions: formData.numberOfPositions,
      expiresAt: formData.expiresAt,
      isHot: formData.isHot,
    };

    if (companyId) {
      jobData.companyId = companyId;
    } else if (companyType) {
      jobData.companyType = companyType as 'COMPANY' | 'SMALL_BUSINESS' | 'HEADHUNTER';
    }

    return jobData;
  };

  return {
    formData,
    setFormData,
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
  };
};

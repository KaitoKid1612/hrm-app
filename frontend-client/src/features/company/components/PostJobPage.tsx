import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { jobManagementService, JobFormData } from '../services/jobManagementService';
import { ROUTES } from '@/constants';
import {
  Briefcase,
  Save,
  X,
  Plus,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Clock,
  TrendingUp,
} from 'lucide-react';

const jobTypes = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Hợp đồng' },
  { value: 'INTERNSHIP', label: 'Thực tập' },
  { value: 'FREELANCE', label: 'Freelance' },
];

const jobLevels = [
  { value: 'INTERN', label: 'Thực tập sinh' },
  { value: 'FRESHER', label: 'Fresher' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MIDDLE', label: 'Middle' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead/Manager' },
];

export const PostJobPage = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
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
  });

  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');

  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newResponsibility, setNewResponsibility] = useState('');

  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');

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

  const handleAddItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()]);
      setValue('');
    }
  };

  const handleRemoveItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.description || !formData.location) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (requirements.length === 0) {
      setError('Vui lòng thêm ít nhất một yêu cầu ứng viên');
      return;
    }

    if (!formData.salaryMin || !formData.salaryMax) {
      setError('Vui lòng nhập mức lương');
      return;
    }

    if (Number(formData.salaryMin) >= Number(formData.salaryMax)) {
      setError('Mức lương tối thiểu phải nhỏ hơn mức lương tối đa');
      return;
    }

    if (!formData.expiresAt) {
      setError('Vui lòng chọn hạn nộp hồ sơ');
      return;
    }

    const expiryDate = new Date(formData.expiresAt);
    if (expiryDate <= new Date()) {
      setError('Hạn nộp hồ sơ phải là ngày trong tương lai');
      return;
    }

    setIsSaving(true);

    try {
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

      await jobManagementService.createJob(jobData);
      navigate(ROUTES.MANAGE_JOBS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng tin');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Đăng tin tuyển dụng
          </h1>
          <p className="text-gray-100 mt-1">Tạo tin tuyển dụng mới để tìm kiếm ứng viên</p>
        </div>
        <Button variant="outline" onClick={() => navigate(ROUTES.MANAGE_JOBS)}>
          <X className="w-4 h-4 mr-2" />
          Hủy
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Job Title */}
            <div>
              <Label htmlFor="title">
                Tiêu đề công việc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Ví dụ: Senior Frontend Developer (ReactJS)"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">
                Mô tả công việc <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="Mô tả chi tiết về công việc, môi trường làm việc..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Job Type */}
              <div>
                <Label htmlFor="type">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Hình thức làm việc
                </Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {jobTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Level */}
              <div>
                <Label htmlFor="level">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  Cấp bậc
                </Label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {jobLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">
                <MapPin className="w-4 h-4 inline mr-1" />
                Địa điểm làm việc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Ví dụ: Hà Nội, Hồ Chí Minh"
              />
            </div>

            {/* Salary Range */}
            <div>
              <Label>
                <DollarSign className="w-4 h-4 inline mr-1" />
                Mức lương (VNĐ) <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Input
                    name="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={handleInputChange}
                    required
                    placeholder="Tối thiểu"
                    min="0"
                  />
                </div>
                <div>
                  <Input
                    name="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={handleInputChange}
                    required
                    placeholder="Tối đa"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Number of Positions */}
              <div>
                <Label htmlFor="numberOfPositions">
                  <Users className="w-4 h-4 inline mr-1" />
                  Số lượng tuyển
                </Label>
                <Input
                  id="numberOfPositions"
                  name="numberOfPositions"
                  type="number"
                  value={formData.numberOfPositions}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              {/* Expiry Date */}
              <div>
                <Label htmlFor="expiresAt">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Hạn nộp hồ sơ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="expiresAt"
                  name="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Hot Job */}
            <div className="flex items-center gap-2">
              <input
                id="isHot"
                name="isHot"
                type="checkbox"
                checked={formData.isHot}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="isHot" className="cursor-pointer">
                Đánh dấu là tin Hot (ưu tiên hiển thị)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Yêu cầu ứng viên</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {requirements.length > 0 && (
              <ul className="space-y-2">
                {requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">• {req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(requirements, setRequirements, index)}
                      className="text-red-600 hover:text-red-700 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Nhập yêu cầu..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem(requirements, setRequirements, newRequirement, setNewRequirement);
                  }
                }}
              />
              <Button
                type="button"
                onClick={() =>
                  handleAddItem(requirements, setRequirements, newRequirement, setNewRequirement)
                }
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle>Trách nhiệm công việc</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {responsibilities.length > 0 && (
              <ul className="space-y-2">
                {responsibilities.map((resp, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">• {resp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(responsibilities, setResponsibilities, index)}
                      className="text-red-600 hover:text-red-700 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2">
              <Input
                value={newResponsibility}
                onChange={(e) => setNewResponsibility(e.target.value)}
                placeholder="Nhập trách nhiệm..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem(
                      responsibilities,
                      setResponsibilities,
                      newResponsibility,
                      setNewResponsibility,
                    );
                  }
                }}
              />
              <Button
                type="button"
                onClick={() =>
                  handleAddItem(
                    responsibilities,
                    setResponsibilities,
                    newResponsibility,
                    setNewResponsibility,
                  )
                }
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Quyền lợi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {benefits.length > 0 && (
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">• {benefit}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(benefits, setBenefits, index)}
                      className="text-red-600 hover:text-red-700 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2">
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Nhập quyền lợi..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem(benefits, setBenefits, newBenefit, setNewBenefit);
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => handleAddItem(benefits, setBenefits, newBenefit, setNewBenefit)}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm
              </Button>
            </div>
          </CardContent>
        </Card>

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

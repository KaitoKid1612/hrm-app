import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { jobManagementService, JobFormData } from '../services/jobManagementService';
import { ROUTES } from '@/constants';
import { toast } from '@/lib/toast';
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

export const EditJobPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.city || job.address || '',
        type: job.type || 'FULL_TIME',
        level: job.level || 'MIDDLE',
        salaryMin: job.salaryMin?.toString() || '',
        salaryMax: job.salaryMax?.toString() || '',
        numberOfPositions: job.positions || 1,
        expiresAt: job.deadline ? job.deadline.split('T')[0] : '',
        isHot: job.isHot || false,
      });

      setRequirements(parseJsonArray(job.requirements));
      setResponsibilities(parseJsonArray(job.responsibilities));
      setBenefits(parseJsonArray(job.benefits));
    } catch (err) {
      console.error('Error loading job:', err);
      toast.error('Không thể tải thông tin công việc');
      navigate(ROUTES.MANAGE_JOBS);
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!id) return;

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
      const jobData: Partial<JobFormData> = {
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

      await jobManagementService.updateJob(id, jobData);
      toast.success('Cập nhật tin tuyển dụng thành công!');
      navigate(ROUTES.MANAGE_JOBS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật tin');
      toast.error('Có lỗi xảy ra khi cập nhật tin');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Đang tải thông tin công việc...</p>
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
            Chỉnh sửa tin tuyển dụng
          </h1>
          <p className="text-gray-600 mt-1">Cập nhật thông tin tin tuyển dụng</p>
        </div>
        <Button variant="outline" onClick={() => navigate(ROUTES.MANAGE_JOBS)}>
          <X className="w-4 h-4 mr-2" />
          Hủy
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">
                Tên công việc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="VD: Senior Frontend Developer"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">
                Mô tả công việc <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                placeholder="Mô tả chi tiết về công việc..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">
                  Loại công việc <span className="text-red-500">*</span>
                </Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {jobTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="level">
                  Cấp bậc <span className="text-red-500">*</span>
                </Label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {jobLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location and Salary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Địa điểm và mức lương
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="location">
                Địa điểm làm việc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="VD: Hà Nội, Hồ Chí Minh..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salaryMin">
                  Mức lương tối thiểu (VND) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="salaryMin"
                    name="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="10000000"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="salaryMax">
                  Mức lương tối đa (VND) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="salaryMax"
                    name="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="20000000"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Yêu cầu ứng viên <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="VD: Có kinh nghiệm 2 năm về React..."
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
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {requirements.length > 0 && (
              <div className="space-y-2">
                {requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="flex-1 text-sm text-gray-700">{req}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(requirements, setRequirements, index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Trách nhiệm công việc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newResponsibility}
                onChange={(e) => setNewResponsibility(e.target.value)}
                placeholder="VD: Phát triển giao diện người dùng..."
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
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {responsibilities.length > 0 && (
              <div className="space-y-2">
                {responsibilities.map((resp, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="flex-1 text-sm text-gray-700">{resp}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(responsibilities, setResponsibilities, index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quyền lợi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="VD: Bảo hiểm sức khỏe..."
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
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {benefits.length > 0 && (
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="flex-1 text-sm text-gray-700">{benefit}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(benefits, setBenefits, index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Thông tin bổ sung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numberOfPositions">Số lượng tuyển</Label>
                <Input
                  id="numberOfPositions"
                  name="numberOfPositions"
                  type="number"
                  min="1"
                  value={formData.numberOfPositions}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="expiresAt">
                  Hạn nộp hồ sơ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="expiresAt"
                  name="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isHot"
                name="isHot"
                checked={formData.isHot}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="isHot" className="cursor-pointer">
                Tin tuyển dụng nổi bật (Hot job)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.MANAGE_JOBS)}
            disabled={isSaving}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditJobPage;

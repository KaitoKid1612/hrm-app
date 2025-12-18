import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../hooks/useResume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants';
import { ResumeBasicInfo } from './resume/ResumeBasicInfo';

export const ResumePage = () => {
  const navigate = useNavigate();
  const { resume, upsertResume, isLoading } = useResume();

  const [formData, setFormData] = useState<{
    title: string;
    objective: string;
    experience:
      | 'NO_EXPERIENCE'
      | 'ONE_TO_THREE_YEARS'
      | 'THREE_TO_FIVE_YEARS'
      | 'FIVE_TO_TEN_YEARS'
      | 'MORE_THAN_TEN_YEARS';
    education: string;
    workHistory: string;
    certifications: string;
    projects: string;
    address: string;
    city: string;
    country: string;
  }>({
    title: 'Hồ sơ của tôi',
    objective: '',
    experience: 'NO_EXPERIENCE' as const,
    education: '',
    workHistory: '',
    certifications: '',
    projects: '',
    address: '',
    city: '',
    country: 'Vietnam',
  });

  useEffect(() => {
    if (resume) {
      setFormData({
        title: resume.title || 'Hồ sơ của tôi',
        objective: resume.objective || '',
        experience:
          (resume.experience as
            | 'NO_EXPERIENCE'
            | 'ONE_TO_THREE_YEARS'
            | 'THREE_TO_FIVE_YEARS'
            | 'FIVE_TO_TEN_YEARS'
            | 'MORE_THAN_TEN_YEARS') || 'NO_EXPERIENCE',
        education: resume.education || '',
        workHistory: resume.workHistory || '',
        certifications: resume.certifications || '',
        projects: resume.projects || '',
        address: resume.address || '',
        city: resume.city || '',
        country: resume.country || 'Vietnam',
      });
    }
  }, [resume]);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      await upsertResume(formData);
      setSuccess('Lưu hồ sơ thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu hồ sơ');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hồ sơ xin việc</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin CV của bạn</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(ROUTES.DASHBOARD)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <ResumeBasicInfo
          title={formData.title}
          objective={formData.objective}
          onTitleChange={(title) => setFormData((prev) => ({ ...prev, title }))}
          onObjectiveChange={(objective) => setFormData((prev) => ({ ...prev, objective }))}
        />

        {/* Experience Level */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kinh nghiệm làm việc</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="experience">Mức độ kinh nghiệm</Label>
              <select
                id="experience"
                value={formData.experience}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experience: e.target.value as
                      | 'NO_EXPERIENCE'
                      | 'ONE_TO_THREE_YEARS'
                      | 'THREE_TO_FIVE_YEARS'
                      | 'FIVE_TO_TEN_YEARS'
                      | 'MORE_THAN_TEN_YEARS',
                  }))
                }
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NO_EXPERIENCE">Chưa có kinh nghiệm</option>
                <option value="ONE_TO_THREE_YEARS">1-3 năm</option>
                <option value="THREE_TO_FIVE_YEARS">3-5 năm</option>
                <option value="FIVE_TO_TEN_YEARS">5-10 năm</option>
                <option value="MORE_THAN_TEN_YEARS">Trên 10 năm</option>
              </select>
            </div>
            <div>
              <Label htmlFor="workHistory">Lịch sử làm việc</Label>
              <Textarea
                id="workHistory"
                value={formData.workHistory}
                onChange={(e) => setFormData((prev) => ({ ...prev, workHistory: e.target.value }))}
                rows={6}
                placeholder="Mô tả chi tiết về kinh nghiệm làm việc của bạn..."
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Học vấn</h2>
          <div>
            <Label htmlFor="education">Thông tin học vấn</Label>
            <Textarea
              id="education"
              value={formData.education}
              onChange={(e) => setFormData((prev) => ({ ...prev, education: e.target.value }))}
              rows={4}
              placeholder="Mô tả về trình độ học vấn, trường học, bằng cấp..."
              className="mt-2"
            />
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Chứng chỉ</h2>
          <div>
            <Label htmlFor="certifications">Chứng chỉ & Giấy chứng nhận</Label>
            <Textarea
              id="certifications"
              value={formData.certifications}
              onChange={(e) => setFormData((prev) => ({ ...prev, certifications: e.target.value }))}
              rows={4}
              placeholder="Liệt kê các chứng chỉ, giấy chứng nhận có liên quan..."
              className="mt-2"
            />
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dự án</h2>
          <div>
            <Label htmlFor="projects">Dự án đã tham gia</Label>
            <Textarea
              id="projects"
              value={formData.projects}
              onChange={(e) => setFormData((prev) => ({ ...prev, projects: e.target.value }))}
              rows={4}
              placeholder="Mô tả các dự án đã tham gia, vai trò và công nghệ sử dụng..."
              className="mt-2"
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Địa chỉ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Số nhà, tên đường..."
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="city">Thành phố</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="VD: Hà Nội, Hồ Chí Minh..."
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="country">Quốc gia</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                placeholder="VD: Vietnam"
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.DASHBOARD)}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu hồ sơ
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResumePage;

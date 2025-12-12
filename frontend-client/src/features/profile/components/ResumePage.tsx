import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../hooks/useResume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Plus,
  X,
  Save,
  ArrowLeft,
  Loader2,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { WorkExperience, Education } from '../types/resume';

export const ResumePage = () => {
  const navigate = useNavigate();
  const { resume, upsertResume, isLoading } = useResume();

  const [formData, setFormData] = useState({
    title: resume?.title || 'Hồ sơ của tôi',
    summary: resume?.summary || '',
    skills: resume?.skills || [],
    experiences: resume?.experiences || [],
    educations: resume?.educations || [],
    certifications: resume?.certifications || [],
    languages: resume?.languages || [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      company: '',
      position: '',
      startDate: '',
      isCurrent: false,
      description: '',
    };
    setFormData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExp],
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const handleAddEducation = () => {
    const newEdu: Education = {
      school: '',
      degree: '',
      major: '',
      startDate: '',
      isCurrent: false,
    };
    setFormData((prev) => ({
      ...prev,
      educations: [...prev.educations, newEdu],
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  };

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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Thông tin chung
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Tiêu đề hồ sơ</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="VD: Full-stack Developer với 5 năm kinh nghiệm"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="summary">Tóm tắt về bản thân</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                rows={6}
                placeholder="Giới thiệu về bản thân, mục tiêu nghề nghiệp, điểm mạnh..."
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng</h2>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Nhập kỹ năng (VD: ReactJS, NodeJS...)"
              />
              <Button type="button" onClick={handleAddSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Kinh nghiệm làm việc
            </h2>
            <Button type="button" variant="outline" size="sm" onClick={handleAddExperience}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm
            </Button>
          </div>
          <div className="space-y-4">
            {formData.experiences.map((exp, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Kinh nghiệm #{index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveExperience(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Công ty"
                    value={exp.company}
                    onChange={(e) => {
                      const newExps = [...formData.experiences];
                      newExps[index].company = e.target.value;
                      setFormData((prev) => ({ ...prev, experiences: newExps }));
                    }}
                  />
                  <Input
                    placeholder="Vị trí"
                    value={exp.position}
                    onChange={(e) => {
                      const newExps = [...formData.experiences];
                      newExps[index].position = e.target.value;
                      setFormData((prev) => ({ ...prev, experiences: newExps }));
                    }}
                  />
                  <Input
                    type="date"
                    placeholder="Từ ngày"
                    value={exp.startDate}
                    onChange={(e) => {
                      const newExps = [...formData.experiences];
                      newExps[index].startDate = e.target.value;
                      setFormData((prev) => ({ ...prev, experiences: newExps }));
                    }}
                  />
                  <Input
                    type="date"
                    placeholder="Đến ngày"
                    value={exp.endDate || ''}
                    disabled={exp.isCurrent}
                    onChange={(e) => {
                      const newExps = [...formData.experiences];
                      newExps[index].endDate = e.target.value;
                      setFormData((prev) => ({ ...prev, experiences: newExps }));
                    }}
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exp.isCurrent}
                    onChange={(e) => {
                      const newExps = [...formData.experiences];
                      newExps[index].isCurrent = e.target.checked;
                      if (e.target.checked) {
                        newExps[index].endDate = undefined;
                      }
                      setFormData((prev) => ({ ...prev, experiences: newExps }));
                    }}
                  />
                  <span className="text-sm text-gray-600">Đang làm việc tại đây</span>
                </label>
                <Textarea
                  placeholder="Mô tả công việc..."
                  value={exp.description}
                  rows={3}
                  onChange={(e) => {
                    const newExps = [...formData.experiences];
                    newExps[index].description = e.target.value;
                    setFormData((prev) => ({ ...prev, experiences: newExps }));
                  }}
                />
              </div>
            ))}
            {formData.experiences.length === 0 && (
              <p className="text-center text-gray-500 py-4">Chưa có kinh nghiệm làm việc</p>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Học vấn
            </h2>
            <Button type="button" variant="outline" size="sm" onClick={handleAddEducation}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm
            </Button>
          </div>
          <div className="space-y-4">
            {formData.educations.map((edu, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Học vấn #{index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEducation(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Trường học"
                    value={edu.school}
                    onChange={(e) => {
                      const newEdus = [...formData.educations];
                      newEdus[index].school = e.target.value;
                      setFormData((prev) => ({ ...prev, educations: newEdus }));
                    }}
                  />
                  <Input
                    placeholder="Bằng cấp"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdus = [...formData.educations];
                      newEdus[index].degree = e.target.value;
                      setFormData((prev) => ({ ...prev, educations: newEdus }));
                    }}
                  />
                  <Input
                    placeholder="Chuyên ngành"
                    value={edu.major}
                    onChange={(e) => {
                      const newEdus = [...formData.educations];
                      newEdus[index].major = e.target.value;
                      setFormData((prev) => ({ ...prev, educations: newEdus }));
                    }}
                  />
                  <Input
                    type="date"
                    placeholder="Từ ngày"
                    value={edu.startDate}
                    onChange={(e) => {
                      const newEdus = [...formData.educations];
                      newEdus[index].startDate = e.target.value;
                      setFormData((prev) => ({ ...prev, educations: newEdus }));
                    }}
                  />
                </div>
              </div>
            ))}
            {formData.educations.length === 0 && (
              <p className="text-center text-gray-500 py-4">Chưa có thông tin học vấn</p>
            )}
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

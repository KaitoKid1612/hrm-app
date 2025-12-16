import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../hooks/useResume';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants';
import { ResumeBasicInfo } from './resume/ResumeBasicInfo';
import { SkillsSection } from './resume/SkillsSection';
import { ExperienceSection } from './resume/ExperienceSection';
import { EducationSection } from './resume/EducationSection';

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
          summary={formData.summary}
          onTitleChange={(title) => setFormData((prev) => ({ ...prev, title }))}
          onSummaryChange={(summary) => setFormData((prev) => ({ ...prev, summary }))}
        />

        {/* Skills */}
        <SkillsSection
          skills={formData.skills}
          onSkillsChange={(skills) => setFormData((prev) => ({ ...prev, skills }))}
        />

        {/* Work Experience */}
        <ExperienceSection
          experiences={formData.experiences}
          onExperiencesChange={(experiences) => setFormData((prev) => ({ ...prev, experiences }))}
        />

        {/* Education */}
        <EducationSection
          education={formData.educations}
          onEducationChange={(educations) => setFormData((prev) => ({ ...prev, educations }))}
        />

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

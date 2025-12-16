import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Briefcase } from 'lucide-react';
import { WorkExperience } from '../../types/resume';

interface ExperienceSectionProps {
  experiences: WorkExperience[];
  onExperiencesChange: (experiences: WorkExperience[]) => void;
}

export const ExperienceSection = ({ experiences, onExperiencesChange }: ExperienceSectionProps) => {
  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      company: '',
      position: '',
      startDate: '',
      isCurrent: false,
      description: '',
    };
    onExperiencesChange([...experiences, newExp]);
  };

  const handleRemoveExperience = (index: number) => {
    onExperiencesChange(experiences.filter((_, i) => i !== index));
  };

  const handleUpdateExperience = (
    index: number,
    field: keyof WorkExperience,
    value: string | boolean,
  ) => {
    const newExps = [...experiences];
    newExps[index] = { ...newExps[index], [field]: value };
    onExperiencesChange(newExps);
  };

  return (
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
        {experiences.map((exp, index) => (
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
                onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
              />
              <Input
                placeholder="Vị trí"
                value={exp.position}
                onChange={(e) => handleUpdateExperience(index, 'position', e.target.value)}
              />
              <Input
                type="date"
                placeholder="Từ ngày"
                value={exp.startDate}
                onChange={(e) => handleUpdateExperience(index, 'startDate', e.target.value)}
              />
              <Input
                type="date"
                placeholder="Đến ngày"
                value={exp.endDate || ''}
                disabled={exp.isCurrent}
                onChange={(e) => handleUpdateExperience(index, 'endDate', e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={exp.isCurrent}
                onChange={(e) => {
                  const updates: Partial<WorkExperience> = { isCurrent: e.target.checked };
                  if (e.target.checked) {
                    updates.endDate = undefined;
                  }
                  const newExps = [...experiences];
                  newExps[index] = { ...newExps[index], ...updates };
                  onExperiencesChange(newExps);
                }}
              />
              <span className="text-sm text-gray-600">Đang làm việc tại đây</span>
            </label>
            <Textarea
              placeholder="Mô tả công việc..."
              value={exp.description}
              rows={3}
              onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
            />
          </div>
        ))}
        {experiences.length === 0 && (
          <p className="text-center text-gray-500 py-4">Chưa có kinh nghiệm làm việc</p>
        )}
      </div>
    </div>
  );
};

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, GraduationCap } from 'lucide-react';
import { Education } from '../../types/resume';

interface EducationSectionProps {
  education: Education[];
  onEducationChange: (education: Education[]) => void;
}

export const EducationSection = ({ education, onEducationChange }: EducationSectionProps) => {
  const handleAddEducation = () => {
    const newEdu: Education = {
      school: '',
      degree: '',
      major: '',
      startDate: '',
      isCurrent: false,
    };
    onEducationChange([...education, newEdu]);
  };

  const handleRemoveEducation = (index: number) => {
    onEducationChange(education.filter((_, i) => i !== index));
  };

  const handleUpdateEducation = (index: number, field: keyof Education, value: string) => {
    const newEdu = [...education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    onEducationChange(newEdu);
  };

  return (
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
        {education.map((edu, index) => (
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
                placeholder="Trường"
                value={edu.school}
                onChange={(e) => handleUpdateEducation(index, 'school', e.target.value)}
              />
              <Input
                placeholder="Bằng cấp"
                value={edu.degree}
                onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
              />
              <Input
                placeholder="Chuyên ngành"
                value={edu.major}
                onChange={(e) => handleUpdateEducation(index, 'major', e.target.value)}
              />
              <Input
                type="date"
                placeholder="Ngày bắt đầu"
                value={edu.startDate}
                onChange={(e) => handleUpdateEducation(index, 'startDate', e.target.value)}
              />
            </div>
          </div>
        ))}
        {education.length === 0 && (
          <p className="text-center text-gray-500 py-4">Chưa có học vấn</p>
        )}
      </div>
    </div>
  );
};

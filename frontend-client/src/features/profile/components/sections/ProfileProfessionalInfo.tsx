import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, DollarSign } from 'lucide-react';

interface ProfileProfessionalInfoProps {
  formData: {
    currentJobTitle: string;
    yearsOfExperience: number;
    expectedSalary: number;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileProfessionalInfo = ({ formData, onChange }: ProfileProfessionalInfoProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin nghề nghiệp</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currentJobTitle">
            <Briefcase className="w-4 h-4 inline mr-2" />
            Chức danh hiện tại
          </Label>
          <Input
            id="currentJobTitle"
            name="currentJobTitle"
            value={formData.currentJobTitle}
            onChange={onChange}
            placeholder="Senior Developer"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="yearsOfExperience">Số năm kinh nghiệm</Label>
          <Input
            id="yearsOfExperience"
            name="yearsOfExperience"
            type="number"
            value={formData.yearsOfExperience}
            onChange={onChange}
            min="0"
            className="mt-2"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="expectedSalary">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Mức lương mong muốn (VNĐ)
          </Label>
          <Input
            id="expectedSalary"
            name="expectedSalary"
            type="number"
            value={formData.expectedSalary}
            onChange={onChange}
            min="0"
            placeholder="20000000"
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};

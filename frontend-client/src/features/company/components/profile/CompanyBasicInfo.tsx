import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';

const industrys = [
  'Công nghệ thông tin',
  'Tài chính - Ngân hàng',
  'Bất động sản',
  'Y tế - Dược phẩm',
  'Giáo dục - Đào tạo',
  'Thương mại - Dịch vụ',
  'Sản xuất',
  'Du lịch - Khách sạn',
  'Truyền thông - Marketing',
  'Khác',
];

const companySizes = [
  '1-10 nhân viên',
  '11-50 nhân viên',
  '51-200 nhân viên',
  '201-500 nhân viên',
  '501-1000 nhân viên',
  '1000+ nhân viên',
];

interface CompanyBasicInfoProps {
  formData: {
    name: string;
    description: string;
    industry: string;
    size: string;
    foundedYear: number;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
}

export const CompanyBasicInfo = ({ formData, onChange }: CompanyBasicInfoProps) => {
  return (
    <div className="space-y-6">
      {/* Company Name */}
      <div>
        <Label htmlFor="name">Tên công ty *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          placeholder="Ví dụ: FPT Software"
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Mô tả công ty *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          required
          rows={5}
          placeholder="Giới thiệu về công ty của bạn..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Industry */}
        <div>
          <Label htmlFor="industry">Lĩnh vực</Label>
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={onChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chọn lĩnh vực</option>
            {industrys.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        {/* Company Size */}
        <div>
          <Label htmlFor="size">Quy mô</Label>
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={onChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chọn quy mô</option>
            {companySizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Founded Year */}
      <div>
        <Label htmlFor="foundedYear">
          <Calendar className="w-4 h-4 inline mr-1" />
          Năm thành lập
        </Label>
        <Input
          id="foundedYear"
          name="foundedYear"
          type="number"
          value={formData.foundedYear}
          onChange={onChange}
          min="1900"
          max={new Date().getFullYear()}
          placeholder="2020"
        />
      </div>
    </div>
  );
};

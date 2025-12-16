import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, TrendingUp, MapPin, DollarSign, Users, Calendar } from 'lucide-react';
import { JobFormState } from '../../hooks/useJobForm';

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

interface JobFormBasicInfoProps {
  formData: JobFormState;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
}

export const JobFormBasicInfo = ({ formData, onChange }: JobFormBasicInfoProps) => {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
            onChange={onChange}
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
                onChange={onChange}
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
                onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
            onChange={onChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <Label htmlFor="isHot" className="cursor-pointer">
            Đánh dấu là tin Hot (ưu tiên hiển thị)
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

interface ResumeBasicInfoProps {
  title: string;
  summary: string;
  onTitleChange: (title: string) => void;
  onSummaryChange: (summary: string) => void;
}

export const ResumeBasicInfo = ({
  title,
  summary,
  onTitleChange,
  onSummaryChange,
}: ResumeBasicInfoProps) => {
  return (
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
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="VD: Full-stack Developer với 5 năm kinh nghiệm"
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="summary">Tóm tắt về bản thân</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            rows={6}
            placeholder="Giới thiệu về bản thân, mục tiêu nghề nghiệp, điểm mạnh..."
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};

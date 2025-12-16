import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InviteCandidate } from '../../services/inviteService';
import { Plus } from 'lucide-react';

interface BulkInviteFormProps {
  currentCandidate: InviteCandidate;
  customMessage: string;
  onCandidateChange: (candidate: InviteCandidate) => void;
  onCustomMessageChange: (message: string) => void;
  onAddCandidate: () => void;
}

export const BulkInviteForm = ({
  currentCandidate,
  customMessage,
  onCandidateChange,
  onCustomMessageChange,
  onAddCandidate,
}: BulkInviteFormProps) => {
  return (
    <div className="space-y-6">
      {/* Add Candidate Form */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-gray-900">Thêm ứng viên</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="candidate@example.com"
              value={currentCandidate.email}
              onChange={(e) => onCandidateChange({ ...currentCandidate, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="name">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              value={currentCandidate.name}
              onChange={(e) => onCandidateChange({ ...currentCandidate, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              placeholder="0901234567"
              value={currentCandidate.phone}
              onChange={(e) => onCandidateChange({ ...currentCandidate, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="note">Ghi chú</Label>
            <Input
              id="note"
              placeholder="Kinh nghiệm 3 năm..."
              value={currentCandidate.note}
              onChange={(e) => onCandidateChange({ ...currentCandidate, note: e.target.value })}
            />
          </div>
        </div>
        <Button onClick={onAddCandidate} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Thêm vào danh sách
        </Button>
      </div>

      {/* Custom Message */}
      <div>
        <Label htmlFor="customMessage">Tin nhắn tùy chỉnh (tùy chọn)</Label>
        <Textarea
          id="customMessage"
          rows={4}
          placeholder="Thêm lời nhắn cá nhân hóa cho ứng viên..."
          value={customMessage}
          onChange={(e) => onCustomMessageChange(e.target.value)}
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Tin nhắn này sẽ được thêm vào email mời ứng tuyển
        </p>
      </div>
    </div>
  );
};

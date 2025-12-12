import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Send, Loader2, FileText } from 'lucide-react';
import { useResume } from '@/features/profile';

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  onSubmit: (data: { resumeId?: string; coverLetter?: string }) => Promise<void>;
}

export const ApplyJobModal = ({ isOpen, onClose, jobTitle, onSubmit }: ApplyJobModalProps) => {
  const navigate = useNavigate();
  const { resume } = useResume();
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit({
        resumeId: resume?.id,
        coverLetter: coverLetter.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi nộp đơn');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Nộp đơn ứng tuyển</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Title */}
          <div>
            <Label className="text-sm text-gray-600">Vị trí ứng tuyển</Label>
            <p className="text-lg font-semibold text-gray-900 mt-1">{jobTitle}</p>
          </div>

          {/* Resume Selection */}
          <div>
            <Label>Hồ sơ của bạn</Label>
            {resume ? (
              <div className="mt-2 p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{resume.title}</p>
                    <p className="text-sm text-gray-500">
                      Cập nhật: {new Date(resume.updatedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/my-resume')}
                >
                  Chỉnh sửa
                </Button>
              </div>
            ) : (
              <div className="mt-2 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800 mb-3">
                  Bạn chưa có hồ sơ. Vui lòng tạo hồ sơ trước khi ứng tuyển.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/my-resume')}
                >
                  Tạo hồ sơ ngay
                </Button>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <Label htmlFor="coverLetter">
              Thư giới thiệu <span className="text-gray-400">(Không bắt buộc)</span>
            </Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              placeholder="Viết vài dòng giới thiệu về bản thân và lý do bạn phù hợp với vị trí này..."
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Một thư giới thiệu tốt sẽ giúp bạn tạo ấn tượng với nhà tuyển dụng
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || !resume}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang nộp...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Nộp đơn
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

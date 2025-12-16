import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { reviewService } from '../services/reviewService';
import { CreateReviewDto } from '../types/review.types';
import { toast } from '@/lib/toast';
import { Star, X } from 'lucide-react';

interface WriteReviewModalProps {
  companyId: string;
  onClose: () => void;
  onSubmit: () => void;
}

export const WriteReviewModal = ({ companyId, onClose, onSubmit }: WriteReviewModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateReviewDto>({
    companyId,
    rating: 0,
    title: '',
    content: '',
    pros: '',
    cons: '',
    isAnonymous: false,
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    try {
      setIsSubmitting(true);
      await reviewService.createReview(formData);
      toast.success('Đã gửi đánh giá thành công!');
      onSubmit();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error?.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá';
      toast.error(message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Viết đánh giá</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <Label className="mb-2 block">
              Đánh giá của bạn <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || formData.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <span className="ml-2 text-lg font-semibold">
                  {formData.rating === 5 && '⭐ Xuất sắc'}
                  {formData.rating === 4 && '👍 Rất tốt'}
                  {formData.rating === 3 && '😊 Tốt'}
                  {formData.rating === 2 && '😐 Trung bình'}
                  {formData.rating === 1 && '😞 Kém'}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="mb-2 block">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ví dụ: Môi trường làm việc tuyệt vời"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={100}
            />
            <p className="text-sm text-gray-500 mt-1">{formData.title.length}/100 ký tự</p>
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content" className="mb-2 block">
              Nội dung đánh giá <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Chia sẻ trải nghiệm của bạn về công ty..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={5}
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 mt-1">{formData.content.length}/1000 ký tự</p>
          </div>

          {/* Pros */}
          <div>
            <Label htmlFor="pros" className="mb-2 block">
              Ưu điểm
            </Label>
            <Textarea
              id="pros"
              placeholder="Những điểm tích cực về công ty..."
              value={formData.pros}
              onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Cons */}
          <div>
            <Label htmlFor="cons" className="mb-2 block">
              Nhược điểm
            </Label>
            <Textarea
              id="cons"
              placeholder="Những điểm cần cải thiện..."
              value={formData.cons}
              onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Anonymous */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="anonymous" className="cursor-pointer">
              Đánh giá ẩn danh
            </Label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

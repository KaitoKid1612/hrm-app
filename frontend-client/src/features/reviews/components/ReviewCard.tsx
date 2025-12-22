import { useState } from 'react';
import { Review } from '../types/review.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { reviewService } from '../services/reviewService';
import { toast } from '@/lib/toast';
import { getImageUrl } from '@/lib/image-utils';
import { Star, ThumbsUp, User, CheckCircle, Calendar } from 'lucide-react';
import { useAuth } from '@/features/auth';

interface ReviewCardProps {
  review: Review;
  onUpdate: () => void;
}

export const ReviewCard = ({ review, onUpdate }: ReviewCardProps) => {
  const { user } = useAuth();
  const [isMarkingHelpful, setIsMarkingHelpful] = useState(false);

  const handleMarkHelpful = async () => {
    try {
      setIsMarkingHelpful(true);
      await reviewService.markHelpful(review.id);
      toast.success('Đã đánh dấu hữu ích');
      onUpdate();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      console.error(error);
    } finally {
      setIsMarkingHelpful(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              {review.isAnonymous ? (
                <User className="w-6 h-6 text-blue-600" />
              ) : review.user?.avatar ? (
                <img
                  src={getImageUrl(review.user.avatar)}
                  alt={review.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-blue-600" />
              )}
            </div>

            {/* User Info */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {review.isAnonymous ? 'Ẩn danh' : review.user?.name || 'User'}
                </span>
                {review.isVerified && <CheckCircle className="w-4 h-4 text-blue-600" />}
              </div>
              {!review.isAnonymous && review.user?.currentJobTitle && (
                <p className="text-sm text-gray-600">{review.user.currentJobTitle}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{formatDate(review.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Review Title */}
        <h3 className="text-lg font-semibold mb-2">{review.title}</h3>

        {/* Review Content */}
        <p className="text-gray-700 mb-4">{review.content}</p>

        {/* Pros & Cons */}
        {(review.pros || review.cons) && (
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {review.pros && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">👍 Ưu điểm</h4>
                <p className="text-gray-700">{review.pros}</p>
              </div>
            )}
            {review.cons && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">👎 Nhược điểm</h4>
                <p className="text-gray-700">{review.cons}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkHelpful}
            disabled={isMarkingHelpful || !user}
            className="flex items-center gap-2"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Hữu ích ({review.helpfulCount})</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

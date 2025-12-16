import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCompanyReviews, useCompanyRating } from '../hooks/useReviews';
import { WriteReviewModal } from './WriteReviewModal';
import { ReviewCard } from './ReviewCard';
import { RatingOverview } from './RatingOverview';
import { MessageSquare, Edit } from 'lucide-react';
import { useAuth } from '@/features/auth';

export const CompanyReviewsPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { user } = useAuth();
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'createdAt' | 'rating' | 'helpfulCount'>('createdAt');
  const [filterRating, setFilterRating] = useState<number | undefined>();

  const { rating } = useCompanyRating(companyId || '');
  const { reviews, page, totalPages, isLoading, error, setPage, refetch } = useCompanyReviews(
    companyId || '',
    {
      limit: 10,
      sortBy,
      sortOrder: 'desc',
      rating: filterRating,
    },
  );

  const handleWriteReview = () => {
    if (!user) {
      alert('Vui lòng đăng nhập để viết đánh giá');
      return;
    }
    setIsWriteModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    refetch();
    setIsWriteModalOpen(false);
  };

  if (!companyId) {
    return <div>Company not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Đánh giá công ty</h1>
        <p className="text-gray-600">Chia sẻ trải nghiệm của bạn với cộng đồng</p>
      </div>

      {/* Rating Overview */}
      {rating && <RatingOverview rating={rating} />}

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Filter by rating */}
          <select
            className="px-4 py-2 border rounded-lg"
            value={filterRating || ''}
            onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Tất cả đánh giá</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>

          {/* Sort */}
          <select
            className="px-4 py-2 border rounded-lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="createdAt">Mới nhất</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="helpfulCount">Hữu ích nhất</option>
          </select>
        </div>

        <Button onClick={handleWriteReview} className="flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Viết đánh giá
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải đánh giá...</p>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chưa có đánh giá nào</h3>
              <p className="text-gray-600 mb-4">Hãy là người đầu tiên đánh giá công ty này</p>
              <Button onClick={handleWriteReview}>Viết đánh giá đầu tiên</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} onUpdate={refetch} />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Trước
                </Button>
                <span className="px-4">
                  Trang {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <WriteReviewModal
          companyId={companyId}
          onClose={() => setIsWriteModalOpen(false)}
          onSubmit={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

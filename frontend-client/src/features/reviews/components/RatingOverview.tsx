import { CompanyRating } from '../types/review.types';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface RatingOverviewProps {
  rating: CompanyRating;
}

export const RatingOverview = ({ rating }: RatingOverviewProps) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {rating.averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(rating.averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">{rating.totalReviews} đánh giá</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count =
                rating.ratingDistribution[star as keyof typeof rating.ratingDistribution] || 0;
              const percentage = rating.totalReviews > 0 ? (count / rating.totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-medium">{star}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

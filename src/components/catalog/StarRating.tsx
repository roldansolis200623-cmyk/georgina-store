'use client';

import { Star } from 'lucide-react';
import { useReviewStore } from '@/lib/store/useReviewStore';

interface StarRatingProps {
  productId: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
}

export function StarRating({ productId, size = 'sm', showCount = true }: StarRatingProps) {
  const { getAverageRating, getReviewCount } = useReviewStore();
  
  const rating = getAverageRating(productId);
  const count = getReviewCount(productId);

  if (count === 0) return null;

  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-grey ml-1">({count})</span>
      )}
    </div>
  );
}
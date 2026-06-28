import { Star } from '@phosphor-icons/react';
import { cn } from '@/shared/utils/cn';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 20,
  showValue = false,
  className,
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, index) => {
          const isFilled = index < fullStars;
          const isHalf = index === fullStars && hasHalfStar;

          return (
            <Star
              key={index}
              size={size}
              weight={isFilled || isHalf ? 'fill' : 'regular'}
              className={cn(isFilled || isHalf ? 'text-[oklch(0.58_0.14_35)]' : 'text-border')}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-foreground ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

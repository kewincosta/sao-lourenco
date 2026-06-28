import { Card, CardContent } from '@/shared/common/ui/card';
import { RatingStars } from '@/shared/common/RatingStars/RatingStars';
import type { Review } from '@/shared/types';

export function ReviewListItem({ review, serviceName }: { review: Review; serviceName?: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-medium">{review.authorName || 'Anônimo'}</p>
            <p className="text-sm text-muted-foreground">{serviceName}</p>
          </div>
          <RatingStars rating={review.rating} />
        </div>
        <p className="text-sm">{review.comment}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {new Date(review.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </CardContent>
    </Card>
  );
}

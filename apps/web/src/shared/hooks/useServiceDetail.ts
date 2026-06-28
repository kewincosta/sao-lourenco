import { useQuery } from '@tanstack/react-query';

import { getServiceById } from '@/services/services.service';
import { getReviewsByService } from '@/services/reviews.service';
import { getAverageRating } from '@/shared/utils/rating';
import { queryKeys } from './queryKeys';
import { useUser } from './useUser';

export function useServiceDetail(serviceId: string | null | undefined) {
  const serviceQuery = useQuery({
    queryKey: queryKeys.service(serviceId ?? ''),
    queryFn: () => getServiceById(serviceId as string),
    enabled: !!serviceId,
  });

  const providerUserId = serviceQuery.data?.userId;

  const providerQuery = useUser(providerUserId);

  const reviewsQuery = useQuery({
    queryKey: queryKeys.reviews(serviceId ?? ''),
    queryFn: () => getReviewsByService(serviceId as string),
    enabled: !!serviceId,
  });

  const reviews = reviewsQuery.data ?? [];
  const averageRating = getAverageRating(reviews.map((r) => r.rating));

  return {
    service: serviceQuery.data ?? null,
    provider: providerQuery.data ?? null,
    reviews,
    averageRating,
    isLoading: serviceQuery.isLoading || reviewsQuery.isLoading || providerQuery.isLoading,
    isError: serviceQuery.isError || reviewsQuery.isError || providerQuery.isError,
  };
}

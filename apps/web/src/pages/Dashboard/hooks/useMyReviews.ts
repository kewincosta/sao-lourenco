import { useAllReviews } from '@/shared/hooks/useAllReviews';
import type { Service } from '@/shared/types';

export function useMyReviews(myServices: Service[]) {
  const query = useAllReviews();
  const myReviews = (query.data ?? []).filter((review) =>
    myServices.some((service) => service.id === review.serviceId),
  );

  return { ...query, data: myReviews };
}

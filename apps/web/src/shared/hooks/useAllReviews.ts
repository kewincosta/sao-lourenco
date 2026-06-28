import { useQuery } from '@tanstack/react-query';

import { getAllReviews } from '@/services/reviews.service';
import { queryKeys } from './queryKeys';

export function useAllReviews() {
  return useQuery({
    queryKey: queryKeys.allReviews,
    queryFn: getAllReviews,
  });
}

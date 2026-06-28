import { useQuery } from '@tanstack/react-query';

import { getAttractions } from '@/services/attractions.service';
import { queryKeys } from './queryKeys';

export function useAttractions() {
  return useQuery({
    queryKey: queryKeys.attractions,
    queryFn: getAttractions,
  });
}

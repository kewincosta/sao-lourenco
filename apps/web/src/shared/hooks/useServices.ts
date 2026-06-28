import { useQuery } from '@tanstack/react-query';

import { getServices } from '@/services/services.service';
import { queryKeys } from './queryKeys';

export function useServices() {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: getServices,
  });
}

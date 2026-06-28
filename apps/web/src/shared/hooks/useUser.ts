import { useQuery } from '@tanstack/react-query';

import { getUserById } from '@/services/users.service';
import { queryKeys } from './queryKeys';

export function useUser(userId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.user(userId ?? ''),
    queryFn: () => getUserById(userId as string),
    enabled: !!userId,
  });
}

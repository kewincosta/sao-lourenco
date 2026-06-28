import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteService } from '@/services/services.service';
import { queryKeys } from '@/shared/hooks/queryKeys';

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services });
    },
  });
}

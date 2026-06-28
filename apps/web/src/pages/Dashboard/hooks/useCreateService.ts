import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createService, CreateServiceInput } from '@/services/services.service';
import { queryKeys } from '@/shared/hooks/queryKeys';

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateServiceInput) => createService(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services });
    },
  });
}

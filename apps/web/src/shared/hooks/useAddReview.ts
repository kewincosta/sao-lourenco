import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addReview, AddReviewInput } from '@/services/reviews.service';
import { queryKeys } from './queryKeys';

export function useAddReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddReviewInput) => addReview(input),
    onSuccess: (_review, input) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(input.serviceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.services });
    },
  });
}

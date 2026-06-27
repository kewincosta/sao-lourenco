import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

// O :id da rota POST /services/:id/reviews é o id do serviço avaliado.
export const reviewServiceIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

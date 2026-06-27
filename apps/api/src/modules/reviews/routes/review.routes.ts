import type { FastifyInstance } from 'fastify';
import { makeReviewController } from '../factories/make-review-controller';

export async function reviewRoutes(app: FastifyInstance): Promise<void> {
  const controller = makeReviewController();

  app.post('/services/:id/reviews', controller.create);
}

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ReviewService } from '../services/review.service';
import { createReviewSchema, reviewServiceIdParamSchema } from '../schemas/review.schema';

export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id: serviceId } = reviewServiceIdParamSchema.parse(request.params);
    const data = createReviewSchema.parse(request.body);
    const review = await this.reviewService.create(serviceId, data);
    return reply.status(201).send(review);
  };
}

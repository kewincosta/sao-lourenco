import { NotFoundError } from '../../../shared/errors/http-errors';
import type { ServiceRepository } from '../../services/repositories/service.repository';
import type { Review } from '../entities/review.entity';
import type { ReviewRepository } from '../repositories/review.repository';
import type { CreateReviewInput } from '../schemas/review.schema';

/**
 * Regras de negócio de avaliações. Garante que o serviço avaliado existe
 * (via ServiceRepository) antes de criar a review.
 */
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async create(serviceId: string, input: CreateReviewInput): Promise<Review> {
    const service = await this.serviceRepository.findById(serviceId);
    if (!service) {
      throw new NotFoundError('Service not found');
    }

    return this.reviewRepository.create({
      serviceId,
      rating: input.rating,
      comment: input.comment ?? null,
    });
  }
}

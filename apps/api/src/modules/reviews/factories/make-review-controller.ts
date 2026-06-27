import { AppDataSource } from '../../../shared/database/data-source';
import { makeServiceRepository } from '../../services/factories/make-service-controller';
import { ReviewController } from '../controllers/review.controller';
import { Review } from '../entities/review.entity';
import { ReviewRepository } from '../repositories/review.repository';
import { ReviewService } from '../services/review.service';

export function makeReviewController(): ReviewController {
  const repository = new ReviewRepository(AppDataSource.getRepository(Review));
  // Cross-domínio: valida a existência do serviço avaliado.
  const service = new ReviewService(repository, makeServiceRepository());
  return new ReviewController(service);
}

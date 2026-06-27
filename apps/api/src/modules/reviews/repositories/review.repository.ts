import type { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';

export class ReviewRepository {
  constructor(private readonly repository: Repository<Review>) {}

  async create(data: Partial<Review>): Promise<Review> {
    const review = this.repository.create(data);
    return this.repository.save(review);
  }

  listByServiceId(serviceId: string): Promise<Review[]> {
    return this.repository.find({ where: { serviceId }, order: { createdAt: 'DESC' } });
  }
}

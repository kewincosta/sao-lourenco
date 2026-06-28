import { Review } from '@/shared/types';
import { dataSource } from './data-source';

export type AddReviewInput = Pick<Review, 'serviceId' | 'rating' | 'comment' | 'authorName'>;

export async function getReviewsByService(serviceId: string): Promise<Review[]> {
  return dataSource.reviews.filter((r) => r.serviceId === serviceId);
}

export async function getAllReviews(): Promise<Review[]> {
  return dataSource.reviews;
}

export async function addReview(input: AddReviewInput): Promise<Review> {
  const review: Review = {
    id: Date.now().toString(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  dataSource.reviews.push(review);
  return review;
}

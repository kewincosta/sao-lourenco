import { beforeEach, describe, expect, it } from 'vitest';

import { resetDataSource, dataSource } from './data-source';
import { mockReviews } from './mock-data';
import { getReviewsByService, getAllReviews, addReview } from './reviews.service';

describe('reviews.service', () => {
  beforeEach(() => {
    resetDataSource();
  });

  it('getReviewsByService returns only reviews for that service', async () => {
    const reviews = await getReviewsByService('1');
    expect(reviews).toEqual(mockReviews.filter((r) => r.serviceId === '1'));
    expect(reviews.every((r) => r.serviceId === '1')).toBe(true);
  });

  it('getReviewsByService returns an empty array when service has no reviews', async () => {
    const reviews = await getReviewsByService('non-existent-service');
    expect(reviews).toEqual([]);
  });

  it('getAllReviews returns all reviews', async () => {
    const reviews = await getAllReviews();
    expect(reviews).toEqual(mockReviews);
  });

  it('addReview adds a new review to the data-source', async () => {
    const initialLength = dataSource.reviews.length;
    const review = await addReview({
      serviceId: '1',
      rating: 5,
      comment: 'Great service',
      authorName: 'Tester',
    });

    expect(review.serviceId).toBe('1');
    expect(review.rating).toBe(5);
    expect(review.comment).toBe('Great service');
    expect(review.authorName).toBe('Tester');
    expect(review.id).toBeDefined();
    expect(review.createdAt).toBeDefined();
    expect(dataSource.reviews.length).toBe(initialLength + 1);
    expect(dataSource.reviews).toContainEqual(review);
  });
});

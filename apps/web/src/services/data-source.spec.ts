import { beforeEach, describe, expect, it } from 'vitest';

import { mockUsers, mockServices, mockReviews, mockAttractions } from './mock-data';
import { dataSource, resetDataSource } from './data-source';

describe('data-source', () => {
  beforeEach(() => {
    resetDataSource();
  });

  it('seeds initial state matching mock-data (same size and content)', () => {
    expect(dataSource.users).toEqual(mockUsers);
    expect(dataSource.services).toEqual(mockServices);
    expect(dataSource.reviews).toEqual(mockReviews);
    expect(dataSource.attractions).toEqual(mockAttractions);
    expect(dataSource.users.length).toBe(mockUsers.length);
    expect(dataSource.services.length).toBe(mockServices.length);
    expect(dataSource.reviews.length).toBe(mockReviews.length);
    expect(dataSource.attractions.length).toBe(mockAttractions.length);
  });

  it('resetDataSource restores original state after mutation', () => {
    dataSource.services.push({ ...mockServices[0], id: 'new-id' });
    dataSource.users.splice(0, 1);
    expect(dataSource.services.length).toBe(mockServices.length + 1);

    resetDataSource();

    expect(dataSource.services).toEqual(mockServices);
    expect(dataSource.users).toEqual(mockUsers);
  });

  it('mutating data-source arrays does not alter the original mock-data arrays (deep copy proof)', () => {
    const originalServicesLength = mockServices.length;
    const originalUsersLength = mockUsers.length;
    const originalReviewsLength = mockReviews.length;
    const originalHighlightsLength = mockAttractions[0].highlights.length;

    dataSource.services.push({ ...mockServices[0], id: 'mutated' });
    dataSource.users[0].name = 'Mutated Name';
    dataSource.reviews.splice(0, 1);
    dataSource.attractions[0].highlights.push('mutated highlight');

    expect(mockServices.length).toBe(originalServicesLength);
    expect(mockUsers[0].name).not.toBe('Mutated Name');
    expect(mockReviews.length).toBe(originalReviewsLength);
    expect(mockAttractions[0].highlights.length).toBe(originalHighlightsLength);
    expect(mockAttractions[0].highlights).not.toContain('mutated highlight');
    expect(mockUsers.length).toBe(originalUsersLength);
  });
});

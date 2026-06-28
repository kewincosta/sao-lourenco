import { describe, expect, it } from 'vitest';

import { getAverageRating, getRatingDistribution } from './rating';

describe('getAverageRating', () => {
  it('returns 0 for an empty list', () => {
    expect(getAverageRating([])).toBe(0);
  });

  it('returns the correct average for a list of ratings', () => {
    expect(getAverageRating([5, 4, 3])).toBe(4);
  });
});

describe('getRatingDistribution', () => {
  it('returns all stars with count 0 and percentage 0 for an empty list', () => {
    expect(getRatingDistribution([])).toEqual([
      { star: 5, count: 0, percentage: 0 },
      { star: 4, count: 0, percentage: 0 },
      { star: 3, count: 0, percentage: 0 },
      { star: 2, count: 0, percentage: 0 },
      { star: 1, count: 0, percentage: 0 },
    ]);
  });

  it('returns correct count and percentage for a list of ratings', () => {
    expect(getRatingDistribution([5, 5, 4, 3, 5])).toEqual([
      { star: 5, count: 3, percentage: 60 },
      { star: 4, count: 1, percentage: 20 },
      { star: 3, count: 1, percentage: 20 },
      { star: 2, count: 0, percentage: 0 },
      { star: 1, count: 0, percentage: 0 },
    ]);
  });
});

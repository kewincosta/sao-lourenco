export function getAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}

export function getRatingDistribution(
  ratings: number[],
): { star: number; count: number; percentage: number }[] {
  return [5, 4, 3, 2, 1].map((star) => {
    const count = ratings.filter((r) => r === star).length;
    return {
      star,
      count,
      percentage: ratings.length > 0 ? (count / ratings.length) * 100 : 0,
    };
  });
}

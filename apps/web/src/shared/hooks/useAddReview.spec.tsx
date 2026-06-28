import { beforeEach, describe, expect, it } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { resetDataSource } from '@/services/data-source';
import { mockServices, mockReviews } from '@/services/mock-data';
import { getAverageRating } from '@/shared/utils/rating';
import { useAddReview } from './useAddReview';
import { useServiceDetail } from './useServiceDetail';
import { useServices } from './useServices';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useAddReview', () => {
  beforeEach(() => {
    resetDataSource();
  });

  it('adds a review and invalidates reviews/services so useServiceDetail reflects the new average', async () => {
    const service = mockServices[0];
    const wrapper = createWrapper();

    const { result: detailResult } = renderHook(() => useServiceDetail(service.id), { wrapper });
    await waitFor(() => expect(detailResult.current.isLoading).toBe(false));

    const existingReviews = mockReviews.filter((r) => r.serviceId === service.id);
    const originalAverage = getAverageRating(existingReviews.map((r) => r.rating));
    expect(detailResult.current.averageRating).toBe(originalAverage);

    const { result: mutationResult } = renderHook(() => useAddReview(), { wrapper });

    await act(async () => {
      await mutationResult.current.mutateAsync({
        serviceId: service.id,
        rating: 1,
        comment: 'Not great',
        authorName: 'Tester',
      });
    });

    await waitFor(() =>
      expect(detailResult.current.reviews.length).toBe(existingReviews.length + 1),
    );

    const expectedNewAverage = getAverageRating([...existingReviews.map((r) => r.rating), 1]);
    expect(detailResult.current.averageRating).toBe(expectedNewAverage);
    expect(detailResult.current.reviews.some((r) => r.comment === 'Not great')).toBe(true);
  });

  it('invalidates the services query so other consumers (e.g. Home) refetch', async () => {
    const service = mockServices[0];
    const wrapper = createWrapper();

    const { result: servicesResult } = renderHook(() => useServices(), { wrapper });
    await waitFor(() => expect(servicesResult.current.isLoading).toBe(false));
    const dataUpdatedAtBefore = servicesResult.current.dataUpdatedAt;
    await new Promise((resolve) => setTimeout(resolve, 5));

    const { result: mutationResult } = renderHook(() => useAddReview(), { wrapper });

    await act(async () => {
      await mutationResult.current.mutateAsync({
        serviceId: service.id,
        rating: 3,
        comment: 'Another review',
      });
    });

    await waitFor(() => expect(servicesResult.current.isFetching).toBe(false));

    // The query was invalidated and refetched (a fresh fetch happened after the mutation),
    // proving useServices is wired to the same invalidation as useServiceDetail/useAddReview.
    expect(servicesResult.current.dataUpdatedAt).toBeGreaterThan(dataUpdatedAtBefore);
  });
});

import { beforeEach, describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { resetDataSource } from '@/services/data-source';
import { mockServices, mockUsers, mockReviews } from '@/services/mock-data';
import { getAverageRating } from '@/shared/utils/rating';
import { useServiceDetail } from './useServiceDetail';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useServiceDetail', () => {
  beforeEach(() => {
    resetDataSource();
  });

  it('returns service, provider, reviews and average rating for a valid id', async () => {
    const service = mockServices[0];
    const provider = mockUsers.find((u) => u.id === service.userId);
    const expectedReviews = mockReviews.filter((r) => r.serviceId === service.id);
    const expectedAverage = getAverageRating(expectedReviews.map((r) => r.rating));

    const { result } = renderHook(() => useServiceDetail(service.id), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.service).toEqual(service);
    expect(result.current.provider).toEqual(provider);
    expect(result.current.reviews).toEqual(expectedReviews);
    expect(result.current.averageRating).toBe(expectedAverage);
  });

  it('returns null service/provider, empty reviews and average 0 when no id is provided', async () => {
    const { result } = renderHook(() => useServiceDetail(undefined), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.service).toBeNull();
    expect(result.current.provider).toBeNull();
    expect(result.current.reviews).toEqual([]);
    expect(result.current.averageRating).toBe(0);
  });
});

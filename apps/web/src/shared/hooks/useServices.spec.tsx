import { beforeEach, describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { resetDataSource } from '@/services/data-source';
import { mockServices } from '@/services/mock-data';
import { useServices } from './useServices';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useServices', () => {
  beforeEach(() => {
    resetDataSource();
  });

  it('returns the seeded list of services', async () => {
    const { result } = renderHook(() => useServices(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockServices);
  });
});

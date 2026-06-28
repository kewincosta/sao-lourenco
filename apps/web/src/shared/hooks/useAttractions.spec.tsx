import { beforeEach, describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { resetDataSource } from '@/services/data-source';
import { mockAttractions } from '@/services/mock-data';
import { useAttractions } from './useAttractions';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useAttractions', () => {
  beforeEach(() => {
    resetDataSource();
  });

  it('returns the seeded list of attractions', async () => {
    const { result } = renderHook(() => useAttractions(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockAttractions);
  });
});

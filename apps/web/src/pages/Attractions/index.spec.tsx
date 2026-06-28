import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { resetDataSource } from '@/services/data-source';
import { mockAttractions } from '@/services/mock-data';
import { AttractionsPage } from './index';

function renderWithQueryClient(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('AttractionsPage', () => {
  beforeEach(() => {
    resetDataSource();
  });

  it('renders the list of attractions', async () => {
    renderWithQueryClient(<AttractionsPage />);

    await waitFor(() => {
      expect(screen.getByText(mockAttractions[0].name)).toBeInTheDocument();
    });
    mockAttractions.forEach((attraction) => {
      expect(screen.getByText(attraction.name)).toBeInTheDocument();
    });
  });

  it('opens the detail modal with name, description, and highlights when a card is clicked', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<AttractionsPage />);

    const target = mockAttractions[0];
    await waitFor(() => expect(screen.getByText(target.name)).toBeInTheDocument());

    await user.click(screen.getAllByText(target.name)[0]);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: target.name })).toBeInTheDocument();
    expect(within(dialog).getByText(target.description)).toBeInTheDocument();
    target.highlights.forEach((highlight) => {
      expect(within(dialog).getByText(highlight)).toBeInTheDocument();
    });
  });
});

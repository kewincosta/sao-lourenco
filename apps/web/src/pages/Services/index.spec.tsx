import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { resetDataSource } from '@/services/data-source';
import { mockServices } from '@/services/mock-data';
import { categoryLabels } from '@/shared/types';
import { ServicesPage } from './index';

// Radix Select relies on pointer capture / scrollIntoView APIs that jsdom does not implement.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

function renderWithQueryClient(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('ServicesPage', () => {
  beforeEach(() => {
    resetDataSource();
  });

  it('renders the seeded list of services', async () => {
    renderWithQueryClient(<ServicesPage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: mockServices[0].name })).toBeInTheDocument();
    });
    expect(
      screen.getByRole('heading', { name: mockServices[mockServices.length - 1].name }),
    ).toBeInTheDocument();
  });

  it('filters the list by search text', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<ServicesPage />);

    const target = mockServices.find((s) => s.name.includes('Pousada Serra Verde'))!;
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: target.name })).toBeInTheDocument(),
    );

    await user.type(screen.getByPlaceholderText('Buscar serviços...'), 'Pousada Serra Verde');

    expect(screen.getByRole('heading', { name: target.name })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: mockServices[0].name })).not.toBeInTheDocument();
  });

  it('filters the list by category', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<ServicesPage />);

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: mockServices[0].name })).toBeInTheDocument(),
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: categoryLabels.restaurant }));

    const restaurantServices = mockServices.filter((s) => s.category === 'restaurant');
    const nonRestaurantServices = mockServices.filter((s) => s.category !== 'restaurant');

    restaurantServices.forEach((service) => {
      expect(screen.getByRole('heading', { name: service.name })).toBeInTheDocument();
    });
    nonRestaurantServices.forEach((service) => {
      expect(screen.queryByRole('heading', { name: service.name })).not.toBeInTheDocument();
    });
  });

  it('shows the empty state when no service matches the filters', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<ServicesPage />);

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: mockServices[0].name })).toBeInTheDocument(),
    );

    await user.type(screen.getByPlaceholderText('Buscar serviços...'), 'serviço inexistente xyz');

    expect(screen.getByText('Nenhum serviço encontrado')).toBeInTheDocument();
  });

  it('opens the detail modal with the service data when a card is clicked', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<ServicesPage />);

    const target = mockServices[0];
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: target.name })).toBeInTheDocument(),
    );

    await user.click(screen.getByRole('heading', { name: target.name }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: target.name })).toBeInTheDocument();
  });

  it('updates the displayed average rating after submitting a new review', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<ServicesPage />);

    const target = mockServices[0];
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: target.name })).toBeInTheDocument(),
    );

    await user.click(screen.getByRole('heading', { name: target.name }));
    const dialog = await screen.findByRole('dialog');

    const averageBefore = within(dialog).getAllByText(/^\d\.\d$/)[0].textContent;

    const ratingButtons = within(within(dialog).getByText('Sua nota').parentElement!).getAllByRole(
      'button',
    );
    await user.click(ratingButtons[0]);
    await user.type(
      within(dialog).getByPlaceholderText('Compartilhe sua experiência com este serviço...'),
      'Excelente experiência!',
    );
    await user.click(within(dialog).getByRole('button', { name: 'Publicar Avaliação' }));

    await waitFor(() => {
      const averageAfter = within(dialog).getAllByText(/^\d\.\d$/)[0].textContent;
      expect(averageAfter).not.toBe(averageBefore);
    });
  });
});

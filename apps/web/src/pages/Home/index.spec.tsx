import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';

import { resetDataSource } from '@/services/data-source';
import { mockServices, mockAttractions } from '@/services/mock-data';
import { HomePage } from './index';

function renderWithProviders(ui: ReactNode, initialEntries: string[] = ['/']) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={ui} />
          <Route path="/servicos" element={<div>Services Page Marker</div>} />
          <Route path="/atracoes" element={<div>Attractions Page Marker</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    resetDataSource();
  });

  it('renders the featured services, popular experiences, and attractions preview sections', async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText('Serviços em Destaque')).toBeInTheDocument();
    expect(screen.getByText('Experiências Populares')).toBeInTheDocument();
    expect(screen.getByText('Atrações Turísticas')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(mockServices[0].name)).toBeInTheDocument();
    });
    expect(screen.getByText(mockAttractions[0].name)).toBeInTheDocument();
  });

  it('navigates to services when the hero search is triggered', async () => {
    renderWithProviders(<HomePage />);

    await screen.findByPlaceholderText('O que você procura?');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Buscar' }));

    expect(await screen.findByText('Services Page Marker')).toBeInTheDocument();
  });

  it('opens the service detail modal with the service data when a featured card is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);

    const target = mockServices[0];
    await waitFor(() => expect(screen.getByText(target.name)).toBeInTheDocument());

    await user.click(screen.getAllByText(target.name)[0]);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: target.name })).toBeInTheDocument();
    expect(within(dialog).getByText(target.description)).toBeInTheDocument();
  });

  it('navigates to attractions when "Ver Todas as Atrações" is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'Ver Todas as Atrações' }));

    expect(await screen.findByText('Attractions Page Marker')).toBeInTheDocument();
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { resetDataSource } from '@/services/data-source';
import { mockServices, mockReviews, mockUsers } from '@/services/mock-data';
import { useAuthStore } from '@/shared/stores/auth.store';
import { DashboardPage } from './index';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function renderWithQueryClient(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

// User 1 (Maria Silva Santos) owns seed services '1' and '13'.
const loggedInUser = mockUsers.find((u) => u.id === '1')!;
const myServiceIds = mockServices.filter((s) => s.userId === '1').map((s) => s.id);
const myReviews = mockReviews.filter((r) => myServiceIds.includes(r.serviceId));

describe('DashboardPage', () => {
  beforeEach(() => {
    resetDataSource();
    useAuthStore.setState({ user: loggedInUser, isAuthenticated: true });
  });

  it('shows the correct stats cards for the logged-in user services and reviews', async () => {
    renderWithQueryClient(<DashboardPage onNavigate={() => {}} />);

    const expectedAverage =
      myReviews.length > 0
        ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
        : '0.0';

    await waitFor(() => {
      const statsSection = screen.getByText('Total de Serviços').closest('.grid') as HTMLElement;
      expect(within(statsSection).getByText(String(myServiceIds.length))).toBeInTheDocument();
      expect(within(statsSection).getByText(expectedAverage)).toBeInTheDocument();
      expect(within(statsSection).getByText(String(myReviews.length))).toBeInTheDocument();
    });
  });

  it('adds a new service and shows it in the "Meus Serviços" list', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<DashboardPage onNavigate={() => {}} />);

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Meus Serviços' })).toBeInTheDocument(),
    );

    await user.click(screen.getByRole('button', { name: 'Adicionar Serviço' }));
    await user.type(screen.getByLabelText('Nome do Serviço'), 'Passeio Novo');
    await user.type(screen.getByLabelText('Descrição'), 'Um passeio incrível');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => {
      expect(screen.getByText('Passeio Novo')).toBeInTheDocument();
    });
  });

  it('deletes a seed service belonging to the logged-in user and removes its card', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<DashboardPage onNavigate={() => {}} />);

    const seedService = mockServices.find((s) => s.id === myServiceIds[0])!;
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: seedService.name })).toBeInTheDocument(),
    );

    const heading = screen.getByRole('heading', { name: seedService.name });
    const card = heading.closest('[data-slot="card"]') as HTMLElement;
    const deleteButton = within(card)
      .getAllByRole('button')
      .find((btn) => btn.className.includes('bg-destructive'))!;
    expect(deleteButton).toBeDefined();
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: seedService.name })).not.toBeInTheDocument();
    });
  });

  it('switches between "Meus Serviços" and "Avaliações Recebidas" tabs', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<DashboardPage onNavigate={() => {}} />);

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Meus Serviços' })).toBeInTheDocument(),
    );

    expect(screen.queryByRole('heading', { name: 'Avaliações Recebidas' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Avaliações Recebidas' }));

    expect(screen.getByRole('heading', { name: 'Avaliações Recebidas' })).toBeInTheDocument();
  });
});

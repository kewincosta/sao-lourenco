import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { resetDataSource } from '@/services/data-source';
import { useAuthStore } from '@/shared/stores/auth.store';
import { routes } from '@/routes';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}));

function renderAtRoute(initialEntries: string[]) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const router = createMemoryRouter(routes, { initialEntries });
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('routing', () => {
  beforeEach(() => {
    resetDataSource();
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it('renders the Home page at /', async () => {
    renderAtRoute(['/']);

    expect(screen.getByText('Serviços em Destaque')).toBeInTheDocument();
  });

  it('renders the Services page at /servicos', async () => {
    renderAtRoute(['/servicos']);

    expect(screen.getByText('Serviços Turísticos')).toBeInTheDocument();
  });

  it('renders the Attractions page at /atracoes', async () => {
    renderAtRoute(['/atracoes']);

    expect(screen.getByRole('heading', { name: 'Atrações Turísticas' })).toBeInTheDocument();
  });

  it('renders the Login page at /login', async () => {
    renderAtRoute(['/login']);

    expect(screen.getByText('Acesse sua conta com CPF ou CNPJ')).toBeInTheDocument();
  });

  it('renders the Register page at /cadastro', async () => {
    renderAtRoute(['/cadastro']);

    expect(screen.getByText('Preencha os dados para começar a anunciar')).toBeInTheDocument();
  });

  it('redirects to /login when accessing /dashboard while unauthenticated', async () => {
    renderAtRoute(['/dashboard']);

    await waitFor(() => {
      expect(screen.getByText('Acesse sua conta com CPF ou CNPJ')).toBeInTheDocument();
    });
  });

  it('redirects to / when accessing an unknown route', async () => {
    renderAtRoute(['/rota-que-nao-existe']);

    expect(screen.getByText('Serviços em Destaque')).toBeInTheDocument();
  });

  it('logs in with a valid document and navigates to the Dashboard with its content', async () => {
    const user = userEvent.setup();
    renderAtRoute(['/login']);

    const documentInput = screen.getByLabelText('CPF ou CNPJ');
    await user.type(documentInput, '123.456.789-00');
    const form = documentInput.closest('form') as HTMLFormElement;
    await user.click(within(form).getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    });
    expect(screen.getByText('Bem-vindo, Maria Silva Santos')).toBeInTheDocument();
  });
});

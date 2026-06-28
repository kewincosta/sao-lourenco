import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'sonner';
import { LoginPage } from './index';
import { useAuthStore } from '@/shared/stores/auth.store';
import { resetDataSource } from '@/services/data-source';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<div>Dashboard Page Marker</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetDataSource();
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it('authenticates and navigates to dashboard with a welcome toast for a known document', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await user.type(screen.getByLabelText('CPF ou CNPJ'), '123.456.789-00');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(toast.success).toHaveBeenCalledWith('Bem-vindo, Maria Silva Santos!');
    expect(await screen.findByText('Dashboard Page Marker')).toBeInTheDocument();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.name).toBe('Maria Silva Santos');
  });

  it('shows an error toast and does not navigate for an unknown document', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await user.type(screen.getByLabelText('CPF ou CNPJ'), '000.000.000-00');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(toast.error).toHaveBeenCalledWith('CPF/CNPJ não encontrado');
    expect(screen.queryByText('Dashboard Page Marker')).not.toBeInTheDocument();
  });

  it('keeps the user deslogged after a failed login attempt', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await user.type(screen.getByLabelText('CPF ou CNPJ'), '000.000.000-00');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});

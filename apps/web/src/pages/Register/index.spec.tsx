import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { RegisterPage } from './index';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  async function fillAndSubmit() {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('CPF ou CNPJ'), '123.456.789-00');
    await user.type(screen.getByLabelText('Nome/Razão Social'), 'Empresa Teste');
    await user.type(screen.getByLabelText('E-mail'), 'teste@email.com');
    await user.type(screen.getByLabelText('WhatsApp'), '(35) 99999-9999');
    await user.type(screen.getByLabelText('Endereço Completo'), 'Rua Teste, 1, Centro, SL - MG');
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }));
  }

  it('shows a success toast on submit', async () => {
    const onNavigate = vi.fn();
    render(<RegisterPage onNavigate={onNavigate} />);

    await fillAndSubmit();

    expect(toast.success).toHaveBeenCalledWith('Cadastro realizado! Faça login para continuar.');
  });

  it('navigates to login after submit', async () => {
    const onNavigate = vi.fn();
    render(<RegisterPage onNavigate={onNavigate} />);

    await fillAndSubmit();

    expect(onNavigate).toHaveBeenCalledWith('login');
  });
});

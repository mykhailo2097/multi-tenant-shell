import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mts/theme-kit';
import { ApiProvider } from '../api/ApiProvider';
import { SessionProvider } from '../session/SessionProvider';
import { TenantProvider } from '../tenant/TenantProvider';
import type { ApiClient } from '../api/types';
import { LoginPage } from './LoginPage';

function renderLogin(client: ApiClient) {
  return render(
    <MemoryRouter>
      <TenantProvider>
        <SessionProvider>
          <ApiProvider client={client}>
            <ThemeProvider>
              <LoginPage />
            </ThemeProvider>
          </ApiProvider>
        </SessionProvider>
      </TenantProvider>
    </MemoryRouter>,
  );
}

const okClient: ApiClient = {
  identity: { login: vi.fn().mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'a' }) },
  billing: { getInvoices: vi.fn(), createPayment: vi.fn() },
};

describe('LoginPage', () => {
  it('shows validation errors and does not call the API for invalid input', async () => {
    const login = vi.fn();
    renderLogin({ ...okClient, identity: { login } });

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('calls the injected identity adapter with valid input', async () => {
    const login = vi.fn().mockResolvedValue({ id: 'u1', email: 'user@example.com', name: 'user' });
    renderLogin({ ...okClient, identity: { login } });

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret1');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(login).toHaveBeenCalledWith('user@example.com', 'secret1');
  });

  it('surfaces an auth error returned by the adapter', async () => {
    const login = vi.fn().mockRejectedValue(new Error('Invalid email or password.'));
    renderLogin({ ...okClient, identity: { login } });

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret1');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid email or password/i);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mts/theme-kit';
import { ApiProvider } from '../../api/ApiProvider';
import { TenantProvider } from '../../tenant/TenantProvider';
import type { ApiClient, BillingApi, Invoice } from '../../api/types';
import { InvoicesCard } from './InvoicesCard';

function renderCard(billing: BillingApi) {
  const client: ApiClient = { identity: { login: vi.fn() }, billing };
  return render(
    <TenantProvider>
      <ApiProvider client={client}>
        <ThemeProvider>
          <InvoicesCard />
        </ThemeProvider>
      </ApiProvider>
    </TenantProvider>,
  );
}

const invoices: Invoice[] = [
  { id: 'inv-1', date: '2026-01-01', amountCents: 1000, status: 'paid' },
];

describe('InvoicesCard', () => {
  it('shows a loading state, then the invoices', async () => {
    renderCard({ getInvoices: vi.fn().mockResolvedValue(invoices), createPayment: vi.fn() });

    expect(screen.getByText(/loading invoices/i)).toBeInTheDocument();
    expect(await screen.findByText('inv-1')).toBeInTheDocument();
  });

  it('shows the empty state when there are no invoices', async () => {
    renderCard({ getInvoices: vi.fn().mockResolvedValue([]), createPayment: vi.fn() });

    expect(await screen.findByText(/no invoices yet/i)).toBeInTheDocument();
  });

  it('shows an error and recovers on retry', async () => {
    const getInvoices = vi
      .fn()
      .mockRejectedValueOnce(new Error('Billing is down'))
      .mockResolvedValueOnce(invoices);
    renderCard({ getInvoices, createPayment: vi.fn() });

    expect(await screen.findByText('Billing is down')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(await screen.findByText('inv-1')).toBeInTheDocument();
    expect(getInvoices).toHaveBeenCalledTimes(2);
  });
});

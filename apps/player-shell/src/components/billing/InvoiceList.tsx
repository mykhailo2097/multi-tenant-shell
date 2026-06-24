import type { ReactNode } from 'react';
import { formatMoney } from '../../lib/validation';
import type { LoadState } from './types';

export function InvoiceList({
  state,
  locale,
  currency,
  retryButton,
}: {
  state: LoadState;
  locale: string;
  currency: string;
  retryButton: ReactNode;
}) {
  if (state.status === 'loading') {
    return (
      <p className="text-brand-text-muted m-0" role="status" aria-live="polite">
        Loading invoices…
      </p>
    );
  }

  if (state.status === 'error') {
    return (
      <div role="alert">
        <p className="text-brand-danger text-[13px] mt-0">{state.message}</p>
        {retryButton}
      </div>
    );
  }

  if (state.invoices.length === 0) {
    return (
      <p className="text-brand-text-muted m-0">
        No invoices yet. New invoices will appear here once issued.
      </p>
    );
  }

  return (
    <ul className="list-none m-0 p-0 grid gap-2">
      {state.invoices.map((inv) => (
        <li
          key={inv.id}
          className="flex justify-between py-2.5 border-b border-brand-border"
        >
          <span>
            <strong>{inv.id}</strong> <span className="text-brand-text-muted">· {inv.date}</span>
          </span>
          <span>
            {formatMoney(inv.amountCents, locale, currency)}{' '}
            <span className={inv.status === 'due' ? 'text-brand-danger' : 'text-brand-text-muted'}>
              ({inv.status})
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

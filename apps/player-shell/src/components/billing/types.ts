import type { Invoice } from '../../api/types';

export type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; invoices: Invoice[] };

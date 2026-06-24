import type { ApiClient, IdentityApi, BillingApi, Invoice } from './types';
import { BRAND_ID } from '../config/brands';
import { MOCK_LATENCY_MS, DEMO_FAILING_EMAIL, DEMO_ERROR_TENANT_ID } from './mock.constants';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const SEED_INVOICES: Record<string, Invoice[]> = {
  [BRAND_ID.tenantAlpha]: [
    { id: 'inv-1024', date: '2026-05-01', amountCents: 4999, status: 'paid' },
    { id: 'inv-1025', date: '2026-06-01', amountCents: 4999, status: 'due' },
  ],
  [BRAND_ID.default]: [
    { id: 'inv-2087', date: '2026-05-15', amountCents: 1500, status: 'paid' },
    { id: 'inv-2092', date: '2026-06-15', amountCents: 1500, status: 'due' },
  ],
};

export const mockIdentityApi: IdentityApi = {
  async login(email, password) {
    await delay(MOCK_LATENCY_MS.login);
    if (email === DEMO_FAILING_EMAIL || password.length < 1) {
      throw new Error('Invalid email or password.');
    }
    return { id: 'user-1', email, name: email.split('@')[0] };
  },
};

export const mockBillingApi: BillingApi = {
  async getInvoices(tenantId) {
    await delay(MOCK_LATENCY_MS.getInvoices);
    if (tenantId === DEMO_ERROR_TENANT_ID) {
      throw new Error('Billing service is temporarily unavailable.');
    }
    return SEED_INVOICES[tenantId] ?? [];
  },

  async createPayment(_tenantId, amountCents) {
    await delay(MOCK_LATENCY_MS.createPayment);
    if (amountCents <= 0) {
      throw new Error('Amount must be greater than zero.');
    }
    return { id: `pay-${Date.now()}`, amountCents };
  },
};

export const mockApiClient: ApiClient = {
  identity: mockIdentityApi,
  billing: mockBillingApi,
};

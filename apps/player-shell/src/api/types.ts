export interface User {
  id: string;
  email: string;
  name: string;
}

export interface IdentityApi {
  login(email: string, password: string): Promise<User>;
}

export interface Invoice {
  id: string;
  date: string;
  amountCents: number;
  status: 'paid' | 'due';
}

export interface PaymentResult {
  id: string;
  amountCents: number;
}

export interface BillingApi {
  getInvoices(tenantId: string): Promise<Invoice[]>;
  createPayment(tenantId: string, amountCents: number): Promise<PaymentResult>;
}

export interface ApiClient {
  identity: IdentityApi;
  billing: BillingApi;
}

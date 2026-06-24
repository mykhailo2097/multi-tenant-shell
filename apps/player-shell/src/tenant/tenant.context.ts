import { createContext, useContext } from 'react';
import { BRAND_ID } from '../config/brands';

export interface Tenant {
  brandId: string;
  name: string;
  locale: string;
  currency: string;
}

export const TENANTS: Record<string, Tenant> = {
  [BRAND_ID.tenantAlpha]: {
    brandId: BRAND_ID.tenantAlpha,
    name: 'Tenant Alpha',
    locale: 'en-US',
    currency: 'USD',
  },
  [BRAND_ID.default]: {
    brandId: BRAND_ID.default,
    name: 'Default Tenant',
    locale: 'en-GB',
    currency: 'GBP',
  },
};

export interface TenantContextValue {
  tenant: Tenant;
  setBrandId: (brandId: string) => void;
}

export const TenantContext = createContext<TenantContextValue | null>(null);

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within a <TenantProvider>');
  return ctx;
}

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { BRAND_ID } from '../config/brands';
import { TENANTS, TenantContext } from './tenant.context';
import type { TenantContextValue } from './tenant.context';

export function TenantProvider({
  initialBrandId = BRAND_ID.tenantAlpha,
  children,
}: {
  initialBrandId?: string;
  children: ReactNode;
}) {
  const [brandId, setBrandId] = useState(initialBrandId);

  const value = useMemo<TenantContextValue>(
    () => ({
      tenant: TENANTS[brandId] ?? TENANTS[BRAND_ID.default],
      setBrandId,
    }),
    [brandId],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

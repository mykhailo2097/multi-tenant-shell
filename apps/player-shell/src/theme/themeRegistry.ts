import type { BrandTheme } from '@mts/theme-kit';
import { themeTenantAlpha } from 'theme-tenant-alpha';
import { BRAND_ID } from '../config/brands';

const THEME_REGISTRY: Record<string, BrandTheme> = {
  [BRAND_ID.tenantAlpha]: themeTenantAlpha,
};

export function resolveTheme(brandId: string): BrandTheme | undefined {
  return THEME_REGISTRY[brandId];
}

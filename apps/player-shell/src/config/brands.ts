export const BRAND_ID = {
  tenantAlpha: 'tenant-alpha',
  default: 'tenant-default',
} as const;

export type BrandId = (typeof BRAND_ID)[keyof typeof BRAND_ID];

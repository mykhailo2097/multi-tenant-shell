import type { ReactNode } from 'react';
import { ThemeProvider } from '@mts/theme-kit';
import { useTenant } from './tenant/tenant.context';
import { resolveTheme } from './theme/themeRegistry';

export function ThemedApp({ children }: { children: ReactNode }) {
  const { tenant } = useTenant();
  const theme = resolveTheme(tenant.brandId);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

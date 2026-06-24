import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { BrandTheme, BrandComponents } from './types';
import { fallbackTheme } from './fallbackTheme';

const ThemeContext = createContext<BrandTheme>(fallbackTheme);

interface ThemeProviderProps {
  theme?: BrandTheme;
  children: ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const active = theme ?? fallbackTheme;
  return (
    <ThemeContext.Provider value={active}>
      <div className={`${active.tokenClass} min-h-full`} data-theme={active.id}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): BrandTheme {
  return useContext(ThemeContext);
}

export function useBrandComponents(): BrandComponents {
  return useContext(ThemeContext).components;
}

import type { ComponentType, ReactNode } from 'react';

export interface BrandButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

export interface BrandCardProps {
  title?: string;
  children: ReactNode;
}

export interface BrandComponents {
  Button: ComponentType<BrandButtonProps>;
  Card: ComponentType<BrandCardProps>;
}

export interface BrandTheme {
  id: string;
  name: string;
  tokenClass: string;
  components: BrandComponents;
}

export function defineTheme(theme: BrandTheme): BrandTheme {
  return theme;
}

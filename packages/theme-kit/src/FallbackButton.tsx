import type { BrandButtonProps } from './types';

export function FallbackButton({
  children,
  type = 'button',
  variant = 'primary',
  disabled,
  fullWidth,
  onClick,
}: BrandButtonProps) {
  const isPrimary = variant === 'primary';
  const className = [
    'inline-flex items-center justify-center font-semibold px-4 py-2.5 rounded-brand',
    'cursor-pointer disabled:cursor-not-allowed disabled:opacity-60',
    isPrimary
      ? 'bg-brand-primary text-brand-on-primary'
      : 'border border-brand-border bg-transparent text-brand-text',
    fullWidth ? 'w-full' : '',
  ].join(' ');

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

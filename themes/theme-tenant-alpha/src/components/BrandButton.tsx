import type { BrandButtonProps } from '@mts/theme-kit';

export function BrandButton({
  children,
  type = 'button',
  variant = 'primary',
  disabled,
  fullWidth,
  onClick,
}: BrandButtonProps) {
  const isPrimary = variant === 'primary';
  const className = [
    'inline-flex items-center justify-center font-brand font-bold tracking-wide',
    'px-5 py-3 rounded-brand transition-transform',
    'cursor-pointer disabled:cursor-not-allowed disabled:opacity-55',
    isPrimary
      ? 'text-brand-on-primary shadow-brand bg-[linear-gradient(135deg,var(--brand-color-primary),#b06bff)]'
      : 'border-2 border-brand-primary bg-transparent text-brand-primary',
    fullWidth ? 'w-full' : '',
  ].join(' ');

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

import type { BrandCardProps } from '@mts/theme-kit';

export function BrandCard({ title, children }: BrandCardProps) {
  return (
    <section className="bg-brand-surface border border-brand-border rounded-brand shadow-brand p-6 font-brand">
      {title && <h2 className="mt-0 mb-3.5 text-[1.1875rem] text-brand-primary">{title}</h2>}
      {children}
    </section>
  );
}

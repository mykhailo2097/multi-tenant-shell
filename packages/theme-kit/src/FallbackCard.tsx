import type { BrandCardProps } from './types';

export function FallbackCard({ title, children }: BrandCardProps) {
  return (
    <section className="bg-brand-surface border border-brand-border rounded-brand shadow-brand p-5">
      {title && <h2 className="mt-0 mb-3 text-lg text-brand-text">{title}</h2>}
      {children}
    </section>
  );
}

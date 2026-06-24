import { useTenant } from '../tenant/tenant.context';
import { InvoicesCard } from '../components/billing/InvoicesCard';
import { PaymentForm } from '../components/billing/PaymentForm';

export function BillingPage() {
  const { tenant } = useTenant();
  return (
    <div className="grid gap-4">
      <InvoicesCard key={tenant.brandId} />
      <PaymentForm />
    </div>
  );
}

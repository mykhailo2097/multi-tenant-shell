import { useState } from 'react';
import type { FormEventHandler } from 'react';
import { useBrandComponents } from '@mts/theme-kit';
import { useApi } from '../../api/api.context';
import { useTenant } from '../../tenant/tenant.context';
import { validateAmount, formatMoney } from '../../lib/validation';

export function PaymentForm() {
  const { Card, Button } = useBrandComponents();
  const { billing } = useApi();
  const { tenant } = useTenant();

  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setSuccess(null);

    const result = validateAmount(amount);
    if ('error' in result) {
      setError(result.error);
      return;
    }
    setError(null);

    setSubmitting(true);
    try {
      const payment = await billing.createPayment(tenant.brandId, result.cents);
      setSuccess(
        `Payment of ${formatMoney(payment.amountCents, tenant.locale, tenant.currency)} submitted.`,
      );
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Make a payment">
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="amount">Amount ({tenant.currency})</label>
          <input
            id="amount"
            name="amount"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'amount-error' : undefined}
          />
          {error && (
            <p className="text-brand-danger text-[13px] mt-1.5" id="amount-error" role="alert">
              {error}
            </p>
          )}
        </div>

        {success && (
          <p className="text-brand-primary mb-4" role="status" aria-live="polite">
            {success}
          </p>
        )}

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Processing…' : 'Pay now'}
        </Button>
      </form>
    </Card>
  );
}

import { useEffect, useState } from 'react';
import { useBrandComponents } from '@mts/theme-kit';
import { useApi } from '../../api/api.context';
import { useTenant } from '../../tenant/tenant.context';
import { InvoiceList } from './InvoiceList';
import type { LoadState } from './types';

export function InvoicesCard() {
  const { Card, Button } = useBrandComponents();
  const { billing } = useApi();
  const { tenant } = useTenant();

  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    billing
      .getInvoices(tenant.brandId)
      .then((invoices) => {
        if (active) setState({ status: 'ready', invoices });
      })
      .catch((err) => {
        if (active) {
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Failed to load invoices.',
          });
        }
      });
    return () => {
      active = false;
    };
  }, [billing, tenant.brandId, attempt]);

  const retry = () => {
    setState({ status: 'loading' });
    setAttempt((a) => a + 1);
  };

  return (
    <Card title="Invoices">
      <InvoiceList
        state={state}
        locale={tenant.locale}
        currency={tenant.currency}
        retryButton={<Button onClick={retry}>Try again</Button>}
      />
    </Card>
  );
}

import { Link } from 'react-router-dom';
import { useBrandComponents } from '@mts/theme-kit';
import { useTenant } from '../tenant/tenant.context';

export function HomePage() {
  const { Card, Button } = useBrandComponents();
  const { tenant } = useTenant();

  return (
    <div className="grid gap-4">
      <Card title={`Welcome to ${tenant.name}`}>
        <p className="text-brand-text-muted mt-0 mb-4">
          This is the white-label player shell. The page below is identical across brands —
          only the theme package changes how it looks. Use the <strong>Brand</strong> switcher
          in the header to see the same UI re-skin instantly.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/auth/login" className="no-underline">
            <Button>Go to login</Button>
          </Link>
          <Link to="/account/billing" className="no-underline">
            <Button variant="secondary">View billing</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

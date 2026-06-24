import './tokens.css';
import { defineTheme } from '@mts/theme-kit';
import { BrandButton } from './components/BrandButton';
import { BrandCard } from './components/BrandCard';

export const themeTenantAlpha = defineTheme({
  id: 'tenant-alpha',
  name: 'Tenant Alpha',
  tokenClass: 'theme-tenant-alpha',
  components: {
    Button: BrandButton,
    Card: BrandCard,
  },
});

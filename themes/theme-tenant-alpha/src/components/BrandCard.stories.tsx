import type { Meta, StoryObj } from '@storybook/react-vite';
import { themeTenantAlpha } from '../theme.config';
import { BrandCard } from './BrandCard';
import { BrandButton } from './BrandButton';

const meta: Meta<typeof BrandCard> = {
  title: 'Tenant Alpha/BrandCard',
  component: BrandCard,
  decorators: [
    (Story) => (
      <div className={`${themeTenantAlpha.tokenClass} p-6 max-w-[420px]`}>
        <Story />
      </div>
    ),
  ],
  args: { title: 'Invoices' },
};

export default meta;
type Story = StoryObj<typeof BrandCard>;

export const Default: Story = {
  args: { children: 'Your latest invoices appear here.' },
};

export const Untitled: Story = {
  args: { title: undefined, children: 'A card with no title.' },
};

export const WithAction: Story = {
  args: {
    children: (
      <div className="grid gap-3">
        <p className="m-0">You have one invoice due.</p>
        <BrandButton>Pay now</BrandButton>
      </div>
    ),
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { themeTenantAlpha } from '../theme.config';
import { BrandButton } from './BrandButton';

const meta: Meta<typeof BrandButton> = {
  title: 'Tenant Alpha/BrandButton',
  component: BrandButton,
  decorators: [
    (Story) => (
      <div className={`${themeTenantAlpha.tokenClass} p-6`}>
        <Story />
      </div>
    ),
  ],
  args: { children: 'Continue' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof BrandButton>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Disabled: Story = { args: { disabled: true } };
export const FullWidth: Story = { args: { fullWidth: true } };

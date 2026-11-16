import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BalanceBar } from './BalanceBar';

const meta = {
  component: BalanceBar,
  title: 'Molecules/BalanceBar',
  tags: ['ai-generated', 'autodocs'],
  args: { onHand: 100, worksheet: 40, waiting: 0, reserved: 25 },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof BalanceBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Healthy: Story = {};
export const Shortfall: Story = { args: { worksheet: 60, waiting: 20, reserved: 35 } };
export const NothingPromised: Story = { args: { worksheet: 0, waiting: 0, reserved: 0 } };
export const Mobile: Story = { globals: { viewport: { value: 'mobile' } } };
export const Tablet: Story = { globals: { viewport: { value: 'tablet' } } };
export const Desktop: Story = { globals: { viewport: { value: 'desktop' } } };
export const Dark: Story = { args: { worksheet: 60, waiting: 20, reserved: 35 }, tags: ['!autodocs'], globals: { theme: 'dark' } };

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { StockSummary } from './StockSummary';

const meta = {
  component: StockSummary,
  title: 'Organisms/StockSummary',
  tags: ['ai-generated', 'autodocs'],
  args: { onHand: 100, worksheet: 40, waiting: 0, reserved: 25 },
  decorators: [(Story) => <div className="bg-page p-4"><Story /></div>],
} satisfies Meta<typeof StockSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Healthy: Story = {
  play: async ({ canvas }) => {
    // 100 − 40 = 60 actual; 60 − 0 − 25 = 35 reserve.
    await expect(canvas.getByText('60 m')).toBeInTheDocument();
    await expect(canvas.getAllByText('35 m').length).toBeGreaterThan(0);
  },
};
export const NegativeReserve: Story = { args: { worksheet: 60, waiting: 20, reserved: 35 } };
export const Mobile: Story = { args: { worksheet: 60, waiting: 20, reserved: 35 }, globals: { viewport: { value: 'mobile' } } };
export const Tablet: Story = { args: { worksheet: 60, waiting: 20, reserved: 35 }, globals: { viewport: { value: 'tablet' } } };
export const Desktop: Story = { args: { worksheet: 60, waiting: 20, reserved: 35 }, globals: { viewport: { value: 'desktop' } } };
export const Dark: Story = { args: { worksheet: 60, waiting: 20, reserved: 35 }, tags: ['!autodocs'], globals: { theme: 'dark' } };

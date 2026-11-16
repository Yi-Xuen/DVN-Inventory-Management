import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Stat } from './Stat';

const meta = {
  component: Stat,
  title: 'Molecules/Stat',
  tags: ['ai-generated', 'autodocs'],
  args: { label: 'On hand', value: 100 },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Large: Story = { args: { label: 'Actual balance', value: 37.5, size: 'lg', hint: 'Free to promise or cut' } };
export const Negative: Story = {
  args: { label: 'Reserve balance', value: -15, hint: 'Buy at least 15 m' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('−15 m')).toBeInTheDocument();
  },
};
export const Dark: Story = { args: { label: 'Reserve balance', value: -15 }, tags: ['!autodocs'], globals: { theme: 'dark' } };

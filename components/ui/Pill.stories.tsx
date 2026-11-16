import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Pill } from './Pill';

const meta = {
  component: Pill,
  title: 'Components/Pill',
  tags: ['ai-generated'],
  args: { children: 'In stock' },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Soft: Story = { args: { tone: 'soft', children: 'Queued for sewing' } };
export const Danger: Story = { args: { tone: 'danger', children: 'Backorder' } };
export const Dark: Story = { args: { tone: 'danger', children: 'Short end' }, globals: { theme: 'dark' } };

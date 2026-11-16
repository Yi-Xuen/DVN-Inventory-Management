import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Divider } from './Divider';

const meta = {
  component: Divider,
  title: 'Atoms/Divider',
  tags: ['ai-generated', 'autodocs'],
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="body-3 grid gap-3">
      <span>On hand</span>
      <Divider />
      <span>Actual balance</span>
    </div>
  ),
};
export const Vertical: Story = {
  render: () => (
    <div className="body-3 flex gap-3">
      <span>Sales</span>
      <Divider vertical />
      <span>Factory</span>
    </div>
  ),
};

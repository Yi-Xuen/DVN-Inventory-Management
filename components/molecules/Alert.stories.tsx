import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { Alert } from './Alert';

const meta = {
  component: Alert,
  title: 'Molecules/Alert',
  tags: ['ai-generated', 'autodocs'],
  args: { title: 'Stock arrived', children: 'Line 1001-2 moved from Waiting for stock to Confirmed.' },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Success: Story = { args: { tone: 'success', title: 'Reserved 25 m for Mrs Tan', children: undefined } };
export const Warning: Story = { args: { tone: 'warning', title: 'Waiting for stock', children: 'This line does not fit the actual balance yet. The factory will not see it until stock arrives.' } };
export const DangerTone: Story = { name: 'Danger', args: { tone: 'danger', title: 'Cut blocked', children: 'Roll 2611-A only has 12 m left. Correct the count first if the roll has more.' } };
export const Dismissible: Story = {
  args: { tone: 'success', onDismiss: fn() },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await expect(args.onDismiss).toHaveBeenCalled();
  },
};
export const Dark: Story = { args: { tone: 'danger', title: 'Cut blocked' }, tags: ['!autodocs'], globals: { theme: 'dark' } };

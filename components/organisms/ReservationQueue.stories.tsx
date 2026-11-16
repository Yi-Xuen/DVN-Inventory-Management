import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { ReservationQueue } from './ReservationQueue';

const reservations = [
  { id: 'r1', customer: 'Mrs Tan', salesperson: 'Mei Ling', metres: 25, age: '12 days ago', mine: true },
  { id: 'r2', customer: 'Mr Lim (Tanjung Bungah condo)', salesperson: 'Jason', metres: 18.5, age: '3 days ago' },
  { id: 'r3', customer: 'Dr Wong', salesperson: 'Mei Ling', metres: 40, age: 'Today', mine: true },
];

const meta = {
  component: ReservationQueue,
  title: 'Organisms/ReservationQueue',
  tags: ['ai-generated', 'autodocs'],
  args: { reservations, onCancel: fn() },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof ReservationQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    // Only the signed-in salesperson's own reservations can be cancelled.
    const buttons = canvas.getAllByRole('button', { name: 'Cancel' });
    await expect(buttons).toHaveLength(2);
    await userEvent.click(buttons[0]);
    await expect(args.onCancel).toHaveBeenCalledWith('r1');
  },
};
export const Empty: Story = { args: { reservations: [] } };
/** Cancel wraps under the text. */
export const Mobile: Story = { globals: { viewport: { value: 'mobile' } } };
/** One line per reservation. */
export const Tablet: Story = { globals: { viewport: { value: 'tablet' } } };
export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' } };

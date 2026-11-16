import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { ScanButton } from './ScanButton';

const meta = {
  component: ScanButton,
  title: 'Molecules/ScanButton',
  tags: ['ai-generated', 'autodocs'],
  args: { onClick: fn() },
  decorators: [(Story) => <div className="w-60 bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof ScanButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Mobile bottom bar. */
export const Fab: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Scan QR' }));
    await expect(args.onClick).toHaveBeenCalled();
  },
};
/** Tablet side rail. */
export const Rail: Story = { args: { variant: 'rail' } };
/** Desktop sidebar. */
export const Full: Story = { args: { variant: 'full' } };
export const Dark: Story = { args: { variant: 'full' }, tags: ['!autodocs'], globals: { theme: 'dark' } };

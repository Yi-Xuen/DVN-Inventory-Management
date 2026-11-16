import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, screen } from 'storybook/test';
import { ConfirmDialog } from './ConfirmDialog';

const meta = {
  component: ConfirmDialog,
  title: 'Organisms/ConfirmDialog',
  tags: ['ai-generated'],
  args: {
    open: true,
    title: 'Cancel this reservation?',
    children: 'The 25 m reserved for Mrs Tan goes back to the reserve balance straight away.',
    confirmLabel: 'Cancel reservation',
    danger: true,
    onConfirm: fn(),
    onCancel: fn(),
  },
  decorators: [(Story) => <div className="min-h-dvh bg-page"><Story /></div>],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Buttons stacked. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
  play: async ({ userEvent, args }) => {
    await userEvent.click(screen.getByRole('button', { name: 'Cancel reservation' }));
    await expect(args.onConfirm).toHaveBeenCalled();
  },
};
/** Buttons side by side. */
export const Tablet: Story = { globals: { viewport: { value: 'tablet' } } };
export const NotDangerous: Story = {
  args: { title: 'Start sewing 1001-2?', children: 'Sales will see this line as Sewing in progress.', confirmLabel: 'Start sewing', cancelLabel: 'Not yet', danger: false },
};
export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' } };

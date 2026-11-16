import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, screen } from 'storybook/test';
import { Button } from '../atoms/Button';
import { Sheet } from './Sheet';

function Demo(args: React.ComponentProps<typeof Sheet>) {
  const [open, setOpen] = useState(args.open);
  const close = () => { setOpen(false); args.onClose(); };
  return (
    <div className="min-h-dvh bg-page p-4">
      <Button fullWidth={false} onClick={() => setOpen(true)}>Open sheet</Button>
      <Sheet {...args} open={open} onClose={close} />
    </div>
  );
}

const meta = {
  component: Sheet,
  title: 'Organisms/Sheet',
  tags: ['ai-generated'],
  args: {
    open: true,
    onClose: fn(),
    title: 'Adjust stock',
    children: <p className="body-2 text-fg-subtle">Sheet content goes here: a short form or a message.</p>,
    footer: <Button>Save</Button>,
  },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rises from the bottom, full width. */
export const Mobile: Story = { globals: { viewport: { value: 'mobile' } } };
/** Centred dialog. */
export const Tablet: Story = { globals: { viewport: { value: 'tablet' } } };
export const Desktop: Story = { globals: { viewport: { value: 'desktop' } } };
export const ClosesOnEscape: Story = {
  play: async ({ userEvent, args }) => {
    await expect(screen.getByRole('dialog', { name: 'Adjust stock' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalled();
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
export const DarkMobile: Story = { tags: ['!autodocs'], globals: { viewport: { value: 'mobile' }, theme: 'dark' } };

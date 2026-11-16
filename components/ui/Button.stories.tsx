import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { ArrowRight2 } from 'iconsax-react';
import { Button } from './Button';

const meta = {
  component: Button,
  title: 'Components/Button',
  tags: ['ai-generated'],
  args: { children: 'Reserve this fabric', onClick: fn() },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: /reserve this fabric/i });
    // Brand fill from the design system (bg-brand = brand.primary.base).
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(14, 44, 34)');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Cancel' } };
export const Disabled: Story = { args: { disabled: true, children: <span className="inline-flex items-center gap-2">Next <ArrowRight2 size={16} color="currentColor" /></span> } };
export const Dark: Story = { globals: { theme: 'dark' } };

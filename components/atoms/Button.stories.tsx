import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { ArrowRight2 } from 'iconsax-react';
import { Button } from './Button';

const meta = {
  component: Button,
  title: 'Atoms/Button',
  tags: ['ai-generated', 'autodocs'],
  args: { children: 'Primary button', onClick: fn() },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Primary button' });
    // Primary fill from the design system (bg-primary = green.700 #1D5C47).
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(29, 92, 71)');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};
export const Danger: Story = { args: { variant: 'danger', children: 'Danger button' } };
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      <Button {...args} size="sm" fullWidth={false}>Small</Button>
      <Button {...args} size="md" fullWidth={false}>Medium</Button>
      <Button {...args} size="lg" fullWidth={false}>Large</Button>
    </div>
  ),
};
export const WithIcons: Story = {
  args: { fullWidth: false, children: 'Button with icon', iconRight: <ArrowRight2 size={16} color="currentColor" /> },
};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Secondary button' } };
export const Disabled: Story = { args: { disabled: true, children: <span className="inline-flex items-center gap-2">Disabled button <ArrowRight2 size={16} color="currentColor" /></span> } };
export const DisabledSecondary: Story = { args: { variant: 'secondary', disabled: true, children: 'Secondary button' } };
export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' } };
export const DarkSecondary: Story = { args: { variant: 'secondary', children: 'Secondary button' }, tags: ['!autodocs'], globals: { theme: 'dark' } };

// Hover/active are CSS :hover/:active, which synthetic test events can't trigger.
// storybook-addon-pseudo-states forces them via parameters (also toggleable from the toolbar).
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const Pressed: Story = { parameters: { pseudo: { hover: true, active: true } } };
export const SecondaryHover: Story = { args: { variant: 'secondary', children: 'Secondary button' }, parameters: { pseudo: { hover: true } } };
export const SecondaryPressed: Story = { args: { variant: 'secondary', children: 'Secondary button' }, parameters: { pseudo: { hover: true, active: true } } };

export const Focus: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    const button = canvas.getByRole('button');
    await expect(button).toHaveFocus();
    await expect(getComputedStyle(button).outlineStyle).toBe('solid');
  },
};

export const Loading: Story = {
  args: { loading: true, children: 'Loading button' },
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button');
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const LoadingSecondary: Story = { args: { variant: 'secondary', loading: true, children: 'Loading button' } };

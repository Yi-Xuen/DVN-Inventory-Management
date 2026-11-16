import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  component: Checkbox,
  title: 'Components/Checkbox',
  tags: ['ai-generated'],
  args: { 'aria-label': 'Worksheet', onChange: fn() },
  decorators: [(Story) => <div className="bg-page p-4"><Story /></div>],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const box = canvas.getByRole('checkbox', { name: 'Worksheet' });
    await expect(box).not.toBeChecked();
    await userEvent.click(box);
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Checked: Story = {
  args: { defaultChecked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Worksheet' })).toBeChecked();
  },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, 'aria-label': 'Proposal, all' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Proposal, all' })).toBePartiallyChecked();
  },
};

export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } };

export const Invalid: Story = {
  args: { invalid: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Worksheet' })).toHaveAttribute('aria-invalid', 'true');
  },
};

export const WithLabel: Story = {
  args: { label: 'Worksheet', description: 'queued or sewing', 'aria-label': undefined, defaultChecked: true },
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByRole('checkbox', { name: /worksheet/i });
    await userEvent.click(canvas.getByText('Worksheet'));
    await expect(box).not.toBeChecked();
  },
};

/** Every state in one frame, for quick comparison. */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {[
        ['Default', {}],
        ['Checked', { defaultChecked: true }],
        ['Indeterminate', { indeterminate: true }],
        ['Invalid', { invalid: true }],
        ['Disabled', { disabled: true }],
        ['Disabled checked', { disabled: true, defaultChecked: true }],
      ].map(([name, props]) => (
        <div key={name as string} className="flex flex-col items-center gap-2">
          <Checkbox aria-label={name as string} {...(props as object)} />
          <span className="body-4 text-fg-subtle">{name as string}</span>
        </div>
      ))}
    </div>
  ),
};

export const Dark: Story = { ...AllStates, globals: { theme: 'dark' } };

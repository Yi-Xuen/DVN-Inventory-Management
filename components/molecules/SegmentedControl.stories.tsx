import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { SegmentedControl } from './SegmentedControl';

type Status = 'proposal' | 'confirmed' | 'worksheet';
const options = [
  { value: 'proposal' as const, label: 'Proposal' },
  { value: 'confirmed' as const, label: 'Confirmed' },
  { value: 'worksheet' as const, label: 'Worksheet' },
];

function Controlled(args: React.ComponentProps<typeof SegmentedControl<Status>>) {
  const [value, setValue] = useState<Status>(args.value);
  return <SegmentedControl {...args} value={value} onChange={setValue} />;
}

const meta = {
  component: SegmentedControl<Status>,
  title: 'Molecules/SegmentedControl',
  tags: ['ai-generated', 'autodocs'],
  args: { options, value: 'proposal', 'aria-label': 'Reserve as', onChange: () => {} },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof SegmentedControl<Status>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => <Controlled {...args} />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('tab', { name: 'Proposal' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(canvas.getByRole('tab', { name: 'Worksheet' }));
    await expect(canvas.getByRole('tab', { name: 'Worksheet' })).toHaveAttribute('aria-selected', 'true');
  },
};

export const Dark: Story = { args: { value: 'confirmed' }, tags: ['!autodocs'], globals: { theme: 'dark' } };

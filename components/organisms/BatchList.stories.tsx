import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { BatchList, type Batch } from './BatchList';

const batches: Batch[] = [
  { code: '2609-A', received: 50, remaining: 1, receivedOn: '4 Sep 2026', status: 'remnant' },
  { code: '2611-A', received: 50, remaining: 12, receivedOn: '12 Nov 2026' },
  { code: '2611-B', received: 50, remaining: 50, receivedOn: '12 Nov 2026' },
  { code: '2608-A', received: 40, remaining: 0, receivedOn: '20 Aug 2026', status: 'used' },
];

function Selectable(args: React.ComponentProps<typeof BatchList>) {
  const [selected, setSelected] = useState(args.selected);
  return <BatchList {...args} selected={selected} onSelect={setSelected} />;
}

const meta = {
  component: BatchList,
  title: 'Organisms/BatchList',
  tags: ['ai-generated', 'autodocs'],
  args: { batches },
  decorators: [(Story) => <div className="bg-page p-4"><Story /></div>],
} satisfies Meta<typeof BatchList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadOnly: Story = {};
export const PickARoll: Story = {
  render: (args) => <Selectable {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: /2611-A/ }));
    await expect(canvas.getByRole('radio', { name: /2611-A/ })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: /2608-A/ })).toBeDisabled();
  },
};
export const Mobile: Story = { globals: { viewport: { value: 'mobile' } } };
export const Tablet: Story = { globals: { viewport: { value: 'tablet' } } };
export const Desktop: Story = { globals: { viewport: { value: 'desktop' } } };
export const Dark: Story = { render: (args) => <Selectable {...args} selected="2611-B" />, tags: ['!autodocs'], globals: { theme: 'dark' } };

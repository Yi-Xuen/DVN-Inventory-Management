import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { MonthYearPicker } from './MonthYearPicker';

function Controlled(args: React.ComponentProps<typeof MonthYearPicker>) {
  const [value, setValue] = useState(args.value);
  const [open, setOpen] = useState(args.open);
  return <MonthYearPicker {...args} value={value} onChange={setValue} open={open} onOpenChange={setOpen} />;
}

const meta = {
  component: MonthYearPicker,
  title: 'Molecules/MonthYearPicker',
  tags: ['ai-generated', 'autodocs'],
  args: { value: '', min: 'Nov 2026', max: 'Oct 2028', open: false, onChange: () => {}, onOpenChange: () => {} },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof MonthYearPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => <Controlled {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Month, year' }));
    await expect(canvas.getByRole('dialog')).toBeInTheDocument();
  },
};

export const OpenSheet: Story = { args: { open: true, value: 'Jan 2027', optional: true }, render: (args) => <Controlled {...args} /> };
export const Dark: Story = { args: { value: 'Jan 2027' }, tags: ['!autodocs'], globals: { theme: 'dark' }, render: (args) => <Controlled {...args} /> };

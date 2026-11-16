import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { SearchBar } from './SearchBar';

function Controlled(args: React.ComponentProps<typeof SearchBar>) {
  const [value, setValue] = useState(args.value);
  return <SearchBar {...args} value={value} onChange={setValue} />;
}

const meta = {
  component: SearchBar,
  title: 'Molecules/SearchBar',
  tags: ['ai-generated', 'autodocs'],
  args: { value: '', onChange: () => {} },
  render: (args) => <Controlled {...args} />,
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const TypeAndClear: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('searchbox', { name: 'Search fabrics' });
    await userEvent.type(input, 'HO5D');
    await expect(input).toHaveValue('HO5D');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(input).toHaveValue('');
  },
};
export const Filled: Story = { args: { value: 'HO5D' } };
export const Dark: Story = { args: { value: 'HO5D' }, tags: ['!autodocs'], globals: { theme: 'dark' } };

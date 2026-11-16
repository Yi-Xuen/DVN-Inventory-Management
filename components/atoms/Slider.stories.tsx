import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Slider } from './Slider';

const stops = ['Unlikely', 'Likely', 'Very likely'] as const;

function Controlled(args: React.ComponentProps<typeof Slider>) {
  const [value, setValue] = useState(args.value);
  return <Slider {...args} value={value} onChange={setValue} />;
}

const meta = {
  component: Slider,
  title: 'Atoms/Slider',
  tags: ['ai-generated', 'autodocs'],
  args: { stops, value: 1, 'aria-label': 'How likely is the customer going to confirm?', onChange: () => {} },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => <Controlled {...args} />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('slider')).toHaveAttribute('aria-valuetext', 'Likely');
    await userEvent.click(canvas.getByText('Very likely'));
    await expect(canvas.getByRole('slider')).toHaveAttribute('aria-valuetext', 'Very likely');
  },
};

export const Dark: Story = { args: { value: 2 }, tags: ['!autodocs'], globals: { theme: 'dark' } };

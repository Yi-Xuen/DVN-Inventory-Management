import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Box1, ClipboardText, ScanBarcode, Scissor, TruckFast } from 'iconsax-react';
import { Icon } from './Icon';

const meta = {
  component: Icon,
  title: 'Atoms/Icon',
  tags: ['ai-generated', 'autodocs'],
  args: { icon: Box1 },
  decorators: [(Story) => <div className="flex items-end gap-4 bg-surface p-4 text-icon"><Story /></div>],
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Linear: Story = {};
export const Bold: Story = { args: { bold: true, className: 'text-icon-primary' } };
export const Sizes: Story = {
  render: (args) => (
    <>
      {([4, 5, 6, 8, 10, 12] as const).map((size) => <Icon key={size} {...args} size={size} />)}
    </>
  ),
};
export const AppIcons: Story = {
  render: () => (
    <>
      {[Box1, ClipboardText, ScanBarcode, Scissor, TruckFast].map((icon, i) => <Icon key={i} icon={icon} />)}
    </>
  ),
};
export const Tones: Story = {
  render: (args) => (
    <>
      {['text-icon', 'text-icon-subtle', 'text-icon-primary', 'text-icon-success', 'text-icon-warning', 'text-icon-danger'].map((tone) => (
        <Icon key={tone} {...args} className={tone} />
      ))}
    </>
  ),
};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ArrowLeft2, CloseCircle, ScanBarcode } from 'iconsax-react';
import { Icon } from './Icon';
import { IconButton } from './IconButton';

const meta = {
  component: IconButton,
  title: 'Atoms/IconButton',
  tags: ['ai-generated', 'autodocs'],
  args: { 'aria-label': 'Back', children: <Icon icon={ArrowLeft2} /> },
  decorators: [(Story) => <div className="flex gap-3 bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {};
export const Outlined: Story = { args: { variant: 'outlined', 'aria-label': 'Close', children: <Icon icon={CloseCircle} /> } };
export const Primary: Story = { args: { variant: 'primary', 'aria-label': 'Scan QR code', children: <Icon icon={ScanBarcode} className="text-fg-on-primary" /> } };
export const Small: Story = { args: { size: 'sm', variant: 'outlined' } };
export const Disabled: Story = { args: { disabled: true, variant: 'outlined' } };
export const Dark: Story = { args: { variant: 'outlined' }, tags: ['!autodocs'], globals: { theme: 'dark' } };

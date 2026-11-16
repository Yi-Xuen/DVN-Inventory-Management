import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Box1, ClipboardText } from 'iconsax-react';
import { Button } from '../atoms/Button';
import { EmptyState } from './EmptyState';

const meta = {
  component: EmptyState,
  title: 'Molecules/EmptyState',
  tags: ['ai-generated', 'autodocs'],
  args: { icon: ClipboardText, title: 'No reservations yet', description: 'Reserve metres when you quote, so others can see this fabric is spoken for.' },
  decorators: [(Story) => <div className="bg-surface"><Story /></div>],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAction: Story = { args: { action: <Button fullWidth={false}>Reserve this fabric</Button> } };
export const NoResults: Story = { args: { icon: Box1, title: 'No fabric matches "HX"', description: 'Check the code, or scan the QR on the roll.' } };
export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' } };

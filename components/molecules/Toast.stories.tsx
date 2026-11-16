import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Toast } from './Toast';

const meta = {
  component: Toast,
  title: 'Molecules/Toast',
  tags: ['ai-generated'],
  args: { tone: 'success', title: 'Reserved 25 m for Mrs Tan', onDismiss: fn() },
  decorators: [(Story) => <div className="min-h-96 bg-page"><Story /></div>],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bottom of the screen, clear of the bottom navigation bar. */
export const Mobile: Story = { globals: { viewport: { value: 'mobile' } } };
/** Top-right corner. */
export const Tablet: Story = { globals: { viewport: { value: 'tablet' } } };
export const Desktop: Story = { globals: { viewport: { value: 'desktop' } } };
export const Danger: Story = { args: { tone: 'danger', title: 'Cut blocked', children: 'Roll 2611-A only has 12 m left.' } };

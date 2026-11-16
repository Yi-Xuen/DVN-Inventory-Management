import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Spinner } from './Spinner';

const meta = {
  component: Spinner,
  title: 'Atoms/Spinner',
  tags: ['ai-generated', 'autodocs'],
  decorators: [(Story) => <div className="flex items-center gap-4 bg-surface p-4 text-icon-primary"><Story /></div>],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = { render: () => <><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" /></> };

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Skeleton } from './Skeleton';

const meta = {
  component: Skeleton,
  title: 'Atoms/Skeleton',
  tags: ['ai-generated', 'autodocs'],
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {};
export const LoadingCard: Story = {
  render: () => (
    <div className="grid gap-2 rounded-ds-3 border border-line-subtle p-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-8 w-20" />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { STATUS, StatusBadge, type Status } from './StatusBadge';

const meta = {
  component: StatusBadge,
  title: 'Atoms/StatusBadge',
  tags: ['ai-generated', 'autodocs'],
  args: { status: 'reserved' },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

const All = () => (
  <div className="flex flex-wrap gap-2">
    {(Object.keys(STATUS) as Status[]).map((status) => <StatusBadge key={status} status={status} />)}
  </div>
);

export const Reserved: Story = {};
export const WaitingForStock: Story = { args: { status: 'waiting' } };
export const AllStatuses: Story = { render: All };
export const AllStatusesDark: Story = { render: All, tags: ['!autodocs'], globals: { theme: 'dark' } };

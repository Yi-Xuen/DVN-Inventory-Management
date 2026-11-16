import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar } from './Avatar';

const meta = {
  component: Avatar,
  title: 'Atoms/Avatar',
  tags: ['ai-generated', 'autodocs'],
  args: { name: 'Mei Ling Tan' },
  decorators: [(Story) => <div className="flex items-center gap-3 bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const SingleName: Story = { args: { name: 'Factory' } };
export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' } };

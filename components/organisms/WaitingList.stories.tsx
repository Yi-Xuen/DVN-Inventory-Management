import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { WaitingList } from './WaitingList';

const meta = {
  component: WaitingList,
  title: 'Organisms/WaitingList',
  tags: ['ai-generated', 'autodocs'],
  args: {
    lines: [
      { itemNo: '1001-2', customer: 'Mrs Tan', room: 'Master bedroom', metres: 20, waitingFor: '5 days' },
      { itemNo: '1004-1', customer: 'Dr Wong', room: 'Living room', metres: 32.5, waitingFor: '1 day' },
    ],
  },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof WaitingList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Mobile: Story = { globals: { viewport: { value: 'mobile' } } };
export const Tablet: Story = { globals: { viewport: { value: 'tablet' } } };
export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' } };

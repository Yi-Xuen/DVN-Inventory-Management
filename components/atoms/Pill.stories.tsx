import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Pill } from './Pill';

const meta = {
  component: Pill,
  title: 'Atoms/Pill',
  tags: ['ai-generated', 'autodocs'],
  args: { children: 'In stock' },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Soft: Story = { args: { tone: 'soft', children: 'Queued for sewing' } };
/** Pills sit on cards, so check the tints on the card surface. */
export const Danger: Story = { args: { tone: 'danger', children: 'Backorder' } };
export const Dark: Story = { args: { tone: 'danger', children: 'Short end' }, tags: ['!autodocs'], globals: { theme: 'dark' } };
export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['neutral', 'soft', 'primary', 'primary-solid', 'success', 'warning', 'danger'] as const).map((tone) => (
        <Pill key={tone} tone={tone}>{tone}</Pill>
      ))}
    </div>
  ),
};

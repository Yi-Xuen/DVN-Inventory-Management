import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { FilterButton } from './FilterButton';

const meta = {
  title: 'Molecules/FilterButton',
  component: FilterButton,
  tags: ['ai-generated', 'autodocs'],
  args: { onClick: fn() },
  decorators: [(Story) => <div className="bg-page p-4"><Story /></div>],
} satisfies Meta<typeof FilterButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing on: no badge. */
export const None: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filter and sort' }));
    await expect(args.onClick).toHaveBeenCalled();
  },
};

/** Two filters on: the badge shows the count and the spoken name says so. */
export const TwoOn: Story = {
  args: { count: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Filter and sort, 2 on' })).toBeVisible();
  },
};

export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' }, args: { count: 3 } };

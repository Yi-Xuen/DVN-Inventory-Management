import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { LogCutForm } from './LogCutForm';
import { Sheet } from './Sheet';

const meta = {
  component: LogCutForm,
  title: 'Organisms/LogCutForm',
  tags: ['ai-generated'],
  args: {
    itemNo: '1001-2',
    room: 'Master bedroom',
    confirmed: 20,
    cutters: ['Ah Hock', 'Siti', 'Kumar'],
    batches: [
      { code: '2611-A', received: 50, remaining: 12, receivedOn: '12 Nov 2026' },
      { code: '2611-B', received: 50, remaining: 50, receivedOn: '12 Nov 2026' },
    ],
    onSubmit: fn(),
  },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof LogCutForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SubmitsValues: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.selectOptions(canvas.getByLabelText(/Who is cutting/), 'Siti');
    await userEvent.click(canvas.getByRole('radio', { name: /2611-B/ }));
    await userEvent.type(canvas.getByLabelText(/Actual metres used/), '18.5');
    await userEvent.click(canvas.getByRole('button', { name: 'Complete sewing' }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ cutter: 'Siti', batchCode: '2611-B', metres: 18.5 });
  },
};
/** Cutting more than the roll has left is blocked. */
export const OverCutBlocked: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: /2611-A/ }));
    await userEvent.type(canvas.getByLabelText(/Actual metres used/), '20');
    await expect(canvas.getByText(/only has 12 m left/)).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Complete sewing' })).toBeDisabled();
  },
};
export const InSheetMobile: Story = {
  render: (args) => <Sheet open onClose={() => {}} title="Log cut"><LogCutForm {...args} /></Sheet>,
  globals: { viewport: { value: 'mobile' } },
};
export const InSheetTablet: Story = {
  render: (args) => <Sheet open onClose={() => {}} title="Log cut"><LogCutForm {...args} /></Sheet>,
  globals: { viewport: { value: 'tablet' } },
};
export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' } };

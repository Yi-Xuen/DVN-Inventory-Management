import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { ReceiveBatchForm } from './ReceiveBatchForm';
import { Sheet } from './Sheet';

const meta = {
  component: ReceiveBatchForm,
  title: 'Organisms/ReceiveBatchForm',
  tags: ['ai-generated'],
  args: { fabricCode: 'HO5D', nextBatchCode: '2611-C', defaultDate: '2026-11-16', onSubmit: fn() },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof ReceiveBatchForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SubmitsValues: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByLabelText(/Metres received/), '50');
    await userEvent.click(canvas.getByRole('button', { name: 'Add roll' }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ metres: 50, receivedOn: '2026-11-16', dyeLot: '' });
  },
};
export const InSheetMobile: Story = {
  render: (args) => <Sheet open onClose={() => {}} title="Receive stock"><ReceiveBatchForm {...args} /></Sheet>,
  globals: { viewport: { value: 'mobile' } },
};
export const InSheetTablet: Story = {
  render: (args) => <Sheet open onClose={() => {}} title="Receive stock"><ReceiveBatchForm {...args} /></Sheet>,
  globals: { viewport: { value: 'tablet' } },
};
export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' } };

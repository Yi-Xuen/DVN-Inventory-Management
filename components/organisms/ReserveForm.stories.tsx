import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { ReserveForm } from './ReserveForm';
import { Sheet } from './Sheet';

const meta = {
  component: ReserveForm,
  title: 'Organisms/ReserveForm',
  tags: ['ai-generated'],
  args: { fabricCode: 'HO5D', actualBalance: 60, reserveBalance: 35, salespeople: ['Mei Ling', 'Jason', 'Aisyah'], defaultSalesperson: 'Mei Ling', onSubmit: fn() },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof ReserveForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SubmitsValues: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByLabelText(/Metres to reserve/), '25');
    await userEvent.type(canvas.getByLabelText(/Customer/), 'Mrs Tan');
    await userEvent.click(canvas.getByRole('button', { name: 'Reserve' }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ metres: 25, customer: 'Mrs Tan', salesperson: 'Mei Ling' });
  },
};
export const ShowsErrors: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Reserve' }));
    await expect(canvas.getByText('Enter the metres to reserve.')).toBeInTheDocument();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
/** Reserving more than the reserve balance is allowed, with a warning. */
export const GoesNegative: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText(/Metres to reserve/), '50');
    await expect(canvas.getByText('This takes the reserve balance to −15 m')).toBeInTheDocument();
  },
};
/** Inside the bottom sheet. */
export const InSheetMobile: Story = {
  render: (args) => <Sheet open onClose={() => {}} title="Reserve HO5D"><ReserveForm {...args} /></Sheet>,
  globals: { viewport: { value: 'mobile' } },
};
/** Inside the centred dialog, fields in two columns. */
export const InSheetTablet: Story = {
  render: (args) => <Sheet open onClose={() => {}} title="Reserve HO5D"><ReserveForm {...args} /></Sheet>,
  globals: { viewport: { value: 'tablet' } },
};
export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' } };

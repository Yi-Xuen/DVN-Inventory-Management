import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HelperText, Label } from './Label';

const meta = {
  component: Label,
  title: 'Atoms/Label',
  tags: ['ai-generated', 'autodocs'],
  args: { children: 'Customer name' },
  decorators: [(Story) => <div className="grid gap-1 bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Required: Story = { args: { required: true } };
export const Helper: Story = { render: () => <HelperText>Enter the metres from the quotation.</HelperText> };
export const ErrorText: Story = { render: () => <HelperText error>This roll only has 12 m left.</HelperText> };

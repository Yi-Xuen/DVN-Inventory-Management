import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Input, Select } from './Field';

const meta = {
  component: Input,
  title: 'Components/Field',
  tags: ['ai-generated'],
  args: { 'aria-label': 'Customer name', placeholder: 'e.g. Mrs Tan' },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Customer name');
    await userEvent.type(input, 'Mrs Tan');
    await expect(input).toHaveValue('Mrs Tan');
  },
};

export const Invalid: Story = {
  args: { invalid: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Customer name')).toHaveAttribute('aria-invalid', 'true');
  },
};

export const SelectField: Story = {
  render: () => (
    <Select aria-label="Handover" defaultValue="">
      <option value="">Month, year</option>
      <option value="Feb 2027">Feb 2027</option>
      <option value="Mar 2027">Mar 2027</option>
    </Select>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.selectOptions(canvas.getByLabelText('Handover'), 'Mar 2027');
    await expect(canvas.getByLabelText('Handover')).toHaveValue('Mar 2027');
  },
};

export const MutedSelect: Story = {
  render: () => (
    <Select aria-label="Reserve for" muted defaultValue="proposal">
      <option value="proposal">Proposal</option>
    </Select>
  ),
  globals: { theme: 'dark' },
};

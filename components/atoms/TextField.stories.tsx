import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { TextField, NumberInput, Select } from './TextField';

const meta = {
  component: TextField,
  title: 'Atoms/TextField',
  tags: ['ai-generated', 'autodocs'],
  args: { label: 'Customer name', placeholder: 'e.g. Mrs Tan' },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Customer name');
    await userEvent.type(input, 'Mrs Tan');
    await expect(input).toHaveValue('Mrs Tan');
  },
};

/** `showLabel={false}` hides the label. Screen readers still read it. */
export const WithoutLabel: Story = {
  args: { showLabel: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('Customer name')).not.toBeInTheDocument();
    await expect(canvas.getByLabelText('Customer name')).toBeInTheDocument();
  },
};

export const Required: Story = { args: { required: true } };

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
  tags: ['!autodocs'], globals: { theme: 'dark' },
};

export const Disabled: Story = { args: { disabled: true, value: 'Mrs Tan', readOnly: true } };

export const Metres: Story = {
  render: () => <NumberInput aria-label="Metres to reserve" placeholder="0" />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Metres to reserve');
    await userEvent.type(input, '12.5');
    await expect(input).toHaveValue(12.5);
  },
};

export const MetresInvalid: Story = {
  render: () => <NumberInput aria-label="Metres cut" defaultValue={60} invalid />,
};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { TextField, NumberInput, Select } from '../atoms/TextField';
import { FormField } from './FormField';

const meta = {
  component: FormField,
  title: 'Molecules/FormField',
  tags: ['ai-generated', 'autodocs'],
  args: { label: 'Customer name', children: (field) => <TextField {...field} placeholder="e.g. Mrs Tan" /> },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    // The label is linked to the input.
    await expect(canvas.getByLabelText('Customer name')).toBeInTheDocument();
  },
};
export const WithHelper: Story = {
  args: { label: 'Metres to reserve', required: true, helper: 'An estimate is fine. You can change it later.', children: (field) => <NumberInput {...field} /> },
};
export const WithError: Story = {
  args: { label: 'Metres cut', error: 'This roll only has 12 m left.', children: (field) => <NumberInput {...field} defaultValue={60} /> },
};
export const WithSelect: Story = {
  args: {
    label: 'Who is cutting?',
    children: (field) => (
      <Select {...field} defaultValue="">
        <option value="" disabled>Pick a name</option>
        <option>Ah Hock</option>
        <option>Siti</option>
      </Select>
    ),
  },
};
export const Dark: Story = { args: { helper: 'As written on the quotation.' }, tags: ['!autodocs'], globals: { theme: 'dark' } };

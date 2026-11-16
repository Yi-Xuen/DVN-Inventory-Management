import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { CalcSheet, ReserveSheet } from './Sheets';

const meta = {
  component: CalcSheet,
  tags: ['ai-generated'],
  args: { fabricId: 'sbw', onClose: fn() },
} satisfies Meta<typeof CalcSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Calculator: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('dialog', { name: /calculate balance/i })).toHaveAttribute('aria-modal', 'true');
  },
};

export const CalculatorDark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' } };

export const Reserve: Story = {
  render: (args) => <ReserveSheet fabricId={args.fabricId} onClose={args.onClose} onDone={fn()} />,
  play: async ({ canvas, userEvent }) => {
    // Proposal is the default tab; picking another tab must move aria-selected.
    const proposal = await canvas.findByRole('tab', { name: /proposal/i });
    await expect(proposal).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(canvas.getByRole('tab', { name: /confirmed/i }));
    await expect(canvas.getByRole('tab', { name: /confirmed/i })).toHaveAttribute('aria-selected', 'true');
  },
};

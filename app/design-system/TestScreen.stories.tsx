import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { TestScreen } from './TestScreen';

const meta = {
  component: TestScreen,
  tags: ['ai-generated'],
  // The screen is built from design-system utilities (bg-surface, text-fg ...), so it lives on page colours.
  decorators: [(Story) => <div className="font-ds min-h-screen bg-page text-fg"><Story /></div>],
} satisfies Meta<typeof TestScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Fabric stock, at a glance');
  },
};

export const Dark: Story = { globals: { theme: 'dark' } };

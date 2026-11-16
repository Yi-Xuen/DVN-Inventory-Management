import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ThemeToggle from './ThemeToggle';

const meta = {
  component: ThemeToggle,
  title: 'Molecules/ThemeToggle',
  tags: ['ai-generated'],
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Cycles System, Light, Dark. It sets the theme on the whole page, so it overrides the toolbar's theme switch here. */
export const Default: Story = {};

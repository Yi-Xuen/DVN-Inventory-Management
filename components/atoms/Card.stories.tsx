import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Card } from './Card';

const meta = {
  component: Card,
  title: 'Atoms/Card',
  tags: ['ai-generated', 'autodocs'],
  decorators: [(Story) => <div className="bg-page p-4"><Story /></div>],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <p className="body-2">Linen blend, 48 m remaining.</p> },
};

export const Link: Story = {
  args: { href: '#/on-hand', children: <p className="body-2 font-semibold">On hand · 75 m</p> },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: /on hand/i })).toHaveAttribute('href', '#/on-hand');
  },
};

export const Dark: Story = { ...Default, tags: ['!autodocs'], globals: { theme: 'dark' } };

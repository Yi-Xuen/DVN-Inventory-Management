import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import App from './App';

const meta = {
  component: App,
  tags: ['ai-generated'],
  parameters: { viewport: { defaultViewport: 'mobile1' } },
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

// Overview: the balance figure only appears once the store has loaded the seed data.
export const Overview: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Soft Blackout - 1065 white')).toBeVisible();
    await expect(canvas.getByRole('link', { name: /on hand/i })).toHaveAttribute('href', '#/on-hand');
  },
};

// The brand button must resolve to the design-system brand colour (--bg-brand = brand.primary.base #0E2C22).
export const CssCheck: Story = {
  play: async ({ canvas }) => {
    const button = await canvas.findByRole('button', { name: /reserve this fabric/i });
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(14, 44, 34)');
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};

const openRoute = (hash: string): Story['beforeEach'] => () => {
  window.location.hash = hash;
};

export const OnHand: Story = { beforeEach: openRoute('/on-hand') };

export const Proposals: Story = {
  beforeEach: openRoute('/proposal'),
  play: async ({ canvas }) => {
    await expect(await canvas.findByText(/Mr Chew/)).toBeVisible();
  },
};

export const JobDetail: Story = { beforeEach: openRoute('/job/p1') };

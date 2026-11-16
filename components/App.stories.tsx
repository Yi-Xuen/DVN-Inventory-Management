import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import App from './App';

const meta = {
  component: App,
  tags: ['ai-generated'],
  globals: { viewport: { value: 'mobile' } },
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

const openRoute = (hash: string): Story['beforeEach'] => () => {
  window.location.hash = hash;
};

// Stock tab: the four tiles only appear once the store has loaded the seed data.
export const Stock: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('link', { name: /shortage/i })).toHaveAttribute('href', '#/stock/shortage');
    await expect(canvas.getByRole('link', { name: 'Stock' })).toHaveAttribute('aria-current', 'page');
  },
};

export const StockShortage: Story = {
  beforeEach: openRoute('/stock/shortage'),
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Voile Sheer - Essentia ivory')).toBeVisible();
  },
};

export const Jobs: Story = {
  beforeEach: openRoute('/jobs'),
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('tab', { name: /my jobs/i })).toHaveAttribute('aria-selected', 'true');
  },
};

export const Search: Story = { beforeEach: openRoute('/search') };

export const Fabric: Story = {
  beforeEach: openRoute('/fabric/sbw'),
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Soft Blackout - 1065 white')).toBeVisible();
    await expect(canvas.getByRole('link', { name: /on hand/i })).toHaveAttribute('href', '#/fabric/sbw/on-hand');
  },
};

// The primary button must resolve to the design-system primary colour (--bg-primary = green.700 #1D5C47).
export const CssCheck: Story = {
  beforeEach: openRoute('/fabric/sbw'),
  play: async ({ canvas }) => {
    const button = await canvas.findByRole('button', { name: /reserve this fabric/i });
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(29, 92, 71)');
  },
};

export const Dark: Story = {
  tags: ['!autodocs'], globals: { theme: 'dark' },
};

export const OnHand: Story = { beforeEach: openRoute('/fabric/sbw/on-hand') };

export const Proposals: Story = {
  beforeEach: openRoute('/fabric/sbw/proposal'),
  play: async ({ canvas }) => {
    await expect(await canvas.findByText(/Mr Chew/)).toBeVisible();
  },
};

// A proposal the signed-in salesperson owns: one Update status button, and each fabric has Edit.
export const JobDetail: Story = {
  beforeEach: openRoute('/job/p1'),
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('button', { name: /update status/i })).toBeVisible();
    await expect(canvas.getByRole('button', { name: /merge with another reservation/i })).toBeVisible();
  },
};

// Someone else's job is read-only.
export const JobDetailNotMine: Story = {
  beforeEach: openRoute('/job/p2'),
  play: async ({ canvas }) => {
    await expect(await canvas.findByText(/Reserved by Mei Ling/)).toBeVisible();
    await expect(canvas.queryByRole('button', { name: /update status/i })).toBeNull();
  },
};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Activity, Category, ClipboardText, SearchNormal1, Setting2 } from 'iconsax-react';
import { expect } from 'storybook/test';
import { TabBar } from './TabBar';

const items = [
  { key: 'stock', label: 'Stock', icon: Category, href: '#/' },
  { key: 'jobs', label: 'Jobs', icon: ClipboardText, href: '#/jobs' },
  { key: 'search', label: 'Search', icon: SearchNormal1, href: '#/search' },
  { key: 'activities', label: 'Activities', icon: Activity, href: '#/activities' },
  { key: 'settings', label: 'Settings', icon: Setting2, href: '#/settings' },
];

const meta = {
  title: 'Organisms/TabBar',
  component: TabBar,
  tags: ['ai-generated'],
  args: { items, activeKey: 'stock' },
  parameters: { layout: 'fullscreen' },
  globals: { viewport: { value: 'mobile' } },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Stock' })).toHaveAttribute('aria-current', 'page');
  },
};

export const JobsActive: Story = { args: { activeKey: 'jobs' } };

/** The bar keeps its phone width on larger screens, centred like the prototype shell. */
export const Tablet: Story = { globals: { viewport: { value: 'tablet' } } };
export const Desktop: Story = { globals: { viewport: { value: 'desktop' } } };

export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' } };

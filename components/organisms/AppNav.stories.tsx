import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { Box1, ClipboardText, Home2, More, Scissor, TruckFast } from 'iconsax-react';
import { Avatar } from '../atoms/Avatar';
import { AppNav } from './AppNav';

const sales = [
  { key: 'overview', label: 'Overview', icon: Home2, href: '#overview' },
  { key: 'fabrics', label: 'Fabrics', icon: Box1, href: '#fabrics' },
  { key: 'jobs', label: 'Jobs', icon: ClipboardText, href: '#jobs' },
  { key: 'more', label: 'More', icon: More, href: '#more' },
];
const factory = [
  { key: 'work', label: 'Work list', icon: Scissor, href: '#work' },
  { key: 'fabrics', label: 'Fabrics', icon: Box1, href: '#fabrics' },
  { key: 'receive', label: 'Receive', icon: TruckFast, href: '#receive' },
  { key: 'more', label: 'More', icon: More, href: '#more' },
];

const meta = {
  component: AppNav,
  title: 'Organisms/AppNav',
  tags: ['ai-generated'],
  args: {
    items: sales,
    activeKey: 'fabrics',
    onScan: fn(),
    brand: <span className="heading-4 text-fg-primary">DVN</span>,
    footer: <Avatar name="Mei Ling Tan" />,
  },
  // Page content padded the way the app shell will pad it.
  decorators: [
    (Story) => (
      <div className="min-h-dvh bg-page">
        <Story />
        <main className="body-3 p-4 pb-20 text-fg-subtle md:pb-4 md:pl-24 lg:pl-64">Page content goes here.</main>
      </div>
    ),
  ],
} satisfies Meta<typeof AppNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bottom bar with the scan button in the centre. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Fabrics' })).toHaveAttribute('aria-current', 'page');
  },
};
/** Icon rail on the left. */
export const Tablet: Story = { globals: { viewport: { value: 'tablet' } } };
/** Sidebar with labels. */
export const Desktop: Story = { globals: { viewport: { value: 'desktop' } } };
export const FactoryMobile: Story = { args: { items: factory, activeKey: 'work' }, globals: { viewport: { value: 'mobile' } } };
export const FactoryDesktop: Story = { args: { items: factory, activeKey: 'work', footer: <Avatar name="Factory" /> }, globals: { viewport: { value: 'desktop' } } };
export const DarkMobile: Story = { tags: ['!autodocs'], globals: { viewport: { value: 'mobile' }, theme: 'dark' } };

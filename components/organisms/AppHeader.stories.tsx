import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { AppHeader } from './AppHeader';

function Controlled(args: React.ComponentProps<typeof AppHeader>) {
  const [search, setSearch] = useState(args.search ?? '');
  return <AppHeader {...args} search={search} onSearchChange={args.onSearchChange && setSearch} />;
}

const meta = {
  component: AppHeader,
  title: 'Organisms/AppHeader',
  tags: ['ai-generated'],
  args: { title: 'Fabrics', user: 'Mei Ling Tan', onSearchChange: fn() },
  render: (args) => <Controlled {...args} />,
  decorators: [(Story) => <div className="min-h-64 bg-page"><Story /></div>],
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Title row, then search on its own row. */
export const Mobile: Story = { globals: { viewport: { value: 'mobile' } } };
/** One row. */
export const Tablet: Story = { globals: { viewport: { value: 'tablet' } } };
/** One row, with the user's name. */
export const Desktop: Story = { globals: { viewport: { value: 'desktop' } } };
export const DetailPage: Story = {
  args: { title: 'HO5D', subtitle: 'HDB HomeArt blackout · 3009 · colour 13', onBack: fn(), onSearchChange: undefined },
  globals: { viewport: { value: 'mobile' } },
};
export const DarkDesktop: Story = { tags: ['!autodocs'], globals: { viewport: { value: 'desktop' }, theme: 'dark' } };

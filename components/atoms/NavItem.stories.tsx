import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Box1 } from 'iconsax-react';
import { NavItem } from './NavItem';

const meta = {
  component: NavItem,
  title: 'Atoms/NavItem',
  tags: ['ai-generated', 'autodocs'],
  args: { icon: Box1, label: 'Fabrics', href: '#fabrics' },
  decorators: [(Story) => <div className="flex w-40 bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {};
export const Active: Story = { args: { active: true } };
/** Icon above the label, as used in the bottom bar. */
export const Mobile: Story = { args: { active: true }, globals: { viewport: { value: 'mobile' } } };
/** Icon beside the label, as used in the sidebar. */
export const Desktop: Story = { args: { active: true }, globals: { viewport: { value: 'desktop' } } };
export const Dark: Story = { args: { active: true }, tags: ['!autodocs'], globals: { theme: 'dark' } };

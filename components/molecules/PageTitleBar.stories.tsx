import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Calculator } from 'iconsax-react';
import { Icon } from '../atoms/Icon';
import { IconButton } from '../atoms/IconButton';
import { PageTitleBar } from './PageTitleBar';

const meta = {
  component: PageTitleBar,
  title: 'Molecules/PageTitleBar',
  tags: ['ai-generated', 'autodocs'],
  args: { title: 'HO5D', subtitle: 'HDB HomeArt blackout · 3009 · colour 13', onBack: fn() },
  decorators: [(Story) => <div className="bg-page px-4"><Story /></div>],
} satisfies Meta<typeof PageTitleBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAction: Story = {
  args: { actions: <IconButton variant="outlined" aria-label="Balance calculator"><Icon icon={Calculator} /></IconButton> },
};
export const TopLevel: Story = { args: { title: 'Fabrics', subtitle: undefined, onBack: undefined } };
export const Mobile: Story = { globals: { viewport: { value: 'mobile' } } };
/** Larger title. */
export const Desktop: Story = { globals: { viewport: { value: 'desktop' } } };
export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' } };

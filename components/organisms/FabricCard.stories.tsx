import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FabricCard } from './FabricCard';

const meta = {
  component: FabricCard,
  title: 'Organisms/FabricCard',
  tags: ['ai-generated', 'autodocs'],
  args: { code: 'HO5D', description: 'HDB HomeArt blackout · 3009 · colour 13', onHand: 100, actualBalance: 60, reserveBalance: 35, href: '#HO5D' },
  decorators: [(Story) => <div className="bg-page p-4"><Story /></div>],
} satisfies Meta<typeof FabricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const Grid = () => (
  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
    <FabricCard code="SH2A" description="Sheer voile · 2210 · colour 02" onHand={80} actualBalance={20} reserveBalance={-15} waiting={10} href="#SH2A" />
    <FabricCard code="HO5D" description="HDB HomeArt blackout · 3009 · colour 13" onHand={100} actualBalance={60} reserveBalance={35} href="#HO5D" />
    <FabricCard code="DM7C" description="Dimout linen look · 4102 · colour 07" onHand={45} actualBalance={45} reserveBalance={45} href="#DM7C" />
    <FabricCard code="BK1F" description="Blackout plain · 1180 · colour 21" onHand={30} actualBalance={0} reserveBalance={0} waiting={12} href="#BK1F" />
  </div>
);

export const Default: Story = {};
export const Short: Story = { args: { actualBalance: 20, reserveBalance: -15 } };
export const WaitingForStock: Story = { args: { actualBalance: 0, reserveBalance: 0, waiting: 12 } };
/** One column. */
export const GridMobile: Story = { render: Grid, globals: { viewport: { value: 'mobile' } } };
/** Two columns. */
export const GridTablet: Story = { render: Grid, globals: { viewport: { value: 'tablet' } } };
/** Three columns. */
export const GridDesktop: Story = { render: Grid, globals: { viewport: { value: 'desktop' } } };
export const Dark: Story = { args: { actualBalance: 20, reserveBalance: -15 }, tags: ['!autodocs'], globals: { theme: 'dark' } };

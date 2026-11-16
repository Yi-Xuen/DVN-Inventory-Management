import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatTile } from './StatTile';

const meta = {
  title: 'Molecules/StatTile',
  component: StatTile,
  tags: ['ai-generated'],
  args: { label: 'To buy', value: 2, hint: 'fabrics short', href: '#/stock/to-buy' },
  decorators: [(Story) => <div className="w-44"><Story /></div>],
} satisfies Meta<typeof StatTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A figure that needs attention turns to the danger colour. */
export const Danger: Story = { args: { tone: 'danger' } };

/** Danger tone stays quiet at zero. */
export const DangerAtZero: Story = { args: { tone: 'danger', value: 0 } };

/** Without a link there is no chevron. */
export const NoLink: Story = { args: { href: undefined, label: 'In factory', value: 4, hint: 'jobs' } };

/** The Stock tab uses tiles with just a label and a number. */
export const LabelOnly: Story = { args: { hint: undefined } };

/** A tile used as a view picker: tap to choose, the chosen one has a primary ring. */
export const Selectable: Story = { args: { href: undefined, onClick: () => {}, selected: true, label: 'Proposal', value: 3, tone: 'default', hint: undefined } };
export const SelectableOff: Story = { args: { href: undefined, onClick: () => {}, selected: false, label: 'Confirmed', value: 4, hint: undefined } };

export const Grid: Story = {
  decorators: [(Story) => <div className="grid w-80 grid-cols-2 gap-2"><Story /><StatTile label="Backorder" value={1} hint="job waiting" href="#" /><StatTile label="In factory" value={4} hint="jobs" href="#" /><StatTile label="Arrived" value={2} hint="rolls this week" href="#" /></div>],
  args: { tone: 'danger' },
};

export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' }, args: { tone: 'danger' } };

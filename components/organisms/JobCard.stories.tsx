import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Pill } from '../atoms/Pill';
import { JobCard } from './JobCard';

const two = [
  { name: 'Soft Blackout - 1065 white', metres: 20 },
  { name: 'Soft Blackout - 1065 cream', metres: 15 },
];

const meta = {
  title: 'Organisms/JobCard',
  component: JobCard,
  tags: ['ai-generated', 'autodocs'],
  args: {
    customer: 'Mr Chew', location: 'Jelutong', by: 'Leonard', handover: 'Feb 2027', href: '#/job/p1',
    badges: <Pill tone="soft">Very likely</Pill>, fabrics: two,
  },
  decorators: [(Story) => <div className="bg-page p-4"><Story /></div>],
} satisfies Meta<typeof JobCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A proposal: the likelihood pill sits at the top right. */
export const Proposal: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link')).toHaveAttribute('href', '#/job/p1');
    await expect(canvas.getByText('Leonard · Handover Feb 2027')).toBeVisible();
  },
};

export const SingleFabric: Story = { args: { fabrics: [two[0]] } };

/** One fabric cannot be covered by stock yet: a small alert icon and red metres mark it. */
export const Backorder: Story = {
  args: { badges: <Pill tone="success">Confirmed</Pill>, fabrics: [two[0], { ...two[1], backorder: true }] },
  play: async ({ canvas }) => {
    // Colour alone is not enough, so the alert icon is also announced to screen readers.
    await expect(canvas.getByRole('img', { name: 'Backorder' })).toBeVisible();
  },
};

/** Two different fabrics in one job, one of them on backorder. */
export const TwoFabrics: Story = {
  args: { customer: 'Mr Azman', location: 'Balik Pulau', badges: <Pill tone="soft">Likely</Pill>, handover: 'Mar 2027', fabrics: [{ name: 'Soft Blackout - 1065 white', metres: 9, backorder: true }, { name: 'Soft Blackout - 1065 gray', metres: 4 }] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('9 m')).toHaveClass('text-fg-danger');
    await expect(canvas.getByText('4 m')).not.toHaveClass('text-fg-danger');
  },
};

export const Worksheet: Story = {
  args: { customer: 'Mrs Tan', location: 'Tanjung Bungah', by: 'Mei Ling', handover: 'Dec 2026', status: 'Sewing in progress', badges: <Pill tone="soft">WS 1042</Pill> },
};

export const HandoverNotSet: Story = { args: { handover: null } };

/** A finished job shows the completion date and the rolls each fabric came from. */
export const Done: Story = {
  args: {
    badges: <Pill tone="soft">WS 1031</Pill>, completed: '30 Oct 2026', handover: undefined,
    fabrics: [{ name: 'Soft Blackout - 1065 white', metres: 30, note: 'Rolls 2608-A, 2609-A' }],
  },
};

export const LongNames: Story = {
  args: { customer: 'Mdm Siti Nurhaliza binti Abdullah', location: 'Taman Tun Dr Ismail', fabrics: [{ name: 'Linen Look - Oslo 05 extra wide natural', metres: 125.5 }] },
};

const Grid = () => (
  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
    <JobCard customer="Mr Chew" location="Jelutong" by="Leonard" handover="Feb 2027" badges={<Pill tone="soft">Very likely</Pill>} fabrics={two} href="#/job/p1" />
    <JobCard customer="Mdm Wee" location="Tanjung Tokong" by="Leonard" handover="Mar 2027" fabrics={[{ name: 'Voile Sheer - Essentia ivory', metres: 20, backorder: true }]} href="#/job/c4" />
    <JobCard customer="Mrs Tan" location="Tanjung Bungah" by="Mei Ling" handover="Dec 2026" status="Sewing in progress" badges={<Pill tone="soft">WS 1042</Pill>} fabrics={two} href="#/job/ws1042" />
  </div>
);

/** One column. */
export const Mobile: Story = { render: Grid, globals: { viewport: { value: 'mobile' } } };
/** Two columns. */
export const Tablet: Story = { render: Grid, globals: { viewport: { value: 'tablet' } } };
/** Three columns. */
export const Desktop: Story = { render: Grid, globals: { viewport: { value: 'desktop' } } };

export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' }, args: { fabrics: [two[0], { ...two[1], backorder: true }] } };

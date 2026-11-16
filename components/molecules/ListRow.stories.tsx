import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';
import { StatusBadge } from '../atoms/StatusBadge';
import { ListRow } from './ListRow';

const meta = {
  component: ListRow,
  title: 'Molecules/ListRow',
  tags: ['ai-generated', 'autodocs'],
  args: { title: 'Mrs Tan', subtitle: 'Reserved by Mei Ling · 3 days ago', value: '25 m' },
  decorators: [(Story) => <div className="bg-surface px-4"><Story /></div>],
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Link: Story = { args: { href: '#job', title: 'HO5D', subtitle: 'HDB HomeArt blackout · 3009 · colour 13', value: '37.5 m' } };
export const WithBadge: Story = { args: { leading: <Avatar name="Mei Ling Tan" size="sm" />, trailing: <StatusBadge status="waiting" /> } };
export const WithAction: Story = { args: { trailing: <Button variant="danger" size="sm" fullWidth={false}>Cancel</Button> } };
/** The badge wraps under the text. */
export const Mobile: Story = { args: { trailing: <StatusBadge status="waiting" /> }, globals: { viewport: { value: 'mobile' } } };
/** Everything on one line. */
export const Tablet: Story = { args: { trailing: <StatusBadge status="waiting" /> }, globals: { viewport: { value: 'tablet' } } };
export const Dark: Story = { args: { trailing: <StatusBadge status="confirmed" /> }, tags: ['!autodocs'], globals: { theme: 'dark' } };

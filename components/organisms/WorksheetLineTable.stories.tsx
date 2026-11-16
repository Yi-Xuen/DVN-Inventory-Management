import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { WorksheetLineTable, type WorksheetLine } from './WorksheetLineTable';

const lines: WorksheetLine[] = [
  { itemNo: '1001-1', room: 'Living room', fabricCode: 'HO5D', confirmed: 50, actual: 45, status: 'completed' },
  { itemNo: '1001-2', room: 'Master bedroom', fabricCode: 'HO5D', confirmed: 20, status: 'in_progress' },
  { itemNo: '1001-3', room: 'Bedroom 2', fabricCode: 'SH2A', confirmed: 12.5, status: 'confirmed' },
  { itemNo: '1001-4', room: 'Study', fabricCode: 'SH2A', confirmed: 8, status: 'waiting' },
  { itemNo: '1001-5', room: 'Kitchen', fabricCode: 'DM7C', confirmed: 6, status: 'cancelled' },
];

const meta = {
  component: WorksheetLineTable,
  title: 'Organisms/WorksheetLineTable',
  tags: ['ai-generated', 'autodocs'],
  args: { lines },
  decorators: [(Story) => <div className="bg-page p-4"><Story /></div>],
} satisfies Meta<typeof WorksheetLineTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
/** One card per line. */
export const Mobile: Story = { globals: { viewport: { value: 'mobile' } } };
/** A table. */
export const Tablet: Story = { globals: { viewport: { value: 'tablet' } } };
export const Desktop: Story = { globals: { viewport: { value: 'desktop' } } };
export const DarkMobile: Story = { tags: ['!autodocs'], globals: { viewport: { value: 'mobile' }, theme: 'dark' } };

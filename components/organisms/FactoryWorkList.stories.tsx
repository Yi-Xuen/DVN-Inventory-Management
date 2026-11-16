import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { FactoryWorkList, type FactoryJob } from './FactoryWorkList';

const jobs: FactoryJob[] = [
  { itemNo: '1001-2', customer: 'Mrs Tan', room: 'Master bedroom', fabricCode: 'HO5D', fabricName: 'HDB HomeArt blackout · 3009 · colour 13', confirmed: 20, status: 'in_progress' },
  { itemNo: '1001-3', customer: 'Mrs Tan', room: 'Bedroom 2', fabricCode: 'SH2A', fabricName: 'Sheer voile · 2210 · colour 02', confirmed: 12.5, status: 'confirmed' },
  { itemNo: '1003-1', customer: 'Mr Lim', room: 'Living room', fabricCode: 'DM7C', fabricName: 'Dimout linen look · 4102 · colour 07', confirmed: 34, status: 'confirmed' },
  { itemNo: '1004-1', customer: 'Dr Wong', room: 'Study', fabricCode: 'HO5D', fabricName: 'HDB HomeArt blackout · 3009 · colour 13', confirmed: 8, status: 'confirmed' },
];

const meta = {
  component: FactoryWorkList,
  title: 'Organisms/FactoryWorkList',
  tags: ['ai-generated', 'autodocs'],
  args: { jobs, onStart: fn(), onLogCut: fn() },
  decorators: [(Story) => <div className="bg-page p-4"><Story /></div>],
} satisfies Meta<typeof FactoryWorkList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Log cut' }));
    await expect(args.onLogCut).toHaveBeenCalledWith('1001-2');
    await userEvent.click(canvas.getAllByRole('button', { name: 'Start sewing' })[0]);
    await expect(args.onStart).toHaveBeenCalledWith('1001-3');
  },
};
export const Empty: Story = { args: { jobs: [] } };
/** One column. */
export const Mobile: Story = { globals: { viewport: { value: 'mobile' } } };
/** Two columns. */
export const Tablet: Story = { globals: { viewport: { value: 'tablet' } } };
/** Three columns. */
export const Desktop: Story = { globals: { viewport: { value: 'desktop' } } };
export const Dark: Story = { tags: ['!autodocs'], globals: { theme: 'dark' } };

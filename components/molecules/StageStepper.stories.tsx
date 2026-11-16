import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StageStepper } from './StageStepper';

const meta = {
  component: StageStepper,
  title: 'Molecules/StageStepper',
  tags: ['ai-generated', 'autodocs'],
  args: { current: 1 },
  decorators: [(Story) => <div className="bg-surface p-4"><Story /></div>],
} satisfies Meta<typeof StageStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FirstStage: Story = { args: { current: 0 } };
export const LastStage: Story = { args: { current: 4 } };
/** Compact: current stage name and a progress bar. */
export const Mobile: Story = { args: { current: 2 }, globals: { viewport: { value: 'mobile' } } };
/** Every stage is named. */
export const Tablet: Story = { args: { current: 2 }, globals: { viewport: { value: 'tablet' } } };
export const Desktop: Story = { args: { current: 2 }, globals: { viewport: { value: 'desktop' } } };
export const Dark: Story = { args: { current: 3 }, tags: ['!autodocs'], globals: { theme: 'dark' } };

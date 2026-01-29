import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './index';

const meta: Meta<typeof Checkbox> = {
  title: 'Design System/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['square', 'round'],
      description: '체크박스 변형',
    },
    checked: {
      control: 'boolean',
      description: '체크 상태',
    },
    label: {
      control: 'text',
      description: '라벨 텍스트',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    variant: 'square',
    label: '한국어',
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    variant: 'square',
    label: '한국어',
    checked: true,
  },
};

export const Round: Story = {
  args: {
    variant: 'round',
    label: '한국어',
    checked: false,
  },
};

export const RoundChecked: Story = {
  args: {
    variant: 'round',
    label: '한국어',
    checked: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Checkbox variant="square" label="한국어" checked={true} />
        <Checkbox variant="square" label="한국어" checked={false} />
      </div>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Checkbox variant="round" label="한국어" checked={true} />
        <Checkbox variant="round" label="한국어" checked={false} />
      </div>
    </div>
  ),
};

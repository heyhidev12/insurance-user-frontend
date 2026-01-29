import type { Meta, StoryObj } from '@storybook/react';
import Chip from './index';

const meta: Meta<typeof Chip> = {
  title: 'Design System/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['square', 'round'],
      description: '칩 변형',
    },
    size: {
      control: 'select',
      options: ['48', '44', '40', '38'],
      description: '칩 크기',
    },
    checked: {
      control: 'boolean',
      description: '체크 상태',
    },
    label: {
      control: 'text',
      description: '라벨 텍스트',
    },
    showArrow: {
      control: 'boolean',
      description: '화살표 표시',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    variant: 'square',
    size: '48',
    label: '한국어',
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    variant: 'square',
    size: '48',
    label: '한국어',
    checked: true,
  },
};

export const RoundChecked: Story = {
  args: {
    variant: 'round',
    size: '48',
    label: '한국어',
    checked: true,
  },
};

export const WithArrow: Story = {
  args: {
    label: '한국어',
    showArrow: true,
    checked: false,
  },
};

export const WithArrowActive: Story = {
  args: {
    label: '한국어',
    showArrow: true,
    checked: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', backgroundColor: '#151515', padding: '32px', minHeight: '100vh' }}>
      {/* Size 48 - Vertical Layout (Figma design) */}
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '12px', fontSize: '12px' }}>Size 48 (Vertical Layout)</p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <Chip variant="square" size="48" label="한국어" checked={true} layout="vertical" />
          <Chip variant="square" size="48" label="한국어" checked={false} layout="vertical" />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <Chip variant="round" size="48" label="한국어" checked={true} layout="vertical" />
          <Chip variant="round" size="48" label="한국어" checked={false} layout="vertical" />
        </div>
      </div>

      {/* Size 44 - Horizontal Layout */}
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '12px', fontSize: '12px' }}>Size 44 (Horizontal Layout)</p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Chip variant="square" size="44" label="한국어" checked={true} />
          <Chip variant="square" size="44" label="한국어" checked={false} />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Chip variant="round" size="44" label="한국어" checked={true} />
          <Chip variant="round" size="44" label="한국어" checked={false} />
        </div>
      </div>

      {/* Size 40 - Vertical Layout (Figma design) */}
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '12px', fontSize: '12px' }}>Size 40 (Vertical Layout)</p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <Chip variant="square" size="40" label="한국어" checked={true} layout="vertical" />
          <Chip variant="square" size="40" label="한국어" checked={false} layout="vertical" />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <Chip variant="round" size="40" label="한국어" checked={true} layout="vertical" />
          <Chip variant="round" size="40" label="한국어" checked={false} layout="vertical" />
        </div>
      </div>

      {/* Size 38 - Horizontal Layout with Arrow */}
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '12px', fontSize: '12px' }}>Size 38 (Arrow Type)</p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Chip size="38" label="한국어" showArrow checked={true} />
          <Chip size="38" label="한국어" showArrow checked={false} />
        </div>
      </div>

      {/* Size 44 - Arrow Type */}
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '12px', fontSize: '12px' }}>Size 44 (Arrow Type)</p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Chip size="44" label="한국어" showArrow checked={true} />
          <Chip size="44" label="한국어" showArrow checked={false} />
        </div>
      </div>
    </div>
  ),
};








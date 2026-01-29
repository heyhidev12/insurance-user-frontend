import type { Meta, StoryObj } from '@storybook/react';
import FloatingButton from './index';

const meta: Meta<typeof FloatingButton> = {
  title: 'Design System/FloatingButton',
  component: FloatingButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['consult', 'top', 'top-mobile'],
      description: '플로팅 버튼 타입',
    },
    label: {
      control: 'text',
      description: '버튼 레이블 (consult 타입만)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FloatingButton>;

export const Default: Story = {
  args: {
    variant: 'consult',
    label: '상담 신청하기',
  },
};

export const Consult: Story = {
  args: {
    variant: 'consult',
    label: '상담 신청하기',
  },
};

export const Top: Story = {
  args: {
    variant: 'top',
  },
};

export const TopMobile: Story = {
  args: {
    variant: 'top-mobile',
  },
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '14px' }}>
          상담 신청 버튼
        </h3>
        <FloatingButton variant="consult" label="상담 신청하기" />
      </div>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '14px' }}>
          Top 버튼 (Web)
        </h3>
        <FloatingButton variant="top" />
      </div>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '14px' }}>
          Top 버튼 (Mobile)
        </h3>
        <FloatingButton variant="top-mobile" />
      </div>
    </div>
  ),
};

// Interactive Demo
export const InteractiveDemo: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        height: '300px',
        backgroundColor: '#1D1D1D',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      <p style={{ color: '#8E8E8E', marginBottom: '20px' }}>
        플로팅 버튼은 화면 우측 하단에 고정되어 표시됩니다.
      </p>
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          alignItems: 'flex-end',
        }}
      >
        <FloatingButton
          variant="consult"
          label="상담 신청하기"
          onClick={() => alert('상담 신청 클릭!')}
        />
        <FloatingButton
          variant="top"
          onClick={() => alert('Top 클릭!')}
        />
      </div>
    </div>
  ),
};

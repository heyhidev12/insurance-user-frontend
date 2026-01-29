import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Header from './index';

const meta: Meta<typeof Header> = {
  title: 'Design System/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['transparent', 'white', 'black'],
      description: '헤더 배경 스타일',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

// ========================================
// Transparent (투명 배경)
// ========================================
export const Transparent: Story = {
  args: {
    variant: 'transparent',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#151515', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export const TransparentMobile: Story = {
  name: 'Transparent - Mobile',
  args: {
    variant: 'transparent',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#151515', padding: '20px', maxWidth: '375px' }}>
        <Story />
      </div>
    ),
  ],
};

// ========================================
// White (흰색 배경)
// ========================================
export const White: Story = {
  args: {
    variant: 'white',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WhiteMobile: Story = {
  name: 'White - Mobile',
  args: {
    variant: 'white',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', maxWidth: '375px' }}>
        <Story />
      </div>
    ),
  ],
};

// ========================================
// Black (검정 배경)
// ========================================
export const Black: Story = {
  args: {
    variant: 'black',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#000000', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export const BlackMobile: Story = {
  name: 'Black - Mobile',
  args: {
    variant: 'black',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#000000', padding: '20px', maxWidth: '375px' }}>
        <Story />
      </div>
    ),
  ],
};

// ========================================
// Showcase (All Variants)
// ========================================
export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <h3 style={{ color: '#333', marginBottom: '16px', fontSize: '16px' }}>
          All Variants (resize browser to see responsive behavior)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#151515', padding: '0' }}>
            <Header variant="transparent" />
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '0', border: '1px solid #e0e0e0' }}>
            <Header variant="white" />
          </div>
          <div style={{ backgroundColor: '#151515', padding: '0' }}>
            <Header variant="black" />
          </div>
        </div>
      </div>
    </div>
  ),
};

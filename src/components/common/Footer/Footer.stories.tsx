import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Footer from './index';

const meta: Meta<typeof Footer> = {
  title: 'Design System/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    copyright: {
      control: 'text',
      description: '저작권 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '375px' }}>
        <Story />
      </div>
    ),
  ],
};

export const AllViewports: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '16px', fontSize: '12px' }}>Desktop (resize browser to see)</p>
        <Footer />
      </div>
      <div style={{ maxWidth: '375px' }}>
        <p style={{ color: '#8E8E8E', marginBottom: '16px', fontSize: '12px' }}>Mobile (375px container)</p>
        <Footer />
      </div>
    </div>
  ),
};

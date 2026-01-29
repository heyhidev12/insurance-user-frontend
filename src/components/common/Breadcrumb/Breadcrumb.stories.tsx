import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumb from './index';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Design System/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    showHome: {
      control: 'boolean',
      description: '홈 아이콘 표시',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const OneDepth: Story = {
  args: {
    showHome: true,
    items: [{ label: '구성원' }],
  },
};

export const TwoDepth: Story = {
  args: {
    showHome: true,
    items: [{ label: '구성원' }, { label: '구성원' }],
  },
};

export const ThreeDepth: Story = {
  args: {
    showHome: true,
    items: [{ label: '구성원' }, { label: '구성원' }, { label: '구성원' }],
  },
};

export const FourDepth: Story = {
  args: {
    showHome: true,
    items: [
      { label: '구성원' },
      { label: '구성원' },
      { label: '구성원' },
      { label: '구성원' },
    ],
  },
};

export const WithLinks: Story = {
  args: {
    showHome: true,
    items: [
      { label: '회사소개', href: '/about' },
      { label: '구성원', href: '/about/members' },
      { label: '세무사' },
    ],
  },
};

export const AllDepths: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>1 Depth</p>
        <Breadcrumb items={[{ label: '구성원' }]} />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>2 Depth</p>
        <Breadcrumb items={[{ label: '구성원' }, { label: '구성원' }]} />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>3 Depth</p>
        <Breadcrumb items={[{ label: '구성원' }, { label: '구성원' }, { label: '구성원' }]} />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>4 Depth</p>
        <Breadcrumb items={[{ label: '구성원' }, { label: '구성원' }, { label: '구성원' }, { label: '구성원' }]} />
      </div>
    </div>
  ),
};

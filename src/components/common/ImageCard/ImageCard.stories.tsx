import type { Meta, StoryObj } from '@storybook/react';
import ImageCard from './index';

const meta: Meta<typeof ImageCard> = {
  title: 'Design System/ImageCard',
  component: ImageCard,
  tags: ['autodocs'],
  argTypes: {
    imageSrc: {
      control: 'text',
      description: '이미지 소스',
    },
    title: {
      control: 'text',
      description: '타이틀 텍스트',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 (오버레이 적용)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageCard>;

export const Default: Story = {
  args: {
    imageSrc: '/images/common/cards/card-image.png',
    title: '든든한 동반자',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    imageSrc: '/images/common/cards/card-image.png',
    title: '든든한 동반자',
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '12px', fontSize: '12px' }}>Active</p>
        <ImageCard imageSrc="/images/common/cards/card-image.png" title="든든한 동반자" />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '12px', fontSize: '12px' }}>Disabled</p>
        <ImageCard imageSrc="/images/common/cards/card-image.png" title="든든한 동반자" disabled />
      </div>
    </div>
  ),
};

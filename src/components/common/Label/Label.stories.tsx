import type { Meta, StoryObj } from '@storybook/react';
import Label from './index';

const meta: Meta<typeof Label> = {
  title: 'Design System/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['skyblue', 'navy', 'gray', 'red', 'white'],
      description: '라벨 색상',
    },
    size: {
      control: 'select',
      options: ['s', 'm'],
      description: '라벨 크기',
    },
    children: {
      control: 'text',
      description: '라벨 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Skyblue: Story = {
  args: {
    color: 'skyblue',
    size: 's',
    children: '취소완료',
  },
};

export const Navy: Story = {
  args: {
    color: 'navy',
    size: 's',
    children: '이용완료',
  },
};

export const Gray: Story = {
  args: {
    color: 'gray',
    size: 's',
    children: '취소완료',
  },
};

export const Red: Story = {
  args: {
    color: 'red',
    size: 's',
    children: '취소완료',
  },
};

export const White: Story = {
  args: {
    color: 'white',
    size: 's',
    children: '취소완료',
  },
};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Size S (13px)</p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Label color="skyblue" size="s">취소완료</Label>
          <Label color="navy" size="s">이용완료</Label>
          <Label color="gray" size="s">취소완료</Label>
          <Label color="white" size="s">취소완료</Label>
          <Label color="red" size="s">취소완료</Label>
        </div>
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Size M (15px)</p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Label color="skyblue" size="m">취소완료</Label>
          <Label color="navy" size="m">이용완료</Label>
          <Label color="gray" size="m">취소완료</Label>
          <Label color="white" size="m">취소완료</Label>
          <Label color="red" size="m">취소완료</Label>
        </div>
      </div>
    </div>
  ),
};

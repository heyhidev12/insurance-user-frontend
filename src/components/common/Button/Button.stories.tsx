import type { Meta, StoryObj } from '@storybook/react';
import Button, { ButtonType, ButtonSize } from './index';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'line-white'],
      description: '버튼 타입',
    },
    size: {
      control: 'select',
      options: ['xlarge', 'large', 'medium', 'small', 'xsmall'],
      description: '버튼 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비',
    },
    children: {
      control: 'text',
      description: '버튼 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: '버튼',
    type: 'primary',
    size: 'large',
  },
};

// All Types
export const Primary: Story = {
  args: {
    children: '버튼',
    type: 'primary',
    size: 'large',
  },
};

export const Secondary: Story = {
  args: {
    children: '버튼',
    type: 'secondary',
    size: 'large',
  },
};

export const LineWhite: Story = {
  args: {
    children: '버튼',
    type: 'line-white',
    size: 'large',
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>Primary</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="primary" size="xlarge">XLarge</Button>
          <Button type="primary" size="large">Large</Button>
          <Button type="primary" size="medium">Medium</Button>
          <Button type="primary" size="small">Small</Button>
          <Button type="primary" size="xsmall">XSmall</Button>
        </div>
      </div>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>Secondary</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="secondary" size="xlarge">XLarge</Button>
          <Button type="secondary" size="large">Large</Button>
          <Button type="secondary" size="medium">Medium</Button>
          <Button type="secondary" size="small">Small</Button>
          <Button type="secondary" size="xsmall">XSmall</Button>
        </div>
      </div>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>Line White</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="line-white" size="xlarge">XLarge</Button>
          <Button type="line-white" size="large">Large</Button>
          <Button type="line-white" size="medium">Medium</Button>
          <Button type="line-white" size="small">Small</Button>
          <Button type="line-white" size="xsmall">XSmall</Button>
        </div>
      </div>
    </div>
  ),
};

// States
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>Primary States</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="primary">Default</Button>
          <Button type="primary" disabled>Disabled</Button>
        </div>
      </div>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>Secondary States</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="secondary">Default</Button>
          <Button type="secondary" disabled>Disabled</Button>
        </div>
      </div>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>Line White States</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="line-white">Default</Button>
          <Button type="line-white" disabled>Disabled</Button>
        </div>
      </div>
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>Left Icon</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="primary" leftIcon="document">다운로드</Button>
          <Button type="secondary" leftIcon="mail">공유하기</Button>
          <Button type="line-white" leftIcon="call">문의하기</Button>
        </div>
      </div>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>Right Icon</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="primary" rightIcon="arrow-right">다음</Button>
          <Button type="secondary" rightIcon="arrow-right">다음</Button>
          <Button type="line-white" rightIcon="arrow-right-white">다음</Button>
        </div>
      </div>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>Both Icons</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="primary" leftIcon="document" rightIcon="arrow-right">문서 보기</Button>
        </div>
      </div>
    </div>
  ),
};

// Full Width
export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Button type="primary" size="large" fullWidth>전체 너비 버튼</Button>
    </div>
  ),
};

// Showcase (Grid like Figma)
const types: ButtonType[] = ['primary', 'secondary', 'line-white'];
const sizes: ButtonSize[] = ['xlarge', 'large', 'medium', 'small', 'xsmall'];

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {types.map((type) => (
        <div key={type}>
          <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '14px', textTransform: 'capitalize' }}>
            {type.replace('-', ' ')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: '12px', alignItems: 'center' }}>
            {sizes.map((size) => (
              <div key={`${type}-${size}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Button type={type} size={size}>버튼</Button>
                <span style={{ color: '#8E8E8E', fontSize: '10px' }}>{size}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
            {sizes.map((size) => (
              <div key={`${type}-${size}-disabled`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Button type={type} size={size} disabled>버튼</Button>
                <span style={{ color: '#8E8E8E', fontSize: '10px' }}>disabled</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

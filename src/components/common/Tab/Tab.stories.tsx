import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tab, { TabStyle, TabSize, TabItem } from './index';

const meta: Meta<typeof Tab> = {
  title: 'Design System/Tab',
  component: Tab,
  tags: ['autodocs'],
  argTypes: {
    style: {
      control: 'select',
      options: ['fill', 'box', 'line', 'menu'],
      description: '탭 스타일',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '탭 크기',
    },
    showActiveDot: {
      control: 'boolean',
      description: '활성 탭에 점 표시 (box, line, menu 스타일에서 적용)',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#151515', minHeight: '100px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tab>;

// 기본 탭 데이터
const defaultTabs: TabItem[] = [
  { id: '1', label: '진행' },
  { id: '2', label: '완료' },
  { id: '3', label: '취소' },
];

const twoTabs: TabItem[] = [
  { id: '1', label: 'Tab' },
  { id: '2', label: 'Tab' },
];

const threeTabs: TabItem[] = [
  { id: '1', label: 'Tab' },
  { id: '2', label: 'Tab' },
  { id: '3', label: 'Tab' },
];

const sevenTabs: TabItem[] = [
  { id: '1', label: 'Tab' },
  { id: '2', label: 'Tab' },
  { id: '3', label: 'Tab' },
  { id: '4', label: 'Tab' },
  { id: '5', label: 'Tab' },
  { id: '6', label: 'Tab' },
  { id: '7', label: 'Tab' },
];

const manyTabs: TabItem[] = [
  { id: '1', label: '진행' },
  { id: '2', label: '진행' },
  { id: '3', label: '진행' },
  { id: '4', label: '진행' },
  { id: '5', label: '진행' },
  { id: '6', label: '진행' },
  { id: '7', label: '진행' },
  { id: '8', label: '진행' },
];

const menuTabs: TabItem[] = [
  { id: '1', label: '회원 정보 관리' },
  { id: '2', label: '신청 내역' },
];

// Interactive wrapper for stories
const InteractiveTab = (props: Omit<React.ComponentProps<typeof Tab>, 'activeId' | 'onChange'> & { defaultActiveId?: string }) => {
  const { defaultActiveId = '1', ...rest } = props;
  const [activeId, setActiveId] = useState(defaultActiveId);
  return <Tab {...rest} activeId={activeId} onChange={setActiveId} />;
};

// Default
export const Default: Story = {
  render: () => <InteractiveTab items={defaultTabs} style="box" size="medium" />,
};

// ========================================
// Fill Style
// ========================================
export const FillStyle2Tabs: Story = {
  name: 'Fill Style - 2 Tabs',
  render: () => <InteractiveTab items={twoTabs} style="fill" />,
};

export const FillStyle3Tabs: Story = {
  name: 'Fill Style - 3 Tabs',
  render: () => <InteractiveTab items={threeTabs} style="fill" defaultActiveId="2" />,
};

export const FillStyle7Tabs: Story = {
  name: 'Fill Style - 7 Tabs',
  render: () => <InteractiveTab items={sevenTabs} style="fill" defaultActiveId="2" />,
};

// ========================================
// Box Style
// ========================================
export const BoxStyleSmall: Story = {
  name: 'Box Style - Small (17pt)',
  render: () => <InteractiveTab items={manyTabs} style="box" size="small" />,
};

export const BoxStyleMedium: Story = {
  name: 'Box Style - Medium (19pt)',
  render: () => <InteractiveTab items={manyTabs} style="box" size="medium" />,
};

export const BoxStyleLarge: Story = {
  name: 'Box Style - Large (24pt)',
  render: () => <InteractiveTab items={manyTabs} style="box" size="large" />,
};

// ========================================
// Line Style (with active dot)
// ========================================
export const LineStyleSmall: Story = {
  name: 'Line Style - Small',
  render: () => <InteractiveTab items={manyTabs} style="line" size="small" />,
};

export const LineStyleMedium: Story = {
  name: 'Line Style - Medium',
  render: () => <InteractiveTab items={manyTabs} style="line" size="medium" />,
};

export const LineStyleLarge: Story = {
  name: 'Line Style - Large',
  render: () => <InteractiveTab items={manyTabs} style="line" size="large" />,
};

// ========================================
// Menu Style (세로 리스트 + 화살표)
// ========================================
export const MenuStyle: Story = {
  name: 'Menu Style',
  render: () => (
    <div style={{ maxWidth: '300px' }}>
      <InteractiveTab items={menuTabs} style="menu" />
    </div>
  ),
};

// ========================================
// Full Width
// ========================================
export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <InteractiveTab items={threeTabs} style="fill" fullWidth />
    </div>
  ),
};

export const FullWidthBox: Story = {
  name: 'Full Width - Box Style',
  render: () => (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <InteractiveTab items={defaultTabs} style="box" size="medium" fullWidth />
    </div>
  ),
};

// ========================================
// Showcase (All Variants - Figma 레이아웃)
// ========================================
const sizes: TabSize[] = ['small', 'medium', 'large'];

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      {/* Fill Style */}
      <div>
        <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '14px' }}>Fill Style</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div>
              <span style={{ color: '#8E8E8E', fontSize: '12px', marginBottom: '8px', display: 'block' }}>2 Tabs</span>
              <InteractiveTab items={twoTabs} style="fill" />
            </div>
            <div>
              <span style={{ color: '#8E8E8E', fontSize: '12px', marginBottom: '8px', display: 'block' }}>2 Tabs (2nd active)</span>
              <InteractiveTab items={twoTabs} style="fill" defaultActiveId="2" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div>
              <span style={{ color: '#8E8E8E', fontSize: '12px', marginBottom: '8px', display: 'block' }}>3 Tabs</span>
              <InteractiveTab items={threeTabs} style="fill" defaultActiveId="2" />
            </div>
          </div>
          <div>
            <span style={{ color: '#8E8E8E', fontSize: '12px', marginBottom: '8px', display: 'block' }}>7 Tabs</span>
            <InteractiveTab items={sevenTabs} style="fill" defaultActiveId="2" />
          </div>
        </div>
      </div>

      {/* Box Style */}
      <div>
        <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '14px' }}>Box Style</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sizes.map((size) => (
            <div key={`box-${size}`}>
              <span style={{ color: '#8E8E8E', fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                {size === 'small' ? 'Small (17pt)' : size === 'medium' ? 'Medium (19pt)' : 'Large (24pt)'}
              </span>
              <InteractiveTab items={manyTabs} style="box" size={size} />
            </div>
          ))}
        </div>
      </div>

      {/* Line Style */}
      <div>
        <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '14px' }}>Line Style</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sizes.map((size) => (
            <div key={`line-${size}`}>
              <span style={{ color: '#8E8E8E', fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                {size === 'small' ? 'Small' : size === 'medium' ? 'Medium' : 'Large'}
              </span>
              <InteractiveTab items={manyTabs} style="line" size={size} />
            </div>
          ))}
        </div>
      </div>

      {/* Menu Style */}
      <div>
        <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '14px' }}>Menu Style</h3>
        <div style={{ maxWidth: '300px' }}>
          <InteractiveTab items={menuTabs} style="menu" />
        </div>
      </div>
    </div>
  ),
};

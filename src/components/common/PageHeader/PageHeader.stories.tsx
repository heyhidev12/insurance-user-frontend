import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import PageHeader from './index';

const meta: Meta<typeof PageHeader> = {
  title: 'Design System/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['web', 'mobile'],
      description: '페이지 헤더 크기 (웹/모바일)',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#151515', padding: '40px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

const sampleTabs = [
  { id: 'intro', label: '소개' },
  { id: 'history', label: '연혁' },
  { id: 'awards', label: '수상/인증' },
  { id: 'ci', label: 'CI가이드' },
  { id: 'branch', label: '본점 지점 안내' },
  { id: 'clients', label: '주요 고객' },
];

const sampleBreadcrumbs = [
  { label: '구성원' },
];

// ========================================
// Web 버전
// ========================================
export const Web: Story = {
  args: {
    title: '함께 소개',
    breadcrumbs: sampleBreadcrumbs,
    tabs: sampleTabs,
    activeTabId: 'intro',
    size: 'web',
  },
};

// ========================================
// Mobile 버전
// ========================================
export const Mobile: Story = {
  args: {
    title: '함께 소개',
    breadcrumbs: sampleBreadcrumbs,
    tabs: sampleTabs,
    activeTabId: 'intro',
    size: 'mobile',
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
// 탭 없는 버전
// ========================================
export const WithoutTabs: Story = {
  name: 'Without Tabs',
  args: {
    title: '함께 소개',
    breadcrumbs: sampleBreadcrumbs,
    size: 'web',
  },
};

// ========================================
// 브레드크럼 없는 버전
// ========================================
export const WithoutBreadcrumbs: Story = {
  name: 'Without Breadcrumbs',
  args: {
    title: '함께 소개',
    tabs: sampleTabs,
    activeTabId: 'intro',
    size: 'web',
  },
};

// ========================================
// Interactive (탭 클릭 가능)
// ========================================
const InteractiveWrapper = () => {
  const [activeTab, setActiveTab] = useState('intro');

  return (
    <PageHeader
      title="함께 소개"
      breadcrumbs={sampleBreadcrumbs}
      tabs={sampleTabs}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      size="web"
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveWrapper />,
};

// ========================================
// Showcase
// ========================================
export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
      {/* Web 버전 */}
      <div>
        <h3 style={{ color: '#fff', marginBottom: '24px', fontSize: '16px' }}>Web</h3>
        <PageHeader
          title="함께 소개"
          breadcrumbs={sampleBreadcrumbs}
          tabs={sampleTabs}
          activeTabId="intro"
          size="web"
        />
      </div>

      {/* Mobile 버전 */}
      <div>
        <h3 style={{ color: '#fff', marginBottom: '24px', fontSize: '16px' }}>Mobile</h3>
        <div style={{ maxWidth: '375px' }}>
          <PageHeader
            title="함께 소개"
            breadcrumbs={sampleBreadcrumbs}
            tabs={sampleTabs}
            activeTabId="intro"
            size="mobile"
          />
        </div>
      </div>
    </div>
  ),
};

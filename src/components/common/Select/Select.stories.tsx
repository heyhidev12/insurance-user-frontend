import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Select from './index';

const meta: Meta<typeof Select> = {
  title: 'Design System/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder 텍스트',
    },
    label: {
      control: 'text',
      description: '라벨 텍스트',
    },
    required: {
      control: 'boolean',
      description: '필수 입력 표시',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화',
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
    },
    fullWidth: {
      control: 'boolean',
      description: '너비 100%',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const carrierOptions = [
  { value: 'skt', label: 'SKT' },
  { value: 'kt', label: 'KT' },
  { value: 'lgu', label: 'LG U+' },
  { value: 'budget', label: '알뜰폰' },
];

const domainOptions = [
  { value: 'naver.com', label: 'naver.com' },
  { value: 'google.com', label: 'google.com' },
  { value: 'daum.net', label: 'daum.net' },
  { value: 'nate.com', label: 'nate.com' },
  { value: 'direct', label: '직접 입력' },
];

// ==================== Default ====================

export const Default: Story = {
  args: {
    options: carrierOptions,
    placeholder: '통신사 선택',
    fullWidth: true,
  },
};

// ==================== With Label ====================

export const WithLabel: Story = {
  args: {
    options: carrierOptions,
    placeholder: '통신사 선택',
    label: '통신사',
    required: true,
    fullWidth: true,
  },
};

// ==================== With Selected Value ====================

export const WithSelectedValue: Story = {
  args: {
    options: carrierOptions,
    value: 'skt',
    label: '통신사',
    fullWidth: true,
  },
};

// ==================== Disabled ====================

export const Disabled: Story = {
  args: {
    options: carrierOptions,
    placeholder: '통신사 선택',
    label: '통신사',
    disabled: true,
    fullWidth: true,
  },
};

// ==================== Error State ====================

export const ErrorState: Story = {
  args: {
    options: carrierOptions,
    placeholder: '통신사 선택',
    label: '통신사',
    required: true,
    error: true,
    errorMessage: '통신사를 선택해주세요.',
    fullWidth: true,
  },
};

// ==================== Email Domain ====================

export const EmailDomain: Story = {
  args: {
    options: domainOptions,
    placeholder: '직접 입력',
    fullWidth: true,
  },
};

// ==================== Interactive ====================

const InteractiveWrapper = () => {
  const [value, setValue] = useState('');

  return (
    <div style={{ maxWidth: '300px' }}>
      <Select
        options={carrierOptions}
        value={value}
        onChange={setValue}
        placeholder="통신사 선택"
        label="통신사"
        required
        fullWidth
      />
      <p style={{ color: '#8E8E8E', marginTop: '16px', fontSize: '14px' }}>
        선택된 값: {value || '없음'}
      </p>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveWrapper />,
};

// ==================== Showcase ====================

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '300px' }}>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Default</p>
        <Select options={carrierOptions} placeholder="통신사 선택" fullWidth />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>With Label</p>
        <Select options={carrierOptions} placeholder="통신사 선택" label="통신사" required fullWidth />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Selected</p>
        <Select options={carrierOptions} value="kt" label="통신사" fullWidth />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Disabled</p>
        <Select options={carrierOptions} placeholder="통신사 선택" label="통신사" disabled fullWidth />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Error</p>
        <Select
          options={carrierOptions}
          placeholder="통신사 선택"
          label="통신사"
          required
          error
          errorMessage="통신사를 선택해주세요."
          fullWidth
        />
      </div>
    </div>
  ),
};

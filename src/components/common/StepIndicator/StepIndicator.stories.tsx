import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import StepIndicator from './index';

const meta: Meta<typeof StepIndicator> = {
  title: 'Design System/StepIndicator',
  component: StepIndicator,
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 1, max: 5 },
      description: '현재 스텝 (1부터 시작)',
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
type Story = StoryObj<typeof StepIndicator>;

const signupSteps = [
  { number: 'STEP 01', label: '약관동의' },
  { number: 'STEP 02', label: '정보입력' },
  { number: 'STEP 03', label: '가입완료' },
];

// ==================== Step 1 ====================

export const Step1: Story = {
  args: {
    steps: signupSteps,
    currentStep: 1,
  },
};

// ==================== Step 2 ====================

export const Step2: Story = {
  args: {
    steps: signupSteps,
    currentStep: 2,
  },
};

// ==================== Step 3 ====================

export const Step3: Story = {
  args: {
    steps: signupSteps,
    currentStep: 3,
  },
};

// ==================== 4 Steps ====================

const fourSteps = [
  { number: 'STEP 01', label: '약관동의' },
  { number: 'STEP 02', label: '본인인증' },
  { number: 'STEP 03', label: '정보입력' },
  { number: 'STEP 04', label: '가입완료' },
];

export const FourSteps: Story = {
  args: {
    steps: fourSteps,
    currentStep: 2,
  },
};

// ==================== Showcase ====================

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '16px', fontSize: '14px' }}>Step 1 - Active</p>
        <StepIndicator steps={signupSteps} currentStep={1} />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '16px', fontSize: '14px' }}>Step 2 - Active (Step 1 Completed)</p>
        <StepIndicator steps={signupSteps} currentStep={2} />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '16px', fontSize: '14px' }}>Step 3 - Active (All Previous Completed)</p>
        <StepIndicator steps={signupSteps} currentStep={3} />
      </div>
    </div>
  ),
};

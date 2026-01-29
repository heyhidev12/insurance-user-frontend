import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Card from './index';

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['column', 'column2', 'column3', 'education', 'youtube', 'horizontal', 'profile', 'testimonial'],
      description: '카드 타입',
    },
    size: {
      control: 'select',
      options: ['web', 'mobile'],
      description: '카드 크기 (웹/모바일)',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#151515', minHeight: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

const sampleImage = 'https://picsum.photos/460/280';
const profileImage = 'https://picsum.photos/342/433';

// ========================================
// Column (기본)
// ========================================
export const Column: Story = {
  args: {
    title: '[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법일까? 세무법인 함께와 Req 파악하고, 접근하기',
    date: '2026.01.28',
    imageUrl: sampleImage,
    variant: 'column',
    size: 'web',
  },
  render: (args) => (
    <div style={{ maxWidth: '460px' }}>
      <Card {...args} />
    </div>
  ),
};

export const ColumnMobile: Story = {
  name: 'Column - Mobile',
  args: {
    title: '[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법일까?',
    date: '2026.01.28',
    imageUrl: sampleImage,
    variant: 'column',
    size: 'mobile',
  },
  render: (args) => (
    <div style={{ maxWidth: '260px' }}>
      <Card {...args} />
    </div>
  ),
};

// ========================================
// Column2 (카테고리 포함)
// ========================================
export const Column2: Story = {
  args: {
    title: '[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법일까? 세무법인 함께와 Req 파악하고, 접근하기',
    category: '카테고리명',
    author: '작성자명',
    date: '2026.01.28',
    imageUrl: sampleImage,
    variant: 'column2',
    size: 'web',
  },
  render: (args) => (
    <div style={{ maxWidth: '460px' }}>
      <Card {...args} />
    </div>
  ),
};

export const Column2Mobile: Story = {
  name: 'Column2 - Mobile',
  args: {
    title: '[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법일까?',
    category: '카테고리명',
    author: '작성자명',
    date: '2026.01.28',
    imageUrl: sampleImage,
    variant: 'column2',
    size: 'mobile',
  },
  render: (args) => (
    <div style={{ maxWidth: '260px' }}>
      <Card {...args} />
    </div>
  ),
};

// ========================================
// Column3 (설명 포함)
// ========================================
export const Column3: Story = {
  args: {
    title: '[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법일까? 세무법인 함께와 Req 파악하고, 접근하기',
    category: '카테고리명',
    description: '주요 경제 일간지에 당사의 전문 인력과 고객 맞춤형 세무 서비스가 소개되었습니다. 보도 기사에서는 세무 법인의 체계적...',
    author: '작성자명',
    date: '2026.01.28',
    imageUrl: sampleImage,
    variant: 'column3',
    size: 'web',
  },
  render: (args) => (
    <div style={{ maxWidth: '460px' }}>
      <Card {...args} />
    </div>
  ),
};

// ========================================
// Education (교육 카드)
// ========================================
export const Education: Story = {
  args: {
    title: '[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법일까? 세무법인 함께와 Req 파악하고, 접근하기',
    labels: [
      { text: '신청마감 D-12', color: 'red' },
      { text: '라벨', color: 'white' },
    ],
    location: '서울',
    schedule: '교육일정 : 26.06.13 ~ 04.13',
    imageUrl: sampleImage,
    variant: 'education',
    size: 'web',
  },
  render: (args) => (
    <div style={{ maxWidth: '460px' }}>
      <Card {...args} />
    </div>
  ),
};

export const EducationMobile: Story = {
  name: 'Education - Mobile',
  args: {
    title: '[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법하기',
    labels: [
      { text: '신청마감 D-12', color: 'red' },
      { text: '라벨', color: 'white' },
    ],
    location: '서울',
    schedule: '교육일정 : 26.06.13 ~ 04.13',
    imageUrl: sampleImage,
    variant: 'education',
    size: 'mobile',
  },
  render: (args) => (
    <div style={{ maxWidth: '274px' }}>
      <Card {...args} />
    </div>
  ),
};

export const EducationClosed: Story = {
  name: 'Education - 마감',
  args: {
    title: '[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법일까? 세무법인 함께와 Req 파악하고, 접근하기',
    labels: [
      { text: '신청마감', color: 'gray' },
      { text: '라벨', color: 'white' },
    ],
    location: '서울',
    schedule: '교육일정 : 26.06.13 ~ 04.13',
    imageUrl: sampleImage,
    variant: 'education',
    size: 'web',
  },
  render: (args) => (
    <div style={{ maxWidth: '460px' }}>
      <Card {...args} />
    </div>
  ),
};

// ========================================
// YouTube
// ========================================
export const YouTube: Story = {
  args: {
    title: '[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법일까? 세무법인 함께와 Req 파악하고, 접근하기',
    date: '2026.01.28',
    imageUrl: sampleImage,
    variant: 'youtube',
    size: 'web',
  },
  render: (args) => (
    <div style={{ maxWidth: '460px' }}>
      <Card {...args} />
    </div>
  ),
};

// ========================================
// Horizontal (가로형)
// ========================================
export const Horizontal: Story = {
  args: {
    title: '세무법인 함께, 2026 상반기 세무 세미나 개최',
    category: '카테고리명',
    description: '본 세무법인 함께는 고객사와 함께 최신 세법 개정 내용을 공유하는 세미나를 개최했습니다. 이번 행사에서는 법인세 신고 전략과 절세 방안이 소개되었으며, 참석자들에게 맞춤형 상담 기회도 제공되었습니다.',
    author: '작성자명',
    date: '2023.11.08',
    imageUrl: sampleImage,
    variant: 'horizontal',
    size: 'web',
  },
  render: (args) => (
    <div style={{ maxWidth: '1000px' }}>
      <Card {...args} />
    </div>
  ),
};

export const HorizontalMobile: Story = {
  name: 'Horizontal - Mobile',
  args: {
    title: '세무법인 함께, 2026 상반기 세무 세미나 개최',
    category: '카테고리명',
    description: '본 세무법인 함께는 고객사와 함께 최신 세법 개정 내용을 공유하는 세미나를 개최했습니다.',
    author: '작성자명',
    date: '2023.11.08',
    imageUrl: sampleImage,
    variant: 'horizontal',
    size: 'mobile',
  },
  render: (args) => (
    <div style={{ maxWidth: '375px' }}>
      <Card {...args} />
    </div>
  ),
};

// ========================================
// Profile (프로필 카드)
// ========================================
export const Profile: Story = {
  args: {
    title: '홍길동',
    position: '세무사',
    tel: '031-425-4259',
    email: 'name@together.tax',
    tags: [
      { label: '제조', level: '■■■' },
      { label: '증여', level: '■■□' },
      { label: '미용업기장', level: '■□□' },
    ],
    imageUrl: profileImage,
    variant: 'profile',
    size: 'web',
  },
  render: (args) => (
    <div style={{ maxWidth: '342px' }}>
      <Card {...args} />
    </div>
  ),
};

export const ProfileMobile: Story = {
  name: 'Profile - Mobile',
  args: {
    title: '홍길동',
    position: '세무사',
    tel: '031-425-4259',
    email: 'name@together.tax',
    tags: [
      { label: '제조', level: '■■■' },
      { label: '증여', level: '■■□' },
      { label: '미용업기장', level: '■□□' },
    ],
    imageUrl: profileImage,
    variant: 'profile',
    size: 'mobile',
  },
  render: (args) => (
    <div style={{ maxWidth: '197px' }}>
      <Card {...args} />
    </div>
  ),
};

// ========================================
// Testimonial (인용 프로필 카드)
// ========================================
export const Testimonial: Story = {
  args: {
    title: '박준서',
    position: '세무사',
    quote: '창업 초기부터 성장 단계까지,\n든든한 파트너가 되겠습니다.',
    imageUrl: profileImage,
    variant: 'testimonial',
    size: 'web',
  },
};

export const TestimonialMobile: Story = {
  name: 'Testimonial - Mobile',
  args: {
    title: '박준서',
    position: '세무사',
    quote: '창업 초기부터 성장 단계까지,\n든든한 파트너가 되겠습니다.',
    imageUrl: profileImage,
    variant: 'testimonial',
    size: 'mobile',
  },
};

// ========================================
// Showcase (All Variants)
// ========================================
export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
      {/* Column 비교 */}
      <div>
        <h3 style={{ color: '#fff', marginBottom: '24px', fontSize: '16px' }}>Column / Column2 / Column3</h3>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ width: '406px' }}>
            <p style={{ color: '#8E8E8E', fontSize: '12px', marginBottom: '8px' }}>Column (기본)</p>
            <Card
              title="[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법일까?"
              date="2026.01.28"
              imageUrl={sampleImage}
              variant="column"
              size="web"
            />
          </div>
          <div style={{ width: '406px' }}>
            <p style={{ color: '#8E8E8E', fontSize: '12px', marginBottom: '8px' }}>Column2 (카테고리)</p>
            <Card
              title="[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법일까?"
              category="카테고리명"
              author="작성자명"
              date="2026.01.28"
              imageUrl={sampleImage}
              variant="column2"
              size="web"
            />
          </div>
          <div style={{ width: '406px' }}>
            <p style={{ color: '#8E8E8E', fontSize: '12px', marginBottom: '8px' }}>Column3 (설명)</p>
            <Card
              title="[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법일까?"
              category="카테고리명"
              description="주요 경제 일간지에 당사의 전문 인력과 고객 맞춤형 세무 서비스가 소개되었습니다."
              author="작성자명"
              date="2026.01.28"
              imageUrl={sampleImage}
              variant="column3"
              size="web"
            />
          </div>
        </div>
      </div>

      {/* Education */}
      <div>
        <h3 style={{ color: '#fff', marginBottom: '24px', fontSize: '16px' }}>Education (교육 카드)</h3>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ width: '458px' }}>
            <p style={{ color: '#8E8E8E', fontSize: '12px', marginBottom: '8px' }}>Web</p>
            <Card
              title="[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법일까?"
              labels={[
                { text: '신청마감 D-12', color: 'red' },
                { text: '라벨', color: 'white' },
              ]}
              location="서울"
              schedule="교육일정 : 26.06.13 ~ 04.13"
              imageUrl={sampleImage}
              variant="education"
              size="web"
            />
          </div>
          <div style={{ width: '274px' }}>
            <p style={{ color: '#8E8E8E', fontSize: '12px', marginBottom: '8px' }}>Mobile</p>
            <Card
              title="[세무조사] 세무조사 어떻게 접근해야지 성공하는 방법하기"
              labels={[
                { text: '신청마감 D-12', color: 'red' },
                { text: '라벨', color: 'white' },
              ]}
              location="서울"
              schedule="교육일정 : 26.06.13 ~ 04.13"
              imageUrl={sampleImage}
              variant="education"
              size="mobile"
            />
          </div>
        </div>
      </div>

      {/* Profile */}
      <div>
        <h3 style={{ color: '#fff', marginBottom: '24px', fontSize: '16px' }}>Profile (프로필 카드)</h3>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ width: '342px' }}>
            <p style={{ color: '#8E8E8E', fontSize: '12px', marginBottom: '8px' }}>Web</p>
            <Card
              title="홍길동"
              position="세무사"
              tel="031-425-4259"
              email="name@together.tax"
              tags={[
                { label: '제조', level: '■■■' },
                { label: '증여', level: '■■□' },
                { label: '미용업기장', level: '■□□' },
              ]}
              imageUrl={profileImage}
              variant="profile"
              size="web"
            />
          </div>
          <div style={{ width: '197px' }}>
            <p style={{ color: '#8E8E8E', fontSize: '12px', marginBottom: '8px' }}>Mobile</p>
            <Card
              title="홍길동"
              position="세무사"
              tel="031-425-4259"
              email="name@together.tax"
              tags={[
                { label: '제조', level: '■■■' },
                { label: '증여', level: '■■□' },
              ]}
              imageUrl={profileImage}
              variant="profile"
              size="mobile"
            />
          </div>
        </div>
      </div>

      {/* Horizontal */}
      <div>
        <h3 style={{ color: '#fff', marginBottom: '24px', fontSize: '16px' }}>Horizontal (가로형)</h3>
        <div style={{ maxWidth: '1000px' }}>
          <Card
            title="세무법인 함께, 2026 상반기 세무 세미나 개최"
            category="카테고리명"
            description="본 세무법인 함께는 고객사와 함께 최신 세법 개정 내용을 공유하는 세미나를 개최했습니다. 이번 행사에서는 법인세 신고 전략과 절세 방안이 소개되었으며, 참석자들에게 맞춤형 상담 기회도 제공되었습니다."
            author="작성자명"
            date="2023.11.08"
            imageUrl={sampleImage}
            variant="horizontal"
            size="web"
          />
        </div>
      </div>
    </div>
  ),
};

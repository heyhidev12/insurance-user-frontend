import type { Meta, StoryObj } from '@storybook/react';
import { TextField, SearchField } from './index';

const meta: Meta<typeof TextField> = {
  title: 'Design System/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['line', 'fill'],
      description: '텍스트필드 스타일',
    },
    label: {
      control: 'text',
      description: '라벨 텍스트',
    },
    placeholder: {
      control: 'text',
      description: 'placeholder 텍스트',
    },
    value: {
      control: 'text',
      description: '입력 값',
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
    },
    readOnly: {
      control: 'boolean',
      description: '읽기 전용',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel'],
      description: 'input type',
    },
    fullWidth: {
      control: 'boolean',
      description: '너비 100%',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

// ==================== Basic TextField ====================

export const Default: Story = {
  args: {
    variant: 'line',
    placeholder: '영문자 이메일 조합',
  },
};

export const WithLabel: Story = {
  args: {
    variant: 'line',
    label: '이메일',
    placeholder: '영문자 이메일 조합',
  },
};

export const FilledValue: Story = {
  args: {
    variant: 'line',
    label: '이메일',
    placeholder: '영문자 이메일 조합',
    value: 'example@email.com',
  },
};

export const ErrorState: Story = {
  args: {
    variant: 'line',
    label: '이메일',
    placeholder: '영문자 이메일 조합',
    value: 'invalid-email',
    error: true,
  },
};

export const ReadOnly: Story = {
  args: {
    variant: 'line',
    label: '이메일',
    placeholder: '영문자 이메일 조합',
    value: 'readonly@email.com',
    readOnly: true,
  },
};

// ==================== Line Variant States ====================

export const LineVariantStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '300px' }}>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Default</p>
        <TextField variant="line" placeholder="영문자 이메일 조합" />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Focus (click to see)</p>
        <TextField variant="line" placeholder="영문자 이메일 조합" />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Filled</p>
        <TextField variant="line" placeholder="영문자 이메일 조합" value="example@email.com" />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Error</p>
        <TextField variant="line" placeholder="영문자 이메일 조합" value="invalid" error />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Read Only</p>
        <TextField variant="line" placeholder="영문자 이메일 조합" value="readonly@email.com" readOnly />
      </div>
    </div>
  ),
};

// ==================== Fill Variant States ====================

export const FillVariantStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '300px' }}>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Default</p>
        <TextField variant="fill" placeholder="영문자 이메일 조합" />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Focus (click to see)</p>
        <TextField variant="fill" placeholder="영문자 이메일 조합" />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Filled</p>
        <TextField variant="fill" placeholder="영문자 이메일 조합" value="example@email.com" />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Error</p>
        <TextField variant="fill" placeholder="영문자 이메일 조합" value="invalid" error />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Read Only</p>
        <TextField variant="fill" placeholder="영문자 이메일 조합" value="readonly@email.com" readOnly />
      </div>
    </div>
  ),
};

// ==================== With Label Showcase ====================

export const WithLabelShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '400px' }}>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Default</p>
        <TextField variant="line" label="이메일" placeholder="영문자 이메일 조합" />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Filled</p>
        <TextField variant="line" label="이메일" placeholder="영문자 이메일 조합" value="example@email.com" />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Error</p>
        <TextField variant="line" label="이메일" placeholder="영문자 이메일 조합" value="invalid" error />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Read Only</p>
        <TextField variant="line" label="이메일" placeholder="영문자 이메일 조합" value="readonly" readOnly />
      </div>
    </div>
  ),
};

// ==================== SearchField ====================

const searchMeta: Meta<typeof SearchField> = {
  title: 'Design System/SearchField',
  component: SearchField,
  tags: ['autodocs'],
};

export const SearchDefault: StoryObj<typeof SearchField> = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <SearchField placeholder="검색해보세요" />
    </div>
  ),
};

export const SearchWithValue: StoryObj<typeof SearchField> = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <SearchField placeholder="검색해보세요" value="검색어" />
    </div>
  ),
};

export const SearchFieldStates: StoryObj<typeof SearchField> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '400px' }}>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Default</p>
        <SearchField placeholder="검색해보세요" />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Focus (click to see)</p>
        <SearchField placeholder="검색해보세요" />
      </div>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '8px', fontSize: '12px' }}>Filled</p>
        <SearchField placeholder="검색해보세요" value="검색어 입력됨" />
      </div>
    </div>
  ),
};

// ==================== New Features ====================

export const WithRightButton: Story = {
  args: {
    variant: 'line',
    label: '휴대폰 번호',
    placeholder: '휴대폰 번호를 입력해주세요',
    rightButton: {
      label: '인증 요청',
      onClick: () => alert('인증 요청!'),
    },
    fullWidth: true,
  },
};

export const WithTimer: Story = {
  args: {
    variant: 'line',
    label: '인증번호',
    placeholder: '인증번호를 입력해주세요',
    timer: 180,
    maxLength: 6,
    fullWidth: true,
  },
};

export const PasswordWithToggle: Story = {
  args: {
    variant: 'line',
    label: '비밀번호',
    placeholder: '비밀번호를 입력해주세요',
    type: 'password',
    showPasswordToggle: true,
    fullWidth: true,
  },
};

export const WithRequired: Story = {
  args: {
    variant: 'line',
    label: '이름',
    placeholder: '이름을 입력해주세요',
    required: true,
    fullWidth: true,
  },
};

export const WithErrorMessage: Story = {
  args: {
    variant: 'line',
    label: '이메일',
    placeholder: '이메일을 입력해주세요',
    value: 'invalid-email',
    error: true,
    errorMessage: '올바른 이메일 형식이 아닙니다.',
    fullWidth: true,
  },
};

export const WithSuccessMessage: Story = {
  args: {
    variant: 'line',
    label: '아이디',
    placeholder: '아이디를 입력해주세요',
    value: 'available_id',
    successMessage: '사용 가능한 아이디입니다.',
    fullWidth: true,
  },
};

// ==================== Auth Form Example ====================

export const AuthFormExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      <h3 style={{ color: '#F0F0F0', marginBottom: '8px', fontSize: '16px', fontWeight: 600 }}>
        인증 폼 예시
      </h3>
      <TextField
        variant="line"
        label="아이디"
        placeholder="아이디를 입력해주세요"
        required
        rightButton={{
          label: '중복 확인',
          onClick: () => alert('중복 확인!'),
        }}
        fullWidth
      />
      <TextField
        variant="line"
        label="이름"
        placeholder="이름을 입력해주세요"
        required
        fullWidth
      />
      <TextField
        variant="line"
        label="휴대폰 번호"
        placeholder="휴대폰 번호를 입력해주세요"
        type="tel"
        required
        rightButton={{
          label: '인증 요청',
          onClick: () => alert('인증 요청!'),
        }}
        fullWidth
      />
      <TextField
        variant="line"
        label="인증번호"
        placeholder="인증번호를 입력해주세요"
        timer={180}
        maxLength={6}
        fullWidth
      />
      <TextField
        variant="line"
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        type="password"
        showPasswordToggle
        required
        fullWidth
      />
      <TextField
        variant="line"
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력해주세요"
        type="password"
        showPasswordToggle
        required
        fullWidth
      />
    </div>
  ),
};

// ==================== Comparison ====================

export const AllVariantsComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '48px' }}>
      <div style={{ flex: 1, maxWidth: '300px' }}>
        <h3 style={{ color: '#F0F0F0', marginBottom: '24px', fontSize: '16px', fontWeight: 600 }}>
          Line Variant
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <TextField variant="line" placeholder="영문자 이메일 조합" />
          <TextField variant="line" placeholder="영문자 이메일 조합" value="filled@email.com" />
          <TextField variant="line" placeholder="영문자 이메일 조합" value="error" error />
          <TextField variant="line" placeholder="영문자 이메일 조합" value="readonly" readOnly />
        </div>
      </div>
      <div style={{ flex: 1, maxWidth: '300px' }}>
        <h3 style={{ color: '#F0F0F0', marginBottom: '24px', fontSize: '16px', fontWeight: 600 }}>
          Fill Variant
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <TextField variant="fill" placeholder="영문자 이메일 조합" />
          <TextField variant="fill" placeholder="영문자 이메일 조합" value="filled@email.com" />
          <TextField variant="fill" placeholder="영문자 이메일 조합" value="error" error />
          <TextField variant="fill" placeholder="영문자 이메일 조합" value="readonly" readOnly />
        </div>
      </div>
      <div style={{ flex: 1, maxWidth: '300px' }}>
        <h3 style={{ color: '#F0F0F0', marginBottom: '24px', fontSize: '16px', fontWeight: 600 }}>
          Search Field
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <SearchField placeholder="검색해보세요" />
          <SearchField placeholder="검색해보세요" value="검색어" />
        </div>
      </div>
    </div>
  ),
};

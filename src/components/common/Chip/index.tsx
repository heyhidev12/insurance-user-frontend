import React from 'react';
import './styles.scss';

export type ChipVariant = 'square' | 'round';
export type ChipSize = '48' | '44' | '40' | '38';
export type ChipLayout = 'horizontal' | 'vertical'; // horizontal: 라벨-체크박스 같은 줄, vertical: 라벨 위 체크박스 아래

export interface ChipProps {
  /** 칩 변형 */
  variant?: ChipVariant;
  /** 칩 크기 */
  size?: ChipSize;
  /** 체크 상태 */
  checked?: boolean;
  /** 라벨 텍스트 */
  label?: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 변경 핸들러 */
  onChange?: (checked: boolean) => void;
  /** 화살표 표시 (링크 타입) */
  showArrow?: boolean;
  /** 레이아웃 방향 (horizontal: 라벨-체크박스 같은 줄, vertical: 라벨 위 체크박스 아래) */
  layout?: ChipLayout;
  /** 클래스명 */
  className?: string;
}

// Check Icon SVG (12x12)
const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="chip__check-icon"
  >
    <path
      d="M2.80078 5.99992L5.70604 8.79992L9.60078 2.79992"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Arrow Icon SVG
const ArrowIcon = () => (
  <svg
    width="12"
    height="10"
    viewBox="0 0 12 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="chip__arrow-icon"
  >
    <path
      d="M0.600117 4.85254L10.9951 4.85254"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.74262 0.600097L10.9951 4.8526L6.74262 9.1051"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Chip 컴포넌트
 * 채워진 배경의 체크박스 칩
 */
const Chip: React.FC<ChipProps> = ({
  variant = 'square',
  size = '48',
  checked = false,
  label = '한국어',
  disabled = false,
  onChange,
  showArrow = false,
  layout = 'horizontal',
  className = '',
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Arrow type chip (no checkbox) - always horizontal
  if (showArrow) {
    return (
      <div
        className={`chip chip--arrow chip--size-${size} ${checked ? 'chip--active' : ''} ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <span className="chip__label">{label}</span>
        <ArrowIcon />
      </div>
    );
  }

  // Determine layout based on size (Figma design: 40 and 48 use vertical, 38 and 44 use horizontal)
  // But allow override via layout prop
  const effectiveLayout = layout === 'horizontal' || (size === '38' || size === '44') ? 'horizontal' : 'vertical';

  return (
    <div
      className={`chip chip--${variant} chip--size-${size} chip--layout-${effectiveLayout} ${checked ? 'chip--checked' : ''} ${disabled ? 'chip--disabled' : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      <span className="chip__label">{label}</span>
      <div className={`chip__checkbox chip__checkbox--${variant} ${checked ? 'chip__checkbox--checked' : ''}`}>
        {checked && <CheckIcon />}
      </div>
    </div>
  );
};

export default Chip;

import React from 'react';
// styles는 _app.tsx에서 import됨

export type CheckboxVariant = 'square' | 'round';

export interface CheckboxProps {
  /** 체크박스 변형 */
  variant?: CheckboxVariant;
  /** 체크 상태 */
  checked?: boolean;
  /** 라벨 텍스트 */
  label?: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 변경 핸들러 */
  onChange?: (checked: boolean) => void;
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
    className="checkbox__icon"
  >
    <path
      d="M2.80078 5.99992L5.70604 8.79992L9.60078 2.79992"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Checkbox 컴포넌트
 * 라벨이 있는 체크박스
 */
const Checkbox: React.FC<CheckboxProps> = ({
  variant = 'square',
  checked = false,
  label,
  disabled = false,
  onChange,
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

  return (
    <div
      className={`checkbox checkbox--${variant} ${checked ? 'checkbox--checked' : ''} ${disabled ? 'checkbox--disabled' : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {/* 체크박스 박스는 항상 라벨 앞에 */}
      <div className={`checkbox__box ${checked ? 'checkbox__box--checked' : ''}`}>
        {checked && <CheckIcon />}
      </div>
      {label && <span className="checkbox__label">{label}</span>}
    </div>
  );
};

export default Checkbox;

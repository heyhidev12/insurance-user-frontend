import React, { useState, useRef, useEffect } from 'react';
// styles는 _app.tsx에서 import됨

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  /** 옵션 목록 */
  options: SelectOption[];
  /** 선택된 값 */
  value?: string;
  /** 값 변경 핸들러 */
  onChange?: (value: string) => void;
  /** placeholder */
  placeholder?: string;
  /** 라벨 */
  label?: string;
  /** 필수 입력 표시 */
  required?: boolean;
  /** 비활성화 */
  disabled?: boolean;
  /** 에러 상태 */
  error?: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 너비 100% */
  fullWidth?: boolean;
  /** 클래스명 */
  className?: string;
}

// 화살표 아이콘
const ArrowIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select__arrow ${isOpen ? 'select__arrow--open' : ''}`}
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '선택해주세요',
  label,
  required = false,
  disabled = false,
  error = false,
  errorMessage,
  fullWidth = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={selectRef}
      className={`select ${fullWidth ? 'select--full-width' : ''} ${disabled ? 'select--disabled' : ''} ${error ? 'select--error' : ''} ${className}`}
    >
      {label && (
        <div className="select__label-container">
          <label className="select__label">
            {label}
            {required && <span className="select__required">*</span>}
          </label>
        </div>
      )}
      <div
        className={`select__trigger ${isOpen ? 'select__trigger--open' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        <span className={`select__value ${!selectedOption ? 'select__value--placeholder' : ''}`}>
          {selectedOption?.label || placeholder}
        </span>
        <ArrowIcon isOpen={isOpen} />
      </div>
      {isOpen && (
        <div className="select__dropdown" role="listbox">
          {options.map((option) => (
            <div
              key={option.value}
              className={`select__option ${option.value === value ? 'select__option--selected' : ''}`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      {errorMessage && <p className="select__error-message">{errorMessage}</p>}
    </div>
  );
};

export default Select;

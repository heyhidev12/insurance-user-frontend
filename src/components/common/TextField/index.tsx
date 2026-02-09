import React, { useState, useRef, useEffect } from 'react';
// styles는 _app.tsx에서 import됨

export type TextFieldVariant = 'line' | 'fill';
export type TextFieldState = 'default' | 'focus' | 'filling' | 'filled' | 'error' | 'readonly';

export interface RightButtonConfig {
  /** 버튼 텍스트 */
  label: string;
  /** 클릭 핸들러 */
  onClick: () => void;
  /** 비활성화 */
  disabled?: boolean;
}

export interface TextFieldProps {
  /** 텍스트필드 스타일 변형 */
  variant?: TextFieldVariant;
  /** 라벨 텍스트 */
  label?: string;
  /** 필수 입력 표시 */
  required?: boolean;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 입력 값 */
  value?: string;
  /** 값 변경 핸들러 */
  onChange?: (value: string) => void;
  /** 에러 상태 */
  error?: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 성공 메시지 */
  successMessage?: string;
  /** 읽기 전용 */
  readOnly?: boolean;
  /** 비활성화 */
  disabled?: boolean;
  /** 클래스명 */
  className?: string;
  /** input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  /** 너비 100% */
  fullWidth?: boolean;
  /** 오른쪽 버튼 설정 */
  rightButton?: RightButtonConfig;
  /** 타이머 (초 단위, 0보다 크면 표시) */
  timer?: number;
  /** 비밀번호 표시/숨김 토글 활성화 */
  showPasswordToggle?: boolean;
  /** 최대 입력 길이 */
  maxLength?: number;
  /** Clear 버튼 표시 여부 (기본값: true) */
  showClear?: boolean;
}

export interface SearchFieldProps {
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 입력 값 */
  value?: string;
  /** 값 변경 핸들러 */
  onChange?: (value: string) => void;
  /** 검색 실행 핸들러 */
  onSearch?: (value: string) => void;
  /** 클래스명 */
  className?: string;
  /** 너비 100% */
  fullWidth?: boolean;
}

// Search Icon SVG
const SearchIcon = () => (
  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.89991 15.0002C11.8212 15.0002 15 11.8214 15 7.90014C15 3.97886 11.8212 0.800049 7.89991 0.800049C3.97863 0.800049 0.799805 3.97886 0.799805 7.90014C0.799805 11.8214 3.97863 15.0002 7.89991 15.0002Z" stroke="currentColor" strokeWidth="1.6" strokeMiterlimit="10"/>
    <path d="M18.2512 18.3442C18.5636 18.6567 19.0702 18.6567 19.3826 18.3442C19.695 18.0318 19.695 17.5253 19.3826 17.2129L18.8169 17.7786L18.2512 18.3442ZM13.1104 12.072L12.5447 12.6377L18.2512 18.3442L18.8169 17.7786L19.3826 17.2129L13.676 11.5063L13.1104 12.072Z" fill="currentColor"/>
  </svg>
);

// Circle Close Icon SVG
const CircleCloseIcon = ({ onClick }: { onClick?: () => void }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
    className="textfield__circle-close"
  >
    <circle cx="9" cy="9" r="9" fill="#555555"/>
    <path d="M6.41016 11.6902L11.6902 6.41016" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M6.40945 6.41016L11.6895 11.6902" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// Eye Icon (비밀번호 보이기)
const EyeIcon = ({ onClick }: { onClick?: () => void }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    style={{ cursor: 'pointer' }}
    className="textfield__eye-icon"
  >
    <path d="M10 4C5.45455 4 1.57273 6.90909 0 11C1.57273 15.0909 5.45455 18 10 18C14.5455 18 18.4273 15.0909 20 11C18.4273 6.90909 14.5455 4 10 4Z" stroke="#8E8E8E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="11" r="3" stroke="#8E8E8E" strokeWidth="1.5"/>
  </svg>
);

// Eye Off Icon (비밀번호 숨기기)
const EyeOffIcon = ({ onClick }: { onClick?: () => void }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    style={{ cursor: 'pointer' }}
    className="textfield__eye-icon"
  >
    <path d="M10 4C5.45455 4 1.57273 6.90909 0 11C1.57273 15.0909 5.45455 18 10 18C14.5455 18 18.4273 15.0909 20 11C18.4273 6.90909 14.5455 4 10 4Z" stroke="#8E8E8E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="11" r="3" stroke="#8E8E8E" strokeWidth="1.5"/>
    <path d="M3 18L17 4" stroke="#8E8E8E" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// 타이머 포맷 함수
const formatTimer = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Cursor Icon SVG
const CursorIcon = () => (
  <svg width="1" height="16" viewBox="0 0 1 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="textfield__cursor">
    <path d="M0.5 0V16" stroke="#94B9E3"/>
  </svg>
);

/**
 * TextField 컴포넌트
 * Line, Fill 스타일과 라벨 지원
 */
export function TextField({
  variant = 'line',
  label,
  required = false,
  placeholder = '입력해주세요',
  value = '',
  onChange,
  error = false,
  errorMessage,
  successMessage,
  readOnly = false,
  disabled = false,
  className = '',
  type = 'text',
  fullWidth = false,
  rightButton,
  timer,
  showPasswordToggle = false,
  maxLength,
  showClear = true,
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const [showPassword, setShowPassword] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // email, number 타입은 setSelectionRange를 지원하지 않음
  const supportsSelection = type !== 'email' && type !== 'number';

  useEffect(() => {
    if (value !== internalValue) {
      const input = inputRef.current;
      if (input && document.activeElement === input && supportsSelection) {
        // 포커스가 있을 때만 커서 위치 보존
        const cursorPosition = input.selectionStart || 0;
        setInternalValue(value);
        // 다음 렌더링 사이클에서 커서 위치 복원
        requestAnimationFrame(() => {
          if (inputRef.current && document.activeElement === inputRef.current && supportsSelection) {
            const newPosition = Math.min(cursorPosition, value.length);
            inputRef.current.setSelectionRange(newPosition, newPosition);
          }
        });
      } else {
        setInternalValue(value);
      }
    }
  }, [value, internalValue, supportsSelection]);

  const getState = (): TextFieldState => {
    if (readOnly) return 'readonly';
    if (error) return 'error';
    if (isFocused && internalValue) return 'filling';
    if (isFocused) return 'focus';
    if (internalValue) return 'filled';
    return 'default';
  };

  const state = getState();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const input = e.target;
    const currentCursorPosition = supportsSelection ? (input.selectionStart || 0) : newValue.length;

    setInternalValue(newValue);
    setCursorPosition(currentCursorPosition);
    onChange?.(newValue);

    // 커서 위치 보존 - 입력/삭제에 따라 위치 조정 (email, number 타입 제외)
    if (supportsSelection) {
      requestAnimationFrame(() => {
        if (inputRef.current && document.activeElement === inputRef.current) {
          // 값이 변경된 후 커서 위치 계산
          let newPosition = currentCursorPosition;
          if (newValue.length > internalValue.length) {
            // 텍스트가 추가된 경우
            newPosition = currentCursorPosition;
          } else if (newValue.length < internalValue.length) {
            // 텍스트가 삭제된 경우
            newPosition = Math.min(currentCursorPosition, newValue.length);
          }
          inputRef.current.setSelectionRange(newPosition, newPosition);
          setCursorPosition(newPosition);
        }
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Enter key for form submission
    if (e.key === 'Enter') {
      e.preventDefault();
      // Find the closest form and submit it
      const form = inputRef.current?.closest('form');
      if (form) {
        // Use requestSubmit for proper form validation and submission
        if (typeof form.requestSubmit === 'function') {
          form.requestSubmit();
        } else {
          // Fallback for older browsers
          const submitButton = form.querySelector('button[type="submit"], input[type="submit"]') as HTMLButtonElement | HTMLInputElement | null;
          if (submitButton && !submitButton.disabled) {
            submitButton.click();
          } else {
            // Last resort: dispatch submit event
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
        }
      }
      return;
    }
    
    if (!supportsSelection) return;
    requestAnimationFrame(() => {
      if (inputRef.current && document.activeElement === inputRef.current) {
        const pos = inputRef.current.selectionStart || 0;
        setCursorPosition(pos);
      }
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!supportsSelection) return;
    requestAnimationFrame(() => {
      if (inputRef.current && document.activeElement === inputRef.current) {
        const pos = inputRef.current.selectionStart || 0;
        setCursorPosition(pos);
      }
    });
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (!supportsSelection) return;
    requestAnimationFrame(() => {
      if (inputRef.current && document.activeElement === inputRef.current) {
        const pos = inputRef.current.selectionStart || 0;
        setCursorPosition(pos);
      }
    });
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 실제 input type 결정 (비밀번호 토글 시)
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // 비밀번호 마스킹 함수
  const maskPassword = (value: string): string => {
    if (type === 'password' && !showPassword) {
      return '•'.repeat(value.length);
    }
    return value;
  };

  const showClearButton = showClear && (state === 'filling' || state === 'filled') && internalValue && !readOnly && !disabled;
  // email, number 타입은 커스텀 커서 대신 기본 브라우저 커서 사용
  const showCursor = (state === 'focus' || state === 'filling') && supportsSelection;
  const hasRightButton = !!rightButton;
  const hasTimer = typeof timer === 'number' && timer > 0;
  const hasPasswordToggle = type === 'password' && showPasswordToggle;

  return (
    <div
      className={`textfield textfield--${variant} textfield--${state} ${fullWidth ? 'textfield--full-width' : ''} ${hasRightButton ? 'textfield--with-button' : ''} ${className}`}
    >
      {label && (
        <div className="textfield__label-container">
          <label className="textfield__label">
            {label}
            {required && <span className="textfield__required">*</span>}
          </label>
        </div>
      )}
      <div className="textfield__row">
        <div className="textfield__input-wrapper">
          <div className="textfield__container">
            <div className="textfield__input-area">
              {showCursor ? (
                <div className="textfield__text-with-cursor">
                  {(() => {
                    const isPlaceholder = !internalValue;
                    if (isPlaceholder) {
                      // placeholder일 때는 커서를 맨 앞에 표시
                      return (
                        <>
                          <CursorIcon />
                          <span className="textfield__display-text textfield__display-text--placeholder">
                            {placeholder}
                          </span>
                        </>
                      );
                    }
                    // 값이 있을 때 cursorPosition 사용
                    const displayText = maskPassword(internalValue);
                    const pos = Math.min(cursorPosition, displayText.length);
                    const beforeCursor = displayText.substring(0, pos);
                    const afterCursor = displayText.substring(pos);
                    return (
                      <>
                        <span className="textfield__display-text">
                          {beforeCursor}
                        </span>
                        <CursorIcon />
                        <span className="textfield__display-text">
                          {afterCursor}
                        </span>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <input
                  ref={inputRef}
                  type={inputType}
                  className="textfield__input"
                  placeholder={placeholder}
                  value={internalValue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  readOnly={readOnly}
                  disabled={disabled}
                  maxLength={maxLength}
                />
              )}
              {showCursor && (
                <input
                  ref={inputRef}
                  type={inputType}
                  className="textfield__input textfield__input--hidden"
                  placeholder={placeholder}
                  value={internalValue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onClick={handleClick}
                  onSelect={handleSelect}
                  onFocus={() => {
                    setIsFocused(true);
                    if (supportsSelection) {
                      requestAnimationFrame(() => {
                        if (inputRef.current) {
                          const pos = inputRef.current.selectionStart || 0;
                          setCursorPosition(pos);
                        }
                      });
                    }
                  }}
                  onBlur={() => setIsFocused(false)}
                  readOnly={readOnly}
                  disabled={disabled}
                  maxLength={maxLength}
                  autoFocus
                />
              )}
            </div>
            <div className="textfield__actions">
              {hasPasswordToggle && (
                // showPassword가 false일 때 (가려져 있을 때): EyeIcon 표시 (클릭하면 보이게)
                // showPassword가 true일 때 (보일 때): EyeOffIcon 표시 (클릭하면 가리게)
                !showPassword ? (
                  <EyeIcon onClick={togglePasswordVisibility} />
                ) : (
                  <EyeOffIcon onClick={togglePasswordVisibility} />
                )
              )}
              {showClearButton && <CircleCloseIcon onClick={handleClear} />}
              {hasTimer && <span className="textfield__timer">{formatTimer(timer)}</span>}
            </div>
          </div>
        </div>
        {hasRightButton && (
          <button
            type="button"
            className={`textfield__right-button ${rightButton.disabled ? 'textfield__right-button--disabled' : ''}`}
            onClick={rightButton.onClick}
            disabled={rightButton.disabled}
          >
            {rightButton.label}
          </button>
        )}
      </div>
      {errorMessage && (
        <p className="textfield__error-message">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="textfield__error-icon">
            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#F35064" strokeMiterlimit="10"/>
            <path d="M8 5V8.5" stroke="#F35064" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 11.5C8.41421 11.5 8.75 11.1642 8.75 10.75C8.75 10.3358 8.41421 10 8 10C7.58579 10 7.25 10.3358 7.25 10.75C7.25 11.1642 7.58579 11.5 8 11.5Z" fill="#F35064"/>
          </svg>
          {errorMessage}
        </p>
      )}
      {successMessage && <p className="textfield__success-message">{successMessage}</p>}
    </div>
  );
}

/**
 * SearchField 컴포넌트
 * 검색 입력 필드
 */
export function SearchField({
  placeholder = '검색해보세요',
  value = '',
  onChange,
  onSearch,
  className = '',
  fullWidth = false,
}: SearchFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== internalValue) {
      const input = inputRef.current;
      if (input && document.activeElement === input) {
        // 포커스가 있을 때만 커서 위치 보존
        const cursorPosition = input.selectionStart || 0;
        setInternalValue(value);
        setTimeout(() => {
          if (inputRef.current && document.activeElement === inputRef.current) {
            const newPosition = Math.min(cursorPosition, value.length);
            inputRef.current.setSelectionRange(newPosition, newPosition);
          }
        }, 0);
      } else {
        setInternalValue(value);
      }
    }
  }, [value, internalValue]);

  const getState = (): TextFieldState => {
    if (isFocused && internalValue) return 'filling';
    if (isFocused) return 'focus';
    if (internalValue) return 'filled';
    return 'default';
  };

  const state = getState();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(internalValue);
    }
  };

  const showClearButton = state === 'focus' || state === 'filling' || state === 'filled';
  const showCursor = state === 'focus' || state === 'filling';

  return (
    <div
      className={`searchfield searchfield--${state} ${fullWidth ? 'searchfield--full-width' : ''} ${className}`}
    >
      <div className="searchfield__icon">
        <SearchIcon />
      </div>
      <div className="searchfield__input-area">
        {showCursor ? (
          <div className="searchfield__text-with-cursor">
            <span className={`searchfield__display-text ${!internalValue ? 'searchfield__display-text--placeholder' : ''}`}>
              {internalValue || placeholder}
            </span>
            <CursorIcon />
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            className="searchfield__input"
            placeholder={placeholder}
            value={internalValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
          />
        )}
        {showCursor && (
          <input
            ref={inputRef}
            type="text"
            className="searchfield__input searchfield__input--hidden"
            placeholder={placeholder}
            value={internalValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        )}
      </div>
      {showClearButton && <CircleCloseIcon onClick={handleClear} />}
    </div>
  );
}

export default TextField;

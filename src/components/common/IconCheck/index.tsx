import React from 'react';
import './styles.scss';

export type IconCheckVariant = 'square' | 'round-sm' | 'round-lg';

export interface IconCheckProps {
  variant?: IconCheckVariant;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const IconCheck: React.FC<IconCheckProps> = ({
  variant = 'square',
  checked = false,
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
      className={`icon-check icon-check--${variant} ${checked ? 'icon-check--checked' : ''} ${disabled ? 'icon-check--disabled' : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {checked && variant === 'round-lg' && (
        <svg
          className="icon-check__icon"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.8869 5.99999L8.62897 13.2577L5 9.62885"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {checked && variant !== 'round-lg' && (
        <svg
          className="icon-check__icon"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.80078 5.99992L5.70604 8.79992L9.60078 2.79992"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};

export default IconCheck;

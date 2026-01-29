import React from 'react';
import Icon, { IconType } from '../Icon';
// styles는 _app.tsx에서 import됨

export type ButtonType = 'primary' | 'secondary' | 'line-white' | 'text-link' | 'text-link-gray';
export type ButtonSize = 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall';

export interface ButtonProps {
  children?: React.ReactNode;
  type?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  leftIcon?: IconType;
  rightIcon?: IconType;
  className?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  /** HTML button type (submit, button, reset) */
  htmlType?: 'submit' | 'button' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children = '버튼',
  type = 'primary',
  size = 'large',
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  fullWidth = false,
  htmlType = 'button',
}) => {
  const getIconSize = (): 16 | 20 | 24 => {
    switch (size) {
      case 'xlarge':
      case 'large':
        return 24;
      case 'medium':
      case 'small':
        return 20;
      case 'xsmall':
        return 16;
      default:
        return 24;
    }
  };

  const iconSize = getIconSize();

  return (
    <button
      type={htmlType}
      className={`button button--${type} button--${size} ${fullWidth ? 'button--full-width' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {leftIcon && <Icon type={leftIcon} size={iconSize} className="button__icon button__icon--left" />}
      <span className="button__text">{children}</span>
      {rightIcon && <Icon type={rightIcon} size={iconSize} className="button__icon button__icon--right" />}
    </button>
  );
};

export default Button;

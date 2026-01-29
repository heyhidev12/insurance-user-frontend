import React from 'react';
import styles from './styles.module.scss';

export type FloatingButtonVariant = 'consult' | 'top' | 'top-mobile';

export interface FloatingButtonProps {
  variant?: FloatingButtonVariant;
  className?: string;
  onClick?: () => void;
  label?: string;
}

// 상담 신청하기 아이콘 (pencil)
const PencilIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.3506 2.604L21.25 7.50339L8.14939 20.604L3.25461 20.5994L3.25 15.7046L16.3506 2.604Z" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M16.3506 2.604L21.25 7.50339L9.14939 19.604L4.25 14.7046L16.3506 2.604Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M20.5722 20.5987L3.25488 20.5981" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
  </svg>
);

// 위로 가기 아이콘
const TopIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1125_28198)">
      <path d="M12 20.25V3.75" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.25 10.5L12 3.75L18.75 10.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_1125_28198">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const FloatingButton: React.FC<FloatingButtonProps> = ({
  variant = 'consult',
  className = '',
  onClick,
  label = '상담 신청하기',
}) => {
  // Consult button with label and icon
  if (variant === 'consult') {
    return (
      <button
        className={`${styles.floatingButton} ${styles.floatingButtonConsult} ${className}`}
        onClick={onClick}
        aria-label={label}
      >
        <span className={styles.floatingButtonLabel}>{label}</span>
        <span className={`${styles.floatingButtonIcon} ${styles.floatingButtonIconWrite}`}>
          <PencilIcon />
        </span>
      </button>
    );
  }

  // Top button (web and mobile versions)
  const topButtonClass = variant === 'top-mobile' 
    ? `${styles.floatingButton} ${styles.floatingButtonTop} ${styles.floatingButtonTopMobile}`
    : `${styles.floatingButton} ${styles.floatingButtonTop}`;
  
  return (
    <button
      className={`${topButtonClass} ${className}`}
      onClick={onClick}
      aria-label="맨 위로"
    >
      <TopIcon />
    </button>
  );
};

export default FloatingButton;

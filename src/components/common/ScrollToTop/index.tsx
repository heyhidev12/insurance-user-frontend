'use client';

import React from 'react';
import classNames from 'classnames';
import { useScrollToTopVisibility } from '@/hooks/useScrollToTopVisibility';
import styles from './styles.module.scss';

interface ScrollToTopProps {
  className?: string;
}

const TopIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M12 20.25V3.75"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.25 10.5L12 3.75L18.75 10.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ScrollToTop({ className }: ScrollToTopProps) {
  const visible = useScrollToTopVisibility(100);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={classNames(styles.root, visible && styles.visible, className)}
      onClick={scrollToTop}
      aria-label="맨 위로"
    >
      <span className={styles.icon}>
        <TopIcon />
      </span>
    </button>
  );
}

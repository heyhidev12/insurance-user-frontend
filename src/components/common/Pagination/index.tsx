import React from 'react';
import styles from './styles.module.scss';

export interface PaginationProps {
  /** 현재 페이지 (1부터 시작) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void;
  /** 표시할 페이지 버튼 수 */
  visiblePages?: number;
  /** 클래스명 */
  className?: string;
}

// First page icon (double arrow left)
const FirstIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.1499 5L4.9999 11.5L12.1499 18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M19.2998 5L12.1498 11.5L19.2998 18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

// Previous page icon (single arrow left)
const PrevIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 5L7.85 11.5L15 18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

// Next page icon (single arrow right)
const NextIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.8501 5L16.0001 11.5L8.8501 18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

// Last page icon (double arrow right)
const LastIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.1499 5L19.2999 11.5L12.1499 18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M5 5L12.15 11.5L5 18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Pagination 컴포넌트
 * 페이지 네비게이션
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  visiblePages = 4,
  className = '',
}) => {
  // Calculate visible page range
  const getPageNumbers = () => {
    const pages: number[] = [];
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav className={`${styles.pagination} ${className}`} aria-label="Pagination">
      <div className={styles.paginationList}>
        {/* First page */}
        <button
          type="button"
          className={`${styles.paginationButton} ${styles.paginationButtonNav}`}
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          aria-label="First page"
        >
          <FirstIcon />
        </button>

        {/* Previous page */}
        <button
          type="button"
          className={`${styles.paginationButton} ${styles.paginationButtonNav}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          aria-label="Previous page"
        >
          <PrevIcon />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            className={`${styles.paginationButton} ${styles.paginationButtonPage} ${
              page === currentPage ? styles.paginationButtonActive : ''
            }`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {/* Next page */}
        <button
          type="button"
          className={`${styles.paginationButton} ${styles.paginationButtonNav}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          aria-label="Next page"
        >
          <NextIcon />
        </button>

        {/* Last page */}
        <button
          type="button"
          className={`${styles.paginationButton} ${styles.paginationButtonNav}`}
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
          aria-label="Last page"
        >
          <LastIcon />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;

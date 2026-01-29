import React from 'react';
import './styles.scss';

export interface BreadcrumbItem {
  /** 텍스트 */
  label: string;
  /** 링크 URL */
  href?: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

export interface BreadcrumbProps {
  /** 브레드크럼 아이템 목록 */
  items: BreadcrumbItem[];
  /** 홈 아이콘 표시 */
  showHome?: boolean;
  /** 홈 클릭 핸들러 */
  onHomeClick?: () => void;
  /** 클래스명 */
  className?: string;
}

// Home Icon (20x20)
const HomeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="breadcrumb__home-icon"
  >
    <path
      d="M2.6001 15.6287V7.62873L10.1001 0.810547L17.6001 7.62873V15.6287H2.6001Z"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect
      x="7.6001"
      y="10.8105"
      width="5"
      height="5.66667"
      rx="0.833333"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
);

// Arrow Icon (separator)
const ArrowIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="breadcrumb__arrow"
  >
    <path
      d="M7.25 15.25L12.75 10.25L7.25 5.25"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Breadcrumb 컴포넌트
 * 네비게이션 경로 표시
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHome = true,
  onHomeClick,
  className = '',
}) => {
  return (
    <nav className={`breadcrumb ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {showHome && (
          <li className="breadcrumb__item">
            <button
              type="button"
              className="breadcrumb__home"
              onClick={onHomeClick}
              aria-label="Home"
            >
              <HomeIcon />
            </button>
          </li>
        )}
        {items.map((item, index) => (
          <li key={index} className="breadcrumb__item">
            <ArrowIcon />
            {item.href ? (
              <a href={item.href} className="breadcrumb__link">
                {item.label}
              </a>
            ) : item.onClick ? (
              <button
                type="button"
                className="breadcrumb__link breadcrumb__link--button"
                onClick={item.onClick}
              >
                {item.label}
              </button>
            ) : (
              <span className="breadcrumb__text">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

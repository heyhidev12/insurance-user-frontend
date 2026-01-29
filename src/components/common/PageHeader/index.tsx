import React from 'react';
// 스타일은 _app.tsx에서 글로벌로 import됨

export type PageHeaderSize = 'web' | 'mobile';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TabItem {
  id: string;
  label: string;
}

export interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  tabs?: TabItem[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
  size?: PageHeaderSize;
  className?: string;
}

// 홈 아이콘
const HomeIcon: React.FC<{ size?: 'web' | 'mobile' }> = ({ size = 'web' }) => {
  const iconSize = size === 'web' ? 20 : 16;
  return (
    <svg width={iconSize} height={iconSize} viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.600098 17.6292V7.62922L8.1001 0.811035L15.6001 7.62922V17.6292H0.600098Z" stroke="white" strokeWidth="1.2"/>
      <rect x="5.6001" y="10.811" width="5" height="6.66667" rx="0.833333" stroke="white" strokeWidth="1.2"/>
    </svg>
  );
};

// 화살표 아이콘
const ArrowIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.25 15.25L12.75 10.25L7.25 5.25" stroke="#BEBEC7" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

// 활성 탭 표시 점
const ActiveDot: React.FC = () => (
  <span className="page-header__tab-dot" />
);

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs = [],
  tabs = [],
  activeTabId,
  onTabChange,
  size = 'web',
  className = '',
}) => {
  return (
    <div className={`page-header page-header--${size} ${className}`}>
      <div className="page-header__content">
        {/* 브레드크럼 */}
        {breadcrumbs.length > 0 && (
          <nav className="page-header__breadcrumb">
            <a href="/" className="page-header__breadcrumb-home">
              <HomeIcon size={size} />
            </a>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <ArrowIcon />
                {item.href ? (
                  <a href={item.href} className="page-header__breadcrumb-item">
                    {item.label}
                  </a>
                ) : (
                  <span className="page-header__breadcrumb-item">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* 타이틀 */}
        <h1 className="page-header__title">{title}</h1>
      </div>

      {/* 탭 네비게이션 */}
      {tabs.length > 0 && (
        <div className="page-header__tabs">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                className={`page-header__tab ${isActive ? 'page-header__tab--active' : ''}`}
                onClick={() => onTabChange?.(tab.id)}
              >
                {isActive && <ActiveDot />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

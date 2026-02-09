import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useFooter, FamilySite } from '@/context/FooterContext';
// styles는 _app.tsx에서 import됨

export interface FooterLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface FooterProps {
  /** 로고 이미지 경로 */
  logoSrc?: string;
  /** 네비게이션 링크 */
  navLinks?: FooterLink[];
  /** 저작권 텍스트 */
  copyright?: string;
  /** 클래스명 */
  className?: string;
}

// Arrow Right Icon (for button)
const ArrowRightIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="footer__arrow-icon"
  >
    <path
      d="M3.75 12L20.25 12"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 5.25L20.25 12L13.5 18.75"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Chevron Down Icon for dropdown
const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`footer__chevron-icon ${isOpen ? 'footer__chevron-icon--open' : ''}`}
    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
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

const defaultNavLinks: FooterLink[] = [
  { label: '업무분야', href: '/business-areas/hierarchical' },
  { label: '전문가 소개', href: '/experts' },
  { label: '교육/세미나', href: '/education' },
  { label: '함께소개', href: '/history?tab=intro' },
  { label: '인사이트', href: '/insights' },
];

// Terms links with dynamic paths
const termsLinks: FooterLink[] = [
  { label: '서비스이용약관', href: '/policy?type=TERMS' },
  { label: '개인정보처리방침', href: '/policy?type=PRIVACY' },
];

/**
 * Footer 컴포넌트
 * CSS 미디어쿼리로 반응형 처리
 * 동적 데이터 로드: 패밀리 사이트, 약관
 */
const Footer: React.FC<FooterProps> = ({
  logoSrc = '/images/common/logos/logo-footer.png',
  navLinks = defaultNavLinks,
  copyright = '2025 TAX ACCOUNTING TOGETHER all rights reserved.',
  className = '',
}) => {
  const { familySites, familySitesLoading, familySitesError } = useFooter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsDropdownOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsDropdownOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < familySites.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < familySites.length) {
          window.open(familySites[focusedIndex].url, '_blank', 'noopener,noreferrer');
          setIsDropdownOpen(false);
          setFocusedIndex(-1);
        }
        break;
      case 'Tab':
        setIsDropdownOpen(false);
        setFocusedIndex(-1);
        break;
    }
  }, [isDropdownOpen, focusedIndex, familySites]);

  // Handle family site click
  const handleFamilySiteClick = (site: FamilySite) => {
    window.open(site.url, '_blank', 'noopener,noreferrer');
    setIsDropdownOpen(false);
    setFocusedIndex(-1);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
    if (!isDropdownOpen) {
      setFocusedIndex(0);
    } else {
      setFocusedIndex(-1);
    }
  };

  // Check if dropdown should be disabled
  const isDropdownDisabled = familySitesLoading || familySitesError !== null || familySites.length === 0;

  // Render terms links
  const renderTermsLinks = () => (
    <>
      {termsLinks.map((link, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="footer__terms-divider">|</span>}
          <Link href={link.href || '#'} className="footer__terms-link">
            {link.label}
          </Link>
        </React.Fragment>
      ))}
    </>
  );

  return (
    <footer className={`footer ${className}`}>
      <div className="footer__container">
        <div className="footer__content">
          {/* Row 1: Logo + Terms(모바일만) + Family Site */}
          <div className="footer__row footer__row--top">
            <div className="footer__logo-wrapper">
              <img
                src={logoSrc}
                alt="MODOO CONSULTING"
                className="footer__logo footer__logo--web"
              />
              <img
                src="/images/common/logos/logo-footer-mobile.png"
                alt="MODOO CONSULTING"
                className="footer__logo footer__logo--mobile"
              />
            </div>

            {/* 약관 - 모바일에서만 여기에 표시 */}
            <div className="footer__terms footer__terms--mobile">
              {renderTermsLinks()}
            </div>

            {/* Family Sites Dropdown */}
            <div className="footer__family-site-wrapper" ref={dropdownRef}>
              <button
                ref={buttonRef}
                type="button"
                className={`footer__family-site-btn ${isDropdownDisabled ? 'footer__family-site-btn--disabled' : ''}`}
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                disabled={isDropdownDisabled}
                aria-expanded={isDropdownOpen}
                aria-haspopup="listbox"
                aria-label="패밀리 사이트 선택"
              >
                <span>
                  {familySitesLoading ? '로딩 중...' : 
                   familySitesError ? '패밀리 사이트' : 
                   familySites.length === 0 ? '패밀리 사이트' : 
                   '패밀리 사이트'}
                </span>
                {!isDropdownDisabled ? (
                  <ChevronDownIcon isOpen={isDropdownOpen} />
                ) : (
                  <ArrowRightIcon />
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && familySites.length > 0 && (
                <ul
                  className="footer__dropdown"
                  role="listbox"
                  aria-label="패밀리 사이트 목록"
                >
                  {familySites.map((site, index) => (
                    <li
                      key={site.id}
                      role="option"
                      aria-selected={focusedIndex === index}
                      className={`footer__dropdown-item ${focusedIndex === index ? 'footer__dropdown-item--focused' : ''}`}
                      onClick={() => handleFamilySiteClick(site)}
                      onMouseEnter={() => setFocusedIndex(index)}
                    >
                      {site.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="footer__divider" />

          {/* Row 2: Terms(웹만) + Nav links */}
          <div className="footer__row footer__row--middle">
            {/* 약관 - 웹에서만 여기에 표시 */}
            <div className="footer__terms footer__terms--web">
              {renderTermsLinks()}
            </div>

            <nav className="footer__nav">
              {navLinks.map((link, index) => {
                if (link.onClick) {
                  return (
                    <a
                      key={index}
                      href={link.href}
                      className="footer__nav-link"
                      onClick={link.onClick}
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={index}
                    href={link.href || '#'}
                    className="footer__nav-link"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Row 3: Copyright */}
          <div className="footer__row footer__row--bottom">
            <p className="footer__copyright">{copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

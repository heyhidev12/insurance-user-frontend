import React from 'react';
import Link from 'next/link';
// styles는 _app.tsx에서 import됨

export interface FooterLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface FooterProps {
  /** 로고 이미지 경로 */
  logoSrc?: string;
  /** 패밀리 사이트 클릭 핸들러 */
  onFamilySiteClick?: () => void;
  /** 네비게이션 링크 */
  navLinks?: FooterLink[];
  /** 약관 링크 */
  termsLinks?: FooterLink[];
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

const defaultNavLinks: FooterLink[] = [
  { label: '업무분야', href: '/business-areas/hierarchical' },
  { label: '전문가 소개', href: '/experts' },
  { label: '교육/세미나', href: '/education' },
  { label: '함께소개', href: '/history?tab=intro' },
  { label: '인사이트', href: '/insights' },
];

const defaultTermsLinks: FooterLink[] = [
  { label: '서비스이용약관', href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
];

/**
 * Footer 컴포넌트
 * CSS 미디어쿼리로 반응형 처리
 */
const Footer: React.FC<FooterProps> = ({
  logoSrc = '/images/common/logos/logo-footer.png',
  onFamilySiteClick,
  navLinks = defaultNavLinks,
  termsLinks = defaultTermsLinks,
  copyright = '2025 TAX ACCOUNTING TOGETHER all rights reserved.',
  className = '',
}) => {
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
              {termsLinks.map((link, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="footer__terms-divider">|</span>}
                  {link.onClick ? (
                    <a href={link.href} className="footer__terms-link" onClick={link.onClick}>
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href || '#'} className="footer__terms-link">
                      {link.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="footer__family-site-wrapper">
              <button
                type="button"
                className="footer__family-site-btn"
                onClick={onFamilySiteClick}
              >
                <span>패밀리 사이트</span>
                <ArrowRightIcon />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="footer__divider" />

          {/* Row 2: Terms(웹만) + Nav links */}
          <div className="footer__row footer__row--middle">
            {/* 약관 - 웹에서만 여기에 표시 */}
            <div className="footer__terms footer__terms--web">
              {termsLinks.map((link, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="footer__terms-divider">|</span>}
                  {link.onClick ? (
                    <a href={link.href} className="footer__terms-link" onClick={link.onClick}>
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href || '#'} className="footer__terms-link">
                      {link.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
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

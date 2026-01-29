import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <img src="/images/common/logos/logo.png" alt="MODOO CONSULTING" className="footer-logo" />
        <button className="family-site-button">
          패밀리 사이트
          <span className="arrow-icon" />
        </button>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <div className="footer-left">
          <div className="footer-links">
            <Link href="#" className="footer-link">서비스이용약관</Link>
            <Link href="#" className="footer-link">개인정보처리방침</Link>
          </div>
          <p className="copyright">
            2025 TAX ACCOUNTING TOGETHER all rights reserved.
          </p>
        </div>

        <nav className="footer-nav">
          <Link href="#" className="footer-nav-link">업무분야</Link>
          <Link href="#" className="footer-nav-link">전문가 소개</Link>
          <Link href="#" className="footer-nav-link">교육/세미나</Link>
          <Link href="#" className="footer-nav-link">함께소개</Link>
          <Link href="#" className="footer-nav-link">인사이트</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

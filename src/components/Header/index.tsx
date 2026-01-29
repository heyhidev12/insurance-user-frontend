import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  variant?: 'white' | 'transparent';
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ variant = 'white', onMenuClick }) => {
  return (
    <header className={`header-container variant-${variant}`}>
      <div className="header-inner">
        <Link href="/" className="logo">
          <img
            src="/images/common/logos/logo.png"
            alt="MODOO CONSULTING"
            className={`logo-image ${variant === 'transparent' ? 'variant-transparent' : ''}`}
          />
        </Link>
        <button className="menu-button" onClick={onMenuClick}>
          <div className={`menu-icon variant-${variant}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;

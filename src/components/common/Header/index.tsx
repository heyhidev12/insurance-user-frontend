import React from 'react';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';

export type HeaderVariant = 'transparent' | 'white' | 'black';

export interface HeaderProps {
  variant?: HeaderVariant;
  onMenuClick?: () => void;
  onLogoClick?: () => void;
  className?: string;
  isFixed?: boolean;
}

// 햄버거 메뉴 아이콘 (흰색)
const MenuIconWhite: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.3999 11H32.5999" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7.3999 20H32.5999" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7.3999 29H32.5999" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// 햄버거 메뉴 아이콘 (다크)
const MenuIconDark: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.3999 11H32.5999" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7.3999 20H32.5999" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7.3999 29H32.5999" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Header: React.FC<HeaderProps> = ({
  variant = 'transparent',
  onMenuClick,
  onLogoClick,
  className = '',
  isFixed = false,
}) => {
  const router = useRouter();
  const isHome = router.pathname === '/';
  const isWhite = variant === 'white';

  // 홈 외 페이지에서는 검정 배경 적용
  const effectiveVariant = !isHome && variant === 'transparent' ? 'black' : variant;

  // variant에 따라 고해상도 로고 이미지 선택
  // white → 빨간색 로고 (logo-hd.png)
  // transparent/black → 흰색 로고 (logo-hd_w.png)
  const logoSrc = isWhite
    ? '/images/logo/logo-hd.png'  // 흰색 배경 → 빨간색 로고 (고해상도)
    : '/images/logo/logo-hd_w.png'; // 어두운 배경 → 흰색 로고 (고해상도)

  // 로고 클릭 핸들러: onLogoClick이 있으면 사용, 없으면 기본적으로 홈으로 이동
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      router.push('/');
    }
  };

  return (
    <header
      className={`${styles.header} ${styles[`header--${effectiveVariant}`]} ${isFixed ? styles['header--fixed'] : ''} ${className}`}
    >
      <div className={styles['header__inner']}>
        <div
          className={styles['header__logo']}
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        >
          <img src={logoSrc} alt="MODOO CONSULTING" className={styles['header__logo-image']} />
        </div>
        <button
          className={styles['header__menu']}
          onClick={onMenuClick}
          aria-label="메뉴 열기"
        >
          {isWhite ? <MenuIconDark /> : <MenuIconWhite />}
        </button>
      </div>
    </header>
  );
};

export default Header;

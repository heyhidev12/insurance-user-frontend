import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { get } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryResponse {
  isExposed: boolean;
  data: unknown[];
}

interface DataRoom {
  id: string;
  name: string;
  displayType: 'gallery' | 'snippet' | 'list';
  isExposed: boolean;
}

interface DataRoomsResponse {
  items: DataRoom[];
}

// Business Areas hierarchical 타입
interface BusinessAreaHierarchical {
  majorCategory: {
    id: number;
    name: string;
    isExposed: boolean;
  };
  minorCategories: Array<{ id: number; name: string; isExposed: boolean }>;
}

// Insights hierarchical 타입
interface InsightsHierarchical {
  category: {
    id: number;
    name: string;
    type: string;
    isActive: boolean;
    targetMemberType: 'ALL' | 'GENERAL' | 'INSURANCE' | 'OTHER';
  };
  subcategories: Array<{ id: number; name: string; isExposed: boolean }>;
}

const MENU_ITEMS = [
  {
    id: 'services',
    title: '업무분야',
    subItems: [] as string[]  // API에서 동적으로 채움
  },
  {
    id: 'experts',
    title: '전문가 소개',
    subItems: []
  },
  {
    id: 'education',
    title: '교육/세미나',
    subItems: []
  },
  {
    id: 'about',
    title: '함께소개',
    subItems: ['소개', '연혁', '수상/인증', '본점/지점 안내', '주요 고객', 'CI가이드']
  },
  {
    id: 'insight',
    title: '인사이트',
    subItems: []
  },
];

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<string>('services');
  const [selectedSubItem, setSelectedSubItem] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 연혁 탭 노출 여부
  const [historyExposed, setHistoryExposed] = useState(true);

  // 자료실 목록
  const [dataRooms, setDataRooms] = useState<DataRoom[]>([]);

  // Business Areas hierarchical 데이터
  const [businessAreas, setBusinessAreas] = useState<BusinessAreaHierarchical[]>([]);

  // Insights hierarchical 데이터
  const [insightsData, setInsightsData] = useState<InsightsHierarchical[]>([]);

  // 현재 사용자 타입 (회원 타입별 카테고리 접근 제어용)
  const [currentUserType, setCurrentUserType] = useState<string | null>(null);

  // 사용자 타입 가져오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUserType(user.memberType || null);
        } catch {
          setCurrentUserType(null);
        }
      }
    }
  }, []);

  // 연혁 노출 여부 및 API 데이터에 따라 메뉴 아이템 동적 생성
  const menuItems = MENU_ITEMS.map(item => {
    if (item.id === 'services') {
      // Business Areas: majorCategory.name 목록 (isExposed가 true인 것만)
      const exposedAreas = businessAreas
        .filter(ba => ba.majorCategory.isExposed)
        .map(ba => ba.majorCategory.name);
      return {
        ...item,
        subItems: exposedAreas.length > 0 ? exposedAreas : item.subItems
      };
    }
    if (item.id === 'about') {
      return {
        ...item,
        subItems: historyExposed
          ? item.subItems
          : item.subItems.filter(sub => sub !== '연혁')
      };
    }
    if (item.id === 'insight') {
      // Insights: category.name 목록 (isActive + targetMemberType 필터링)
      const exposedInsights = insightsData
        .filter(ins => {
          if (!ins.category.isActive) return false;
          // ALL은 모든 사용자 접근 가능
          if (ins.category.targetMemberType === 'ALL') return true;
          // 비로그인 사용자는 ALL만 접근 가능
          if (!currentUserType) return false;
          // 로그인 사용자는 자신의 타입과 일치하는 카테고리만 접근 가능
          return currentUserType === ins.category.targetMemberType;
        })
        .map(ins => ins.category.name);
      return {
        ...item,
        subItems: exposedInsights.length > 0 ? exposedInsights : item.subItems
      };
    }
    return item;
  });

  // 현재 경로에 따라 메뉴 항목 자동 선택
  useEffect(() => {
    if (isOpen) {
      const pathname = router.pathname;
      const query = router.query;
      
      // 경로에 따른 메뉴 ID 매핑
      if (pathname === '/experts') {
        setSelectedItem('experts');
        setSelectedSubItem(null);
      } else if (pathname === '/education') {
        setSelectedItem('education');
        setSelectedSubItem(null);
      } else if (pathname === '/insights' || pathname.startsWith('/insights/')) {
        setSelectedItem('insight');
        // 인사이트 서브메뉴 선택 - category 쿼리 파라미터로 찾기
        const categoryId = query.category as string;
        if (categoryId && insightsData.length > 0) {
          const insightIndex = insightsData.findIndex(
            ins => ins.category.id === Number(categoryId) && ins.category.isActive
          );
          setSelectedSubItem(insightIndex !== -1 ? insightIndex : null);
        } else {
          setSelectedSubItem(null);
        }
      } else if (pathname === '/history' || pathname.startsWith('/history')) {
        setSelectedItem('about');
        // 함께소개 서브메뉴 선택 - 연혁 노출 여부에 따라 동적으로 인덱스 계산
        const aboutMenuItem = menuItems.find(item => item.id === 'about');
        if (aboutMenuItem) {
          const labelToTab: { [key: string]: string } = {
            '소개': 'intro',
            '연혁': 'history',
            '수상/인증': 'awards',
            '본점/지점 안내': 'branches',
            '주요 고객': 'customers',
            'CI가이드': 'ci',
          };
          const tab = query.tab as string;
          // 현재 서브메뉴에서 해당 탭의 인덱스 찾기
          const subItemIndex = aboutMenuItem.subItems.findIndex(subItem => labelToTab[subItem] === tab);
          if (subItemIndex !== -1) {
            setSelectedSubItem(subItemIndex);
          } else {
            setSelectedSubItem(null);
          }
        } else {
          setSelectedSubItem(null);
        }
      } else if (pathname === '/business-areas/hierarchical' || pathname.startsWith('/business-areas/')) {
        setSelectedItem('services');
        // 업무분야 서브메뉴 선택 - category 쿼리 파라미터로 찾기
        const categoryId = query.category as string;
        if (categoryId && businessAreas.length > 0) {
          const areaIndex = businessAreas.findIndex(
            ba => ba.majorCategory.id === Number(categoryId) && ba.majorCategory.isExposed
          );
          setSelectedSubItem(areaIndex !== -1 ? areaIndex : 0);
        } else {
          setSelectedSubItem(0);
        }
      } else {
        // 기본값은 첫 번째 메뉴 항목
        setSelectedItem('services');
        setSelectedSubItem(null);
      }
    }
  }, [isOpen, router.pathname, router.query, historyExposed, businessAreas, insightsData]);

  useEffect(() => {
    if (isOpen && !hasBeenOpened) {
      setHasBeenOpened(true);
    }
  }, [isOpen, hasBeenOpened]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token);
      }
    };
    
    // 메뉴가 열릴 때마다 로그인 상태 확인
    if (isOpen) {
      checkAuth();
    }
    
    // storage 이벤트 리스너 (다른 탭에서 로그인/로그아웃 시)
    const handleStorageChange = () => {
      checkAuth();
    };
    window.addEventListener('storage', handleStorageChange);
    
    // 같은 탭에서의 변경 감지를 위한 주기적 확인
    let intervalId: NodeJS.Timeout | null = null;
    if (isOpen) {
      intervalId = setInterval(checkAuth, 500);
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isOpen]);

  // 메뉴가 열릴 때 연혁 노출 여부 확인
  useEffect(() => {
    if (isOpen) {
      const checkHistoryExposed = async () => {
        try {
          const response = await get<HistoryResponse>(API_ENDPOINTS.HISTORY);
          if (response.data) {
            setHistoryExposed(response.data.isExposed);
          } else {
            setHistoryExposed(false);
          }
        } catch {
          setHistoryExposed(false);
        }
      };
      checkHistoryExposed();
    }
  }, [isOpen]);

  // 메뉴가 열릴 때 자료실 목록 확인
  useEffect(() => {
    if (isOpen) {
      const fetchDataRooms = async () => {
        try {
          const response = await get<DataRoomsResponse>(API_ENDPOINTS.DATA_ROOMS);
          if (response.data?.items) {
            setDataRooms(response.data.items);
          } else {
            setDataRooms([]);
          }
        } catch {
          setDataRooms([]);
        }
      };
      fetchDataRooms();
    }
  }, [isOpen]);

  // 메뉴가 열릴 때 Business Areas hierarchical 데이터 가져오기
  useEffect(() => {
    if (isOpen) {
      const fetchBusinessAreas = async () => {
        try {
          const response = await get<BusinessAreaHierarchical[]>(
            `${API_ENDPOINTS.BUSINESS_AREAS_HIERARCHICAL}?limit=20&page=1`
          );
          if (response.data && Array.isArray(response.data)) {
            setBusinessAreas(response.data);
          } else {
            setBusinessAreas([]);
          }
        } catch {
          setBusinessAreas([]);
        }
      };
      fetchBusinessAreas();
    }
  }, [isOpen]);

  // 메뉴가 열릴 때 Insights hierarchical 데이터 가져오기
  useEffect(() => {
    if (isOpen) {
      const fetchInsights = async () => {
        try {
          const response = await get<InsightsHierarchical[]>(
            `${API_ENDPOINTS.INSIGHTS_HIERARCHICAL}?limit=20&page=1`
          );
          if (response.data && Array.isArray(response.data)) {
            setInsightsData(response.data);
          } else {
            setInsightsData([]);
          }
        } catch {
          setInsightsData([]);
        }
      };
      fetchInsights();
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 500);
  };

  const handleLoginClick = () => {
    handleClose();
    setTimeout(() => router.push('/login'), 500);
  };

  const handleSignupClick = () => {
    handleClose();
    setTimeout(() => router.push('/signup'), 500);
  };

  const handleMyPageClick = () => {
    handleClose();
    setTimeout(() => router.push('/my'), 500);
  };

  const handleItemClick = (id: string) => {
    const menuItem = menuItems.find(item => item.id === id);
    const hasSubItems = menuItem && menuItem.subItems && menuItem.subItems.length > 0;
    
    if (hasSubItems) {
      // 서브메뉴가 있는 경우 선택 상태만 변경
      setSelectedItem(id);
      setSelectedSubItem(null); // 메인 메뉴 변경 시 서브 메뉴 선택 초기화
    } else {
      // 서브메뉴가 없는 경우 즉시 페이지 이동
      handleClose();
      setSelectedSubItem(null);
      
      // 페이지 라우팅 매핑
      const routeMap: { [key: string]: string } = {
        'experts': '/experts',
        'education': '/education',
        'insight': '/insights',
      };
      
      const route = routeMap[id];
      if (route) {
        setTimeout(() => router.push(route), 500);
      }
    }
  };

  const handleSubItemClick = (subItem: string, index: number) => {
    setSelectedSubItem(index);
    handleClose();

    if (selectedItem === 'services') {
      // 업무분야 서브메뉴 - API 데이터에서 해당 카테고리 찾기
      const area = businessAreas.find(ba => ba.majorCategory.name === subItem);
      if (area) {
        setTimeout(() => router.push(`/business-areas/hierarchical?category=${area.majorCategory.id}`), 500);
      }
    } else if (selectedItem === 'about') {
      // 함께소개 서브메뉴
      const tabMap: { [key: string]: string } = {
        '소개': 'intro',
        '연혁': 'history',
        '수상/인증': 'awards',
        '본점/지점 안내': 'branches',
        '주요 고객': 'customers',
        'CI가이드': 'ci',
      };

      const tab = tabMap[subItem];
      if (tab) {
        setTimeout(() => router.push(`/history?tab=${tab}`), 500);
      }
    } else if (selectedItem === 'insight') {
      // 인사이트 서브메뉴 - API 데이터에서 해당 카테고리 찾기
      const insightCategory = insightsData.find(ins => ins.category.name === subItem);
      if (insightCategory) {
        setTimeout(() => router.push(`/insights?category=${insightCategory.category.id}`), 500);
      }
    }
  };

  const wrapperClass = `menu-wrapper ${hasBeenOpened || isOpen ? 'is-visible' : ''}`;
  const overlayClass = `menu-overlay ${isOpen && !isClosing ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''}`;
  const containerClass = `menu-container ${isOpen && !isClosing ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''}`;

  return (
    <div className={wrapperClass}>
      <div className={overlayClass} onClick={handleClose} />
      <nav className={containerClass}>
        {/* 헤더: 로고(모바일) + 닫기 버튼 */}
        <div className="menu-header">
          {/* 로고 - 모바일에서만 표시 */}
          <div className="menu-logo menu-logo--mobile" onClick={() => { handleClose(); setTimeout(() => router.push('/'), 500); }}>
            <img src="/images/logo/logo-hd_w.png" alt="MODOO CONSULTING" />
          </div>

          {/* X 버튼 - 모든 화면에서 표시 */}
          <button className="menu-close" onClick={handleClose} aria-label="메뉴 닫기">
            <span className="menu-close-line" />
            <span className="menu-close-line" />
          </button>
        </div>

        {/* 인증 링크 */}
        <div className="menu-auth">
          {isAuthenticated ? (
            <button className="auth-link my-page-link" onClick={handleMyPageClick}>
              <img
                src="/images/common/user-icon-white.svg"
                alt="My Page"
                className="my-page-icon"
              />
              <span>My Page</span>
            </button>
          ) : (
            <div className="auth-links">
              <button className="auth-link" onClick={handleLoginClick}>로그인</button>
              <span className="auth-divider" />
              <button className="auth-link" onClick={handleSignupClick}>회원가입</button>
            </div>
          )}
        </div>

        <div className="menu-content">
          {/* 메인 메뉴 */}
          <ul className="menu-list">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`menu-item ${selectedItem === item.id ? 'is-selected' : ''} ${hoveredItem === item.id ? 'is-hovered' : ''}`}
                onClick={() => handleItemClick(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="menu-title-wrapper">
                  <h2 className="menu-title">{item.title}</h2>
                  <div className={`menu-underline ${selectedItem === item.id ? 'is-visible' : ''}`} />
                </div>
                {/* 모바일: 서브메뉴를 각 항목 아래에 표시 */}
                {selectedItem === item.id && item.subItems.length > 0 && (
                  <ul className="sub-menu-list sub-menu-list--mobile" onClick={(e) => e.stopPropagation()}>
                    {item.subItems.map((subItem, index) => (
                      <li
                        key={index}
                        className={`sub-menu-item ${selectedSubItem === index ? 'is-active' : ''}`}
                        onClick={() => handleSubItemClick(subItem, index)}
                      >
                        {subItem}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* 데스크탑: 서브메뉴를 오른쪽에 표시 */}
          {(() => {
            const selectedMenuItem = menuItems.find(item => item.id === selectedItem);
            if (selectedMenuItem && selectedMenuItem.subItems.length > 0) {
              return (
                <ul className="sub-menu-list sub-menu-list--desktop">
                  {selectedMenuItem.subItems.map((subItem, index) => (
                    <li
                      key={index}
                      className={`sub-menu-item ${selectedSubItem === index ? 'is-active' : ''}`}
                      onClick={() => handleSubItemClick(subItem, index)}
                    >
                      {subItem}
                    </li>
                  ))}
                </ul>
              );
            }
            return null;
          })()}
        </div>

        <div className="menu-footer">
          <button className="footer-button" onClick={() => { handleClose(); setTimeout(() => router.push('/consultation/apply'), 500); }}>구성원신청</button>
        </div>
      </nav>
    </div>
  );
};

export default Menu;

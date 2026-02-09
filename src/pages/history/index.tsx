import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import PageHeader from '@/components/common/PageHeader';
import FloatingButton from '@/components/common/FloatingButton';
import Tab from '@/components/common/Tab';
import BranchDetailModal from '@/components/history/BranchDetailModal';
import SEO from '@/components/SEO';
import { get } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import styles from './history.module.scss';

interface HistoryItem {
  id: number;
  month: number;
  content: string;
  displayOrder: number;
  createdAt: string;
}

interface HistoryYear {
  year: number;
  items: HistoryItem[];
}

interface HistoryResponse {
  isExposed: boolean;
  data: HistoryYear[];
}

interface AwardImage {
  id: number;
  url: string;
}

interface AwardItem {
  id: number;
  name: string;
  source: string;
  image: AwardImage;
  isMainExposed: boolean;
  displayOrder: number;
}

interface AwardYear {
  year: number;
  items: AwardItem[];
}

type AwardResponse = AwardYear[];

interface BranchItem {
  id: number;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phoneNumber: string | null;
  fax: string | null;
  email: string | null;
  blogUrl: string | null;
  youtubeUrl: string | null;
  instagramUrl: string | null;
  websiteUrl: string | null;
  busInfo: string | null;
  subwayInfo: string | null;
  taxiInfo: string | null;
  displayOrder: number;
  isExposed: boolean;
}

interface BranchResponse {
  items: BranchItem[];
  total: number;
  page: number;
  limit: number;
}

const HistoryPage: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState<HistoryYear[]>([]);
  const [loading, setLoading] = useState(true);

  // 연혁 탭 노출 여부 (다른 state보다 먼저 선언)
  const [historyExposed, setHistoryExposed] = useState(true);

  // URL 쿼리 파라미터에서 탭 읽기
  const tabFromQuery = router.query.tab as string;
  const validTabs = ['intro', 'history', 'awards', 'branches', 'customers', 'ci'];
  const initialTab = tabFromQuery && validTabs.includes(tabFromQuery) ? tabFromQuery : 'intro';
  const [activeTab, setActiveTab] = useState(initialTab);

  // URL 쿼리 파라미터가 변경되면 탭 업데이트
  useEffect(() => {
    if (tabFromQuery && validTabs.includes(tabFromQuery)) {
      setActiveTab(tabFromQuery);
    } else if (tabFromQuery === 'insights') {
      // 인사이트 탭이 선택된 경우 기본 탭으로 리다이렉트
      router.replace('/history?tab=intro', undefined, { shallow: true });
      setActiveTab('intro');
    }
  }, [tabFromQuery]);

  // 연혁 탭이 숨겨진 상태에서 history 탭에 접근하면 intro로 리다이렉트
  useEffect(() => {
    if (!historyExposed && activeTab === 'history') {
      router.replace('/history?tab=intro', undefined, { shallow: true });
      setActiveTab('intro');
    }
  }, [historyExposed, activeTab]);
  const [activeCard, setActiveCard] = useState<'professionalism' | 'consulting' | 'trust'>('professionalism');
  const [awardsData, setAwardsData] = useState<AwardYear[]>([]);
  const [awardsLoading, setAwardsLoading] = useState(true);
  const [awardsError, setAwardsError] = useState<string | null>(null);
  const [customersData, setCustomersData] = useState<Array<{ id: number; logo: { id: number; url: string }; displayOrder: number; isMainExposed: boolean; isExposed: boolean; websiteUrl: string | null }>>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState<string | null>(null);
  const [branchesData, setBranchesData] = useState<BranchItem[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchItem | null>(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  // Swipe handling for mobile philosophy cards
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  const cardOrder: ('professionalism' | 'consulting' | 'trust')[] = ['professionalism', 'consulting', 'trust'];

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartX.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(currentX - touchStartX.current);
    const diffY = Math.abs(currentY - touchStartY.current);

    // If horizontal movement is greater than vertical, it's a swipe
    if (diffX > diffY && diffX > 10) {
      isSwiping.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX;
    const minSwipeDistance = 30; // Reduced for better sensitivity

    if (Math.abs(distance) > minSwipeDistance) {
      setActiveCard((prev) => {
        const currentIndex = cardOrder.indexOf(prev);
        if (distance > 0) {
          // Swipe left -> next card
          return cardOrder[(currentIndex + 1) % cardOrder.length];
        } else {
          // Swipe right -> previous card
          return cardOrder[(currentIndex - 1 + cardOrder.length) % cardOrder.length];
        }
      });
    }

    isSwiping.current = false;
  }, []);

  const cardImages = {
    professionalism: '/images/intro/meeting.jpg',
    consulting: '/images/intro/building.jpg',
    trust: '/images/intro/hands-together.jpg',
  };

  const cardContents = {
    professionalism: {
      title: '전문성',
      content: (
        <>
          <p>
            <strong>세무법인 함께의 전문성은 가장 정확하고 유리한 길을 찾아내는 힘입니다.</strong>
            <br />
            우리는 단순히 세법 지식을 나열하는 것이 아니라, 복잡하게 얽힌 법규와 수시로 변하는 예규 속에서도
          </p>
          <p>
            다년간 축적된 수많은 성공 사례와 풍부한 실무 경험을 바탕으로 <strong>실질적인 해결책</strong>을 도출합니다.
            <br />
            기업의 일상적인 부가세, 법인세 신고 업무부터 고도의 전문성을 요구하는 <strong>세무조사 대응, 조세 불복 청구,</strong>
          </p>
          <p>
            <strong>M&A 및 기업 구조조정 자문, 국제 조세(이전가격), 상속 및 증여 플랜</strong>에 이르기까지
          </p>
          <p>
            모든 영역에서 빈틈없는 서비스를 제공합니다.
            <br />
            <br />
            우리의 정확한 분석과 <strong>선제적인 리스크 관리</strong>는
          </p>
          <p>
            고객이 세무 문제의 걱정 없이 <strong>핵심 비즈니스</strong>에만 <strong>집중</strong>할 수 있도록 만드는 강력한 신뢰의 기반입니다.
          </p>
        </>
      ),
    },
    consulting: {
      title: '통합 컨설팅',
      content: (
        <>
          <p>
            <strong>기업의 문제는 세무, 회계, 재무, 경영이 분리되어 있지 않습니다.</strong>
            <br />
            우리는 이 모든 요소를 하나의 관점으로 꿰뚫어 보는 <strong>통합 솔루션</strong>을 제공합니다.
            <br />
            단순한 기장 대행과 세무 신고를 넘어,
          </p>
          <p>
            그 과정에서 산출된 재무제표를 심층 분석하여 기업의 현재 경영 상태를 정확하게 진단합니다.
            <br />
            이러한 진단을 바탕으로 안정적인 <strong>현금흐름 관리,</strong> 효율적인 <strong>자금 조달</strong> 방안, 합리적인 <strong>절세 전략</strong>을
            <br />
            비즈니스 전반의 방향성과 연결하여 설계합니다.
          </p>
          <p>
            <br />
            예를 들어, 특정 절세 방안이 기업의 <strong>재무 비율</strong>을 악화시켜 향후 <strong>투자 유치</strong>나 대출에 불리하게 작용하지 않도록 종합적으로 고려합니다.
            <br />
            숫자 너머의 비즈니스 성장을 함께 설계하는 <strong>전문적 파트너</strong>로서, <strong>기업 가치를 극대화</strong>하는 최적의 의사결정을 지원합니다.
          </p>
        </>
      ),
    },
    trust: {
      title: '동행과 신뢰',
      content: (
        <>
          <p>
            <strong>신뢰는 일회성 성과가 아닌, 꾸준하고 진정성 있는 소통</strong>에서 나옵니다.
          </p>
          <p>
            우리는 고객사의 산업 특성과 비즈니스 히스토리를 깊이 이해하고, 대표님의 경영 철학을 공유하는 든든한 파트너로서 동행합니다.
          </p>
          <p>
            전문가와의 장기적인 관계를 유지하며, <strong>기업의 창업부터 성장, 성숙기, 그리고 가업 승계에 이르는 전 과정을 함께</strong>합니다.
          </p>
          <p>
            복잡한 세무 이슈를 고객의 눈높이에서 알기 쉽게 설명하고, <strong>지속적인 커뮤니케이션</strong>을 통해 잠재적 <strong>리스크를 분석하고 관리</strong>합니다.
          </p>
          <p>
            예기치 못한 세무조사나 경영상의 위기 순간에 가장 먼저 기댈 수 있는 버팀목이 되어 드립니다.
          </p>
          <p>
            곁에서 <strong>함께 고민하고 미래를 준비하는 꾸준함이 곧 우리가 약속하는 신뢰의 증명</strong>입니다.
          </p>
        </>
      ),
    },
  };

  const tabItems = [
    { id: 'intro', label: '소개' },
    { id: 'history', label: '연혁' },
    { id: 'awards', label: '수상/인증' },
    { id: 'branches', label: '본점/지점 안내' },
    { id: 'customers', label: '주요 고객' },
    { id: 'ci', label: 'CI가이드' },
  ];

  // 연혁 탭 노출 여부에 따라 탭 필터링
  const filteredTabItems = tabItems.filter(tab => {
    if (tab.id === 'history') return historyExposed;
    return true;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await get<HistoryResponse>(API_ENDPOINTS.HISTORY);

        if (response.error) {
          // API 에러 시 연혁 탭만 숨김 (페이지 에러로 처리하지 않음)
          setHistoryExposed(false);
        } else if (response.data) {
          if (response.data.data && response.data.isExposed) {
            setData(response.data.data);
            setHistoryExposed(true);
          } else {
            setHistoryExposed(false);
          }
        }
      } catch (err) {
        // 에러 시 연혁 탭만 숨김
        setHistoryExposed(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setAwardsLoading(true);
        const response = await get<AwardResponse>(API_ENDPOINTS.AWARDS_ALL);

        if (response.error) {
          setAwardsError(response.error);
        } else if (response.data) {
          // 연도별로 정렬 (최신순)
          const sorted = [...response.data].sort((a, b) => b.year - a.year);
          setAwardsData(sorted);
        } else {
          setAwardsError('데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        setAwardsError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setAwardsLoading(false);
      }
    };

    fetchAwards();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setCustomersLoading(true);
        const response = await get<{ items: Array<{ id: number; logo: { id: number; url: string }; displayOrder: number; isMainExposed: boolean; isExposed: boolean; websiteUrl: string | null }>; total: number; page: number; limit: number }>(`${API_ENDPOINTS.KEY_CUSTOMERS}?page=1&limit=20`);

        if (response.error) {
          setCustomersError(response.error);
        } else if (response.data && response.data.items) {
          setCustomersData(response.data.items);
        } else {
          setCustomersError('데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        setCustomersError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setCustomersLoading(false);
      }
    };

    if (activeTab === 'customers') {
      fetchCustomers();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchesLoading(true);
        const response = await get<BranchResponse>(`${API_ENDPOINTS.BRANCHES}?page=1&limit=20`);

        if (response.error) {
          setBranchesError(response.error);
        } else if (response.data && response.data.items) {
          setBranchesData(response.data.items);
        } else {
          setBranchesError('데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        setBranchesError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setBranchesLoading(false);
      }
    };

    if (activeTab === 'branches') {
      fetchBranches();
    }
  }, [activeTab]);

  // Naver Map 초기화
  useEffect(() => {
    // branchesLoading이 true이면 아직 DOM에 지도 요소가 없으므로 대기
    if (activeTab !== 'branches' || branchesData.length === 0 || branchesLoading || typeof window === 'undefined') {
      return;
    }

    // 인증 실패 처리 함수 설정 (공식 문서 권장)
    (window as any).navermap_authFailure = function () {
      console.error('네이버 지도 API 인증이 실패했습니다. 클라이언트 아이디와 웹 서비스 URL을 확인해 주세요.');
    };

    let mapInstance: any = null;
    let checkInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const initMap = () => {
      try {
        const mapElement = document.getElementById('naver-map');
        if (!mapElement) {
          console.warn('네이버 지도 컨테이너를 찾을 수 없습니다.');
          return;
        }

        // 이미 지도가 초기화되어 있으면 제거
        if (mapInstance) {
          return;
        }

        // Naver Maps API가 로드되었는지 확인
        if (!(window as any).naver || !(window as any).naver.maps) {
          console.warn('네이버 지도 API가 로드되지 않았습니다.');
          return;
        }

        // 좌표가 있는 지점들만 필터링 (문자열을 숫자로 변환)
        const branchesWithCoords = branchesData
          .filter(branch => branch.latitude !== null && branch.longitude !== null)
          .map(branch => ({
            ...branch,
            lat: typeof branch.latitude === 'string' ? parseFloat(branch.latitude) : branch.latitude,
            lng: typeof branch.longitude === 'string' ? parseFloat(branch.longitude) : branch.longitude,
          }))
          .filter(branch => !isNaN(branch.lat!) && !isNaN(branch.lng!));

        let center: any;
        if (branchesWithCoords.length === 0) {
          // 좌표가 없으면 기본 위치 (서울 시청)
          center = new (window as any).naver.maps.LatLng(37.5665, 126.9780);
        } else {
          // 모든 지점의 중심점 계산
          const avgLat = branchesWithCoords.reduce((sum, b) => sum + (b.lat || 0), 0) / branchesWithCoords.length;
          const avgLng = branchesWithCoords.reduce((sum, b) => sum + (b.lng || 0), 0) / branchesWithCoords.length;
          center = new (window as any).naver.maps.LatLng(avgLat, avgLng);
        }

        // 지도 생성
        mapInstance = new (window as any).naver.maps.Map('naver-map', {
          center: center,
          zoom: branchesWithCoords.length > 1 ? 11 : 15,
        });

        // 커스텀 마커 생성 함수 (말풍선 스타일)
        const createCustomMarkerContent = (name: string) => {
          return `
            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              background: white;
              border-radius: 24px;
              padding: 10px 16px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
              white-space: nowrap;
              position: relative;
            ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#E53935"/>
              </svg>
              <span style="
                font-family: 'Pretendard', sans-serif;
                font-size: 15px;
                font-weight: 600;
                color: #222;
              ">${name}</span>
              <div style="
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid white;
              "></div>
            </div>
          `;
        };

        // 마커 추가 (커스텀 말풍선 스타일)
        branchesWithCoords.forEach((branch) => {
          if (branch.lat && branch.lng) {
            const marker = new (window as any).naver.maps.Marker({
              position: new (window as any).naver.maps.LatLng(branch.lat, branch.lng),
              map: mapInstance,
              title: branch.name,
              icon: {
                content: createCustomMarkerContent(branch.name),
                anchor: new (window as any).naver.maps.Point(100, 50),
              },
            });
          }
        });
      } catch (error) {
        console.error('네이버 지도 초기화 중 오류가 발생했습니다:', error);
      }
    };

    // 전역 callback 함수 설정 (공식 문서 권장 방식)
    (window as any).initNaverMap = function () {
      // 약간의 지연을 두고 초기화 (DOM이 완전히 렌더링될 때까지 대기)
      setTimeout(() => {
        initMap();
      }, 100);
    };

    // Naver Maps API가 이미 로드되어 있는지 확인
    const checkNaverAPI = () => {
      if ((window as any).naver && (window as any).naver.maps) {
        // 이미 로드되어 있으면 즉시 초기화
        setTimeout(() => {
          initMap();
        }, 100);

        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        return true;
      }
      return false;
    };

    // 즉시 확인 (스크립트가 이미 로드된 경우)
    if (!checkNaverAPI()) {
      // API가 아직 로드되지 않았으면 callback 함수가 호출될 때까지 대기
      // callback이 호출되면 initNaverMap이 실행되어 initMap이 호출됨
      checkInterval = setInterval(() => {
        checkNaverAPI();
      }, 100);

      // 10초 후 타임아웃
      timeoutId = setTimeout(() => {
        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
        console.warn('네이버 지도 API 로드 타임아웃');
      }, 10000);
    }

    // cleanup 함수
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // 지도 인스턴스는 유지 (탭 전환 시에도 지도가 유지되도록)
    };
  }, [activeTab, branchesData, branchesLoading]);

  const formatMonth = (item: HistoryItem): string => {
    // month 값을 사용하여 월만 표시
    const month = item.month.toString().padStart(2, '0');
    return month;
  };

  // content에서 \n으로 구분된 항목들을 배열로 변환
  const parseContentItems = (content: string): string[] => {
    return content.split('\n').filter(item => item.trim() !== '');
  };

  // URL에 http/https가 없으면 https:// 추가
  const formatUrl = (url: string | null): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  if (loading) {
    return (
      <>
        <SEO menuName="회사소개" />
        <div className={styles.page}>
          <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true} />
          <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          <div className={styles.loading}>Loading...</div>
        </div>
      </>
    );
  }

  // 연혁 데이터가 없어도 다른 탭은 정상 작동해야 하므로 에러 페이지 제거
  // 연혁 탭은 historyExposed에 따라 자동으로 숨겨짐

  // 연도별로 그룹화하고 내림차순 정렬
  const sortedData = data.length > 0 ? [...data].sort((a, b) => b.year - a.year) : [];

  return (
    <>
      <SEO menuName="회사소개" />
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        <div className={styles.container}>
          <div className={styles.pageHeaderWrapper}>
            <PageHeader
              title="모두 소개"
              breadcrumbs={[{ label: '모두 소개' }]}
            />
          </div>

          <div className={styles.tabSection}>
            <Tab
              items={filteredTabItems}
              activeId={activeTab}
              onChange={(tabId) => {
                setActiveTab(tabId);
                // URL 쿼리 파라미터 업데이트 (브라우저 히스토리에 추가하지 않음)
                router.replace(`/history?tab=${tabId}`, undefined, { shallow: true });
              }}
              style="box"
              size="large"
              showActiveDot={true}
            />
          </div>

          {activeTab === 'intro' && (
            <>
              <div className={styles.introPhilosophySection}>
                <div className={styles.introPhilosophyBackground}>
                  <img
                    src={cardImages[activeCard]}
                    alt="Background"
                    className={styles.introPhilosophyBgImage}
                  />
                  <div className={styles.introPhilosophyOverlay} />
                </div>
                <div className={styles.introPhilosophyContent}>
                  <div className={styles.introPhilosophyLeft}>
                    <p className={styles.introPhilosophyLabel}>(회사 철학)</p>
                    <div className={styles.introPhilosophyTitle}>
                      <h2>CORPORATE</h2>
                      <h2>PHILOSOPHY</h2>
                    </div>
                    {/* Mobile: Swipe area containing image and description */}
                    <div
                      className={styles.introPhilosophySwipeArea}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <div className={styles.introPhilosophyMobileImage}>
                        <img src={cardImages[activeCard]} alt={cardContents[activeCard].title} />
                      </div>
                      <div className={styles.introPhilosophyDescription}>
                        <h3 className={styles.introPhilosophySubtitle}>{cardContents[activeCard].title}</h3>
                        <div className={styles.introPhilosophyText}>
                          {cardContents[activeCard].content}
                        </div>
                      </div>
                    </div>
                    {/* Desktop: Description only (not in swipe area) */}
                    <div className={styles.introPhilosophyDescriptionDesktop}>
                      <h3 className={styles.introPhilosophySubtitle}>{cardContents[activeCard].title}</h3>
                      <div className={styles.introPhilosophyText}>
                        {cardContents[activeCard].content}
                      </div>
                    </div>
                    {/* Mobile: Pagination dots */}
                    <div className={styles.introPhilosophyPagination}>
                      <div
                        className={`${styles.introPhilosophyPaginationDot} ${activeCard === 'professionalism' ? styles.active : ''}`}
                        onClick={() => setActiveCard('professionalism')}
                      />
                      <div
                        className={`${styles.introPhilosophyPaginationDot} ${activeCard === 'consulting' ? styles.active : ''}`}
                        onClick={() => setActiveCard('consulting')}
                      />
                      <div
                        className={`${styles.introPhilosophyPaginationDot} ${activeCard === 'trust' ? styles.active : ''}`}
                        onClick={() => setActiveCard('trust')}
                      />
                    </div>
                  </div>
                  <div className={styles.introPhilosophyRight}>
                    <div
                      className={`${styles.introPhilosophyCard} ${activeCard === 'professionalism' ? styles.introPhilosophyCardActive : styles.introPhilosophyCardInactive}`}
                      onClick={() => setActiveCard('professionalism')}
                    >
                      <p className={styles.introPhilosophyCardLabel}>전문성</p>
                      <div className={styles.introPhilosophyCardImage}>
                        <img src="/images/intro/meeting.jpg" alt="Professionalism" />
                      </div>
                    </div>
                    <div
                      className={`${styles.introPhilosophyCard} ${activeCard === 'consulting' ? styles.introPhilosophyCardActive : styles.introPhilosophyCardInactive}`}
                      onClick={() => setActiveCard('consulting')}
                    >
                      <p className={styles.introPhilosophyCardLabel}>통합 컨설팅</p>
                      <div className={styles.introPhilosophyCardImage}>
                        <img src="/images/intro/building.jpg" alt="Integrated Consulting" />
                      </div>
                    </div>
                    <div
                      className={`${styles.introPhilosophyCard} ${activeCard === 'trust' ? styles.introPhilosophyCardActive : styles.introPhilosophyCardInactive}`}
                      onClick={() => setActiveCard('trust')}
                    >
                      <p className={styles.introPhilosophyCardLabel}>동행과 신뢰</p>
                      <div className={styles.introPhilosophyCardImage}>
                        <img src="/images/intro/hands-together.jpg" alt="Trust and Partnership" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.introMessageSection}>
                <div className={styles.introMessageTitle}>
                  <h2>MESSAGE</h2>
                  <h2>FROM THE CEO</h2>
                </div>
                <div className={styles.introMessageContent}>
                  <div className={styles.introMessageCard}>
                    <div className={styles.introMessageLeft}>
                      <h3 className={styles.introMessageGreeting}>
                        고객 여러분의<br />
                        행복한 사업장과<br />
                        든든한 가정을 위해<br />
                        함께하겠습니다.
                      </h3>
                      <div className={styles.introMessageSignature}>
                        <p>세무법인 함께</p>
                        <img src="/images/intro/signature.png" alt="Signature" className={styles.introSignatureImage} />
                      </div>
                    </div>
                    <div className={styles.introMessageDivider} />
                    <div className={styles.introMessageRight}>
                      <div className={styles.introMessageText}>
                        <p>
                          <strong>안녕하세요.</strong>
                          <br />
                          변화하는 환경 속에서도 사업장과 가정에서 각자의 자리에서 최선을 다하고 계신 고객 여러분의 <strong>지속적인 발전과 행복</strong>을 진심으로 기원드립니다.
                          <br />
                          세무법인 함께는 <strong>"고객의 입장에서, 마치 내 회사와 내 가정이라면 어떻게 결정할까"</strong>라는 마음으로 항상 최선의 해결책을 고민하고 실천하고 있습니다.
                          <br />
                          <br />
                          어떠한 상황에서도 변함없는 진심으로, 고객 여러분의 <strong>행복한 사업장과 든든한 가정</strong>을 위해 함께하겠습니다.
                          <br />
                          앞으로도 고객 곁에서 믿음직한 동반자로 함께 성장해 나가겠습니다.
                          <br />
                          감사합니다.
                          <br />
                          <br />
                        </p>
                        <p>
                          <strong>세무법인 함께</strong>
                          <br />
                          대표이사 <strong>최영우</strong> 드림
                        </p>
                      </div>
                      <div className={styles.introMessageDivider2} />
                      <div className={styles.introMessageText}>
                        <p>
                          <strong>Greetings,</strong>
                          <br />
                          In today's ever-changing environment, we extend our sincere wishes for the continued growth and prosperity of all our valued clients, who dedicate themselves wholeheartedly to both their businesses and families.
                          <br />
                          <strong>At Hamhke Tax Corporation</strong>, we uphold the principle of serving our clients with the utmost sincerity — always asking ourselves, "If this were my own company or my own family, how would I think, decide, and act?"
                          <br />
                          <br />
                          Guided by this philosophy, we remain steadfast in our commitment to providing thoughtful, professional, and reliable services that <strong>contribute to the happiness and success of our clients.</strong>
                          <br />
                          We pledge to stand beside you at all times, as a trusted and enduring partner on your journey toward sustainable growth and stability.
                          <br />
                          Thank you for your continued trust and confidence.
                          <br />
                          <br />
                        </p>
                        <p>
                          <strong>세무법인 함께</strong>
                          <br />
                          Chief Executive Officer
                          <br />
                          <strong>Hamhke Tax Corporation</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <>
              <div className={styles.historyHero}>
                <img
                  src="/images/history/hero/history-hero.jpg"
                  alt="History"
                  className={styles.historyHeroImage}
                />
                <div className={styles.historyHeroOverlay} />
                <p className={styles.historyHeroLabel}>(연혁)</p>
                <h2 className={styles.historyHeroTitle}>HISTORY</h2>
                <div className={styles.historyHeroContent}>
                  <p className={styles.historyHeroDescription}>
                    세무법인 함께는 전문성 세무 서비스로<br />
                    지속 성장을 함께 만들어갑니다.
                  </p>
                </div>
              </div>

              <div className={styles.spacer} />
            </>
          )}

          {activeTab === 'history' && (
            <div className={styles.content}>
              <div className={styles.leftSection}>
                <div className={styles.leftSectionImage}>
                  <img
                    src="/images/history/backgrounds/history-left.jpg"
                    alt="History Background"
                    className={styles.leftSectionImageBg}
                  />
                  <div className={styles.titleSection}>
                    <h2 className={styles.titleMain}>THE HISTORY</h2>
                    <h2 className={styles.titleSub}>OF MODOO</h2>
                  </div>
                </div>
              </div>

              <div className={styles.rightSection}>
                {sortedData.map((yearData, yearIndex) => {
                  // 각 연도의 항목들을 그대로 사용
                  const sortedItems = yearData.items;

                  // 월별로 그룹화
                  const groupedByMonth = sortedItems.reduce((acc, item) => {
                    const monthKey = formatMonth(item);
                    if (!acc[monthKey]) {
                      acc[monthKey] = [];
                    }
                    acc[monthKey].push(item);
                    return acc;
                  }, {} as Record<string, HistoryItem[]>);

                  const monthGroups = Object.entries(groupedByMonth);

                  return (
                    <div key={yearData.year} className={styles.yearGroup}>
                      <h3 className={styles.yearTitle}>{yearData.year}</h3>

                      {monthGroups.map(([month, items], monthIndex) => {
                        // 해당 월의 모든 content를 \n으로 분리하여 평탄화
                        const allContentItems: { id: number; content: string; isFirst: boolean }[] = [];
                        items.forEach((item, itemIdx) => {
                          const contentParts = parseContentItems(item.content);
                          contentParts.forEach((part, partIdx) => {
                            allContentItems.push({
                              id: item.id,
                              content: part,
                              isFirst: itemIdx === 0 && partIdx === 0,
                            });
                          });
                        });

                        return (
                          <div key={month} className={styles.dateGroup}>
                            {allContentItems.map((contentItem, contentIndex) => (
                              <div key={`${contentItem.id}-${contentIndex}`} className={styles.historyItem}>
                                {contentIndex === 0 && (
                                  <div className={styles.date}>{month}</div>
                                )}
                                {contentIndex > 0 && (
                                  <div className={styles.date}></div>
                                )}
                                <div className={styles.contentWrapper}>
                                  <img
                                    src="/images/history/icons/ellipse-2808.svg"
                                    alt=""
                                    className={styles.dotIcon}
                                  />
                                  <div className={styles.contentText}>{contentItem.content}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}

                      <div className={styles.divider}></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'awards' && (
            <div className={styles.awardsSection}>
              {/* Mobile Header */}
              <div className={styles.awardsMobileHeader}>
                <h2 className={styles.awardsMobileTitle}>AWARDS</h2>
                <p className={styles.awardsMobileSubtitle}>수상/인증</p>
              </div>
              {/* Desktop Header */}
              <div className={styles.awardsTitleSection}>
                <h2 className={styles.awardsMainTitle}>AWARDS &</h2>
              </div>
              <div className={styles.awardsContent}>
                <div className={styles.awardsSidebar}>
                  <h3 className={styles.awardsSidebarTitle}>수상/인증</h3>
                </div>
                <div className={styles.awardsList}>
                  {awardsLoading ? (
                    <div className={styles.loading}>
                      <p>로딩 중...</p>
                    </div>
                  ) : awardsError ? (
                    <div className={styles.error}>
                      <p>{awardsError}</p>
                    </div>
                  ) : awardsData.length === 0 ? (
                    <div className={styles.loading}>
                      <p>수상/인증 데이터가 없습니다.</p>
                    </div>
                  ) : (
                    awardsData.map((yearData, index) => {
                      const sortedItems = yearData.items;

                      if (sortedItems.length === 0) return null;

                      return (
                        <div key={yearData.year} className={styles.awardsYearGroup}>
                          {/* Divider above each year section */}
                          <div className={styles.awardsYearDivider} />
                          <div className={`${styles.awardsYearTitle} ${index === 0 ? styles.awardsYearTitleFirst : ''}`}>
                            <h3>{yearData.year}</h3>
                          </div>
                          <div className={styles.awardsYearItems}>
                            {sortedItems.map((item) => (
                              <div key={item.id} className={styles.awardCard}>
                                <div className={styles.awardCardImage}>
                                  <div className={styles.awardCardImageBg} />
                                  <div className={styles.awardCardImageContent}>
                                    <img
                                      src={item.image.url}
                                      alt={item.name}
                                      className={styles.awardCardImageInner}
                                    />
                                  </div>
                                </div>
                                <div className={styles.awardCardInfo}>
                                  <p className={styles.awardCardCategory}>{item.source}</p>
                                  <p className={styles.awardCardName}>{item.name}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ci' && (
            <>
              <div className={styles.ciHeroSection}>
                <div className={styles.ciHeroBackground}>
                  <img
                    src="/images/ci/9844a29d90ae507ab287ea64f6569520850a850a.jpg"
                    alt="CI Guide Background"
                    className={styles.ciHeroImage}
                  />
                  <div className={styles.ciHeroOverlay} />
                </div>
                <p className={styles.ciHeroLabel}>(CI 가이드)</p>
                <div className={styles.ciHeroTitle}>
                  <h2 className={styles.ciHeroTitleItalic}>CI</h2>
                  <h2 className={styles.ciHeroTitleRegular}>GUIDE</h2>
                </div>
                <div className={styles.ciHeroContent}>
                </div>
              </div>

              <div className={styles.ciContentSection}>
                <div className={styles.ciColorGuideSection}>
                  <div className={styles.ciColorGuideHeader}>
                    <div className={styles.ciColorGuideLogo}>
                      <a
                        href="/images/logo/logo-hd_w.png"
                        download="modoo-logo-horizontal-white.png"
                        className={styles.ciColorGuideLogoLink}
                        title="로고 다운로드 (가로형 화이트)"
                      >
                        <img src="/images/logo/logo-hd_w.png" alt="MODOO CONSULTING Logo" className={styles.ciColorGuideLogoImage} />
                      </a>
                    </div>
                    <div className={styles.ciColorGuideDivider} />
                    <p className={styles.ciColorGuideText}>
                      세무법인 함께 컬러는,<br />
                      <span className={styles.ciColorGuideHighlight}>신뢰</span>, <span className={styles.ciColorGuideHighlight}>전문성</span>, <span className={styles.ciColorGuideHighlight}>안정감</span>을 상징합니다.
                    </p>
                  </div>
                  <div className={styles.ciColorGuideItemsDivider} />
                  <div className={styles.ciColorGuideItems}>
                    <div className={styles.ciColorGuideItem}>
                      <div className={styles.ciColorGuideIcon}>
                        <img src="/images/ci/trust.svg" alt="Trust" />
                      </div>
                      <div className={styles.ciColorGuideItemContent}>
                        <h3 className={styles.ciColorGuideItemTitle}>신뢰</h3>
                        <p className={styles.ciColorGuideItemSubtitle}>Trust</p>
                      </div>
                      <p className={styles.ciColorGuideItemDescription}>
                        풍부한 경험과 체계적인 분석으로<br />
                        정확한 해결책을 제시합니다.<br />
                        세무, 회계, 재무를 아우르는 통합 전문성으로<br />
                        고객의 비즈니스에 실질적인 가치를 더합니다.
                      </p>
                    </div>
                    <div className={styles.ciColorGuideDividerVertical} />
                    <div className={styles.ciColorGuideItem}>
                      <div className={styles.ciColorGuideIcon}>
                        <img src="/images/ci/work.svg" alt="Expertise" />
                      </div>
                      <div className={styles.ciColorGuideItemContent}>
                        <h3 className={styles.ciColorGuideItemTitle}>전문성</h3>
                        <p className={styles.ciColorGuideItemSubtitle}>Expertise</p>
                      </div>
                      <p className={styles.ciColorGuideItemDescription}>
                        풍부한 경험과 체계적인 분석으로<br />
                        정확한 해결책을 제시합니다.<br />
                        세무, 회계, 재무를 아우르는 통합 전문성으로<br />
                        고객의 비즈니스에 실질적인 가치를 더합니다.
                      </p>
                    </div>
                    <div className={styles.ciColorGuideDividerVertical} />
                    <div className={styles.ciColorGuideItem}>
                      <div className={styles.ciColorGuideIcon}>
                        <img src="/images/ci/leaves.svg" alt="Stability" />
                      </div>
                      <div className={styles.ciColorGuideItemContent}>
                        <h3 className={styles.ciColorGuideItemTitle}>안정감</h3>
                        <p className={styles.ciColorGuideItemSubtitle}>Stability</p>
                      </div>
                      <p className={styles.ciColorGuideItemDescription}>
                        변화하는 세법 속에서도 일관된 관리와<br />
                        지속 가능한 지원을 제공합니다.<br />
                        고객의 현재를 지키고,<br />
                        미래의 불안을 덜어주는 든든한 버팀목이 됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.ciCardsWrapper}>
                  <div className={styles.ciLogoSection}>
                    <div className={styles.ciSectionHeader}>
                      <h3 className={styles.ciSectionTitle}>로고</h3>
                      <div className={styles.ciSectionDivider} />
                      <div className={styles.ciLogoItems}>
                        <div className={styles.ciLogoItem}>
                          <a
                            href="/images/logo/logo-hd.png"
                            download="modoo-logo-horizontal.png"
                            className={styles.ciLogoDownloadLink}
                            title="로고 다운로드 (가로형)"
                          >
                            <div className={styles.ciLogoBox}>
                              <img src="/images/logo/logo-hd.png" alt="Logo Horizontal" className={styles.ciLogoImage} />
                            </div>
                          </a>
                        </div>
                        <div className={styles.ciLogoItem}>
                          <a
                            href="/images/logo/logo_s.png"
                            download="modoo-logo-vertical.png"
                            className={styles.ciLogoDownloadLink}
                            title="로고 다운로드 (세로형)"
                          >
                            <div className={styles.ciLogoBox}>
                              <img src="/images/logo/logo_s.png" alt="Logo Vertical" className={styles.ciLogoImage} />
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.ciColorPaletteSection}>
                    <div className={styles.ciSectionHeader}>
                      <h3 className={styles.ciSectionTitle}>컬러</h3>
                      <div className={styles.ciSectionDivider} />
                      <div className={styles.ciColorPaletteItems}>
                        <div className={styles.ciColorPaletteItem}>
                          <div className={styles.ciColorPaletteBox} style={{ background: 'linear-gradient(to left, #f39293 0%, #d23a39 50%, #bd2524 100%)' }}>
                            <p className={styles.ciColorPaletteName}>Modoo Red</p>
                            <div className={styles.ciColorPaletteInfo}>
                              <div className={styles.ciColorPaletteInfoRow}>
                                <span className={styles.ciColorPaletteInfoLabel}>RGB</span>
                                <span className={styles.ciColorPaletteInfoValue}>189 / 37 / 36</span>
                              </div>
                              <div className={styles.ciColorPaletteInfoRow}>
                                <span className={styles.ciColorPaletteInfoLabel}>CMYK</span>
                                <span className={styles.ciColorPaletteInfoValue}>0 / 100 / 100 / 26</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.ciColorPaletteItem}>
                          <div className={styles.ciColorPaletteBox} style={{ backgroundColor: '#7a7a7a' }}>
                            <p className={styles.ciColorPaletteName}>Gray</p>
                            <div className={styles.ciColorPaletteInfo}>
                              <div className={styles.ciColorPaletteInfoRow}>
                                <span className={styles.ciColorPaletteInfoLabel}>RGB</span>
                                <span className={styles.ciColorPaletteInfoValue}>122 / 122 / 122</span>
                              </div>
                              <div className={styles.ciColorPaletteInfoRow}>
                                <span className={styles.ciColorPaletteInfoLabel}>CMYK</span>
                                <span className={styles.ciColorPaletteInfoValue}>0 / 0 / 0 / 52</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.ciColorPaletteItem}>
                          <div className={styles.ciColorPaletteBox} style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e4' }}>
                            <p className={styles.ciColorPaletteName} style={{ color: '#555' }}>White</p>
                            <div className={styles.ciColorPaletteInfo}>
                              <div className={styles.ciColorPaletteInfoRow}>
                                <span className={styles.ciColorPaletteInfoLabel} style={{ color: '#8e8e8e' }}>RGB</span>
                                <span className={styles.ciColorPaletteInfoValue} style={{ color: '#8e8e8e' }}>255 / 255 / 255</span>
                              </div>
                              <div className={styles.ciColorPaletteInfoRow}>
                                <span className={styles.ciColorPaletteInfoLabel} style={{ color: '#8e8e8e' }}>CMYK</span>
                                <span className={styles.ciColorPaletteInfoValue} style={{ color: '#8e8e8e' }}>0 / 0 / 0 / 0</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'branches' && (
            <>
              <div className={styles.branchesHero}>
                <div className={styles.branchesHeroOverlay} />
                <p className={styles.branchesHeroLabel}>(본점/지점 안내)</p>
                <div className={styles.branchesHeroTitle}>
                  <h2>OFFICE</h2>
                  <h2 className={styles.branchesHeroTitleItalic}>LOCATIONS</h2>
                </div>
                <div className={styles.branchesHeroContent}>
                </div>
              </div>

              <div className={styles.branchesContent}>
                {branchesLoading ? (
                  <div className={styles.loading}>
                    <p>로딩 중...</p>
                  </div>
                ) : branchesError ? (
                  <div className={styles.error}>
                    <p>{branchesError}</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.branchesMapSection}>
                      <div id="naver-map" className={styles.branchesMap} />
                    </div>

                    <div className={styles.branchesList}>
                      {branchesData.map((branch, index) => (
                        <React.Fragment key={branch.id}>
                          <div
                            className={styles.branchItem}
                            onClick={() => {
                              setSelectedBranch(branch);
                              setIsBranchModalOpen(true);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className={styles.branchHeader}>
                              <h3 className={styles.branchName}>{branch.name}</h3>
                              <div className={styles.branchSocialLinks}>
                                {branch.blogUrl && (
                                  <a href={formatUrl(branch.blogUrl)} target="_blank" rel="noopener noreferrer" className={styles.branchSocialLink}>
                                    <img src="/images/branches/icons/naver-blog.svg" alt="Naver Blog" />
                                  </a>
                                )}
                                {branch.blogUrl && (branch.youtubeUrl || branch.instagramUrl || branch.websiteUrl) && (
                                  <span className={styles.branchSocialDivider} />
                                )}
                                {branch.youtubeUrl && (
                                  <>
                                    <a href={formatUrl(branch.youtubeUrl)} target="_blank" rel="noopener noreferrer" className={styles.branchSocialLink}>
                                      <img src="/images/branches/icons/youtube.svg" alt="YouTube" />
                                    </a>
                                    {(branch.instagramUrl || branch.websiteUrl) && (
                                      <span className={styles.branchSocialDivider} />
                                    )}
                                  </>
                                )}
                                {branch.instagramUrl && (
                                  <>
                                    <a href={formatUrl(branch.instagramUrl)} target="_blank" rel="noopener noreferrer" className={styles.branchSocialLink}>
                                      <img src="/images/branches/icons/instagram.svg" alt="Instagram" />
                                    </a>
                                    {branch.websiteUrl && (
                                      <span className={styles.branchSocialDivider} />
                                    )}
                                  </>
                                )}
                                {branch.websiteUrl && (
                                  <a href={formatUrl(branch.websiteUrl)} target="_blank" rel="noopener noreferrer" className={styles.branchSocialLink}>
                                    <img src="/images/branches/icons/website.svg" alt="Website" />
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className={styles.branchAddress}>{branch.address}</div>
                            <div className={styles.branchContactInfo}>
                              {branch.phoneNumber && (
                                <div className={styles.branchContactRow}>
                                  <span className={styles.branchContactLabel}>TEL</span>
                                  <span className={styles.branchContactValue}>{branch.phoneNumber}</span>
                                </div>
                              )}
                              {branch.fax && (
                                <div className={styles.branchContactRow}>
                                  <span className={styles.branchContactLabel}>FAX</span>
                                  <span className={styles.branchContactValue}>{branch.fax}</span>
                                </div>
                              )}
                              {branch.email && (
                                <div className={styles.branchContactRow}>
                                  <span className={styles.branchContactLabel}>E-MAIL</span>
                                  <span className={styles.branchContactValue}>{branch.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {index < branchesData.length - 1 && <div className={styles.branchDivider} />}
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {activeTab === 'customers' && (
            <>
              <div className={styles.customersHero}>
                <div className={styles.customersHeroOverlay} />
                <p className={styles.customersHeroLabel}>(주요 고객)</p>
                <h2 className={styles.customersHeroTitle}>PARTNERS</h2>
                <div className={styles.customersHeroContent}>
                </div>
              </div>
              <div className={styles.customersSection}>
                {customersLoading ? (
                  <div className={styles.loading}>
                    <p>로딩 중...</p>
                  </div>
                ) : customersError ? (
                  <div className={styles.error}>
                    <p>{customersError}</p>
                  </div>
                ) : customersData.length === 0 ? (
                  <div className={styles.loading}>
                    <p>주요 고객 데이터가 없습니다.</p>
                  </div>
                ) : (
                  <div className={styles.customersGrid}>
                    {customersData.map((item) => (
                      <div key={item.id} className={styles.customerCard}>
                        <div className={styles.customerLogo}>
                          {item.websiteUrl ? (
                            <a
                              href={item.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={item.logo.url}
                                alt="Customer Logo"
                                className={styles.customerLogoImage}
                              />
                            </a>
                          ) : (
                            <img
                              src={item.logo.url}
                              alt="Customer Logo"
                              className={styles.customerLogoImage}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        <Footer />

        {/* Floating Buttons */}
        <div className={styles.floatingButtons}>
          <FloatingButton
            variant="consult"
            label="상담 신청하기"
            onClick={() => router.push('/consultation/apply')}
          />
        </div>

        {/* Branch Detail Modal */}
        <BranchDetailModal
          isOpen={isBranchModalOpen}
          onClose={() => {
            setIsBranchModalOpen(false);
            setSelectedBranch(null);
          }}
          branch={selectedBranch}
        />
      </div>
    </>
  );
};

export default HistoryPage;


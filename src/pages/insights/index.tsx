import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import { SearchField } from '@/components/common/TextField';
import FloatingButton from '@/components/common/FloatingButton';
import Card from '@/components/common/Card';
import Icon from '@/components/common/Icon';
import Tab from '@/components/common/Tab';
import { get } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import styles from './insights.module.scss';

interface InsightThumbnail {
  url: string;
}

interface InsightCategory {
  id: number;
  name: string;
  type: string;
}

interface InsightSubcategory {
  id: number;
  name: string;
  sections: string[];
  isExposed: boolean;
}

// Insights hierarchical API 응답 타입
interface InsightsHierarchicalCategory {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
  targetMemberType: 'ALL' | 'GENERAL' | 'INSURANCE' | 'OTHER';
}

interface InsightsHierarchical {
  category: InsightsHierarchicalCategory;
  subcategories: InsightSubcategory[];
}

interface InsightItem {
  id: number;
  title: string;
  content: string;
  thumbnail?: InsightThumbnail;
  category: InsightCategory;
  subcategory?: InsightSubcategory;
  enableComments: boolean;
  isExposed: boolean;
  isMainExposed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface InsightResponse {
  items: InsightItem[];
  total: number;
  page: number;
  limit: number;
  displayType?: 'gallery' | 'snippet' | 'list'; // 자료실 노출 방식
}

type CategoryFilter = 'all' | string; // 동적 서브카테고리 지원
type LibraryDisplayType = 'gallery' | 'snippet' | 'list';
type SortField = 'category' | 'author' | null;
type SortOrder = 'asc' | 'desc';

// category.type을 displayType으로 매핑
const getDisplayTypeFromCategoryType = (type: string): LibraryDisplayType => {
  switch (type) {
    case 'A': return 'gallery';
    case 'B': return 'snippet';
    case 'C': return 'list';
    default: return 'gallery';
  }
};

const InsightsPage: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(''); // 동적 탭 ID
  const [insightsHierarchical, setInsightsHierarchical] = useState<InsightsHierarchical[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  // 자료실 노출 타입 - API 응답에서 설정
  const [libraryDisplayType, setLibraryDisplayType] = useState<LibraryDisplayType>('gallery');

  // 현재 자료실 ID (URL 쿼리에서 가져옴)
  const [currentDataRoom, setCurrentDataRoom] = useState<string>('');

  // 자료실 정보 (이름 등)
  const [dataRoomName, setDataRoomName] = useState<string>('');

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

  // 카테고리 접근 가능 여부 판단
  const canAccessCategory = (targetMemberType: string): boolean => {
    // ALL은 모든 사용자 접근 가능 (비회원 포함)
    if (targetMemberType === 'ALL') return true;

    // 비로그인 사용자는 ALL만 접근 가능
    if (!currentUserType) return false;

    // 로그인 사용자는 자신의 타입과 일치하는 카테고리만 접근 가능
    return currentUserType === targetMemberType;
  };

  // Insights hierarchical 데이터 가져오기
  useEffect(() => {
    const fetchHierarchical = async () => {
      try {
        const response = await get<InsightsHierarchical[]>(
          `${API_ENDPOINTS.INSIGHTS_HIERARCHICAL}?limit=20&page=1`
        );
        if (response.data && Array.isArray(response.data)) {
          // isActive + targetMemberType 필터링
          const accessibleCategories = response.data.filter(d =>
            d.category.isActive && canAccessCategory(d.category.targetMemberType)
          );
          setInsightsHierarchical(accessibleCategories);

          // 첫 번째 카테고리를 기본 탭으로 설정 (아직 설정되지 않은 경우)
          if (accessibleCategories.length > 0 && !activeTab) {
            setActiveTab(String(accessibleCategories[0].category.id));
          }
        }
      } catch (err) {
        console.error('Failed to fetch insights hierarchical:', err);
      }
    };
    fetchHierarchical();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserType]);

  // 현재 선택된 카테고리 데이터
  const currentCategory = insightsHierarchical.find(
    d => String(d.category.id) === activeTab
  );

  // 동적 탭 목록 생성
  const tabItems = insightsHierarchical.map(d => ({
    id: String(d.category.id),
    label: d.category.name
  }));

  // 탭 변경 시 카테고리 타입에 따라 displayType 자동 설정
  useEffect(() => {
    if (currentCategory?.category.type) {
      const displayType = getDisplayTypeFromCategoryType(currentCategory.category.type);
      setLibraryDisplayType(displayType);
    }
  }, [currentCategory]);

  // API에서 데이터 가져오기
  const fetchInsights = async () => {
    if (!activeTab) return; // 탭이 설정되지 않으면 스킵

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      // 현재 선택된 탭의 카테고리 ID 사용
      params.append('categoryId', activeTab);

      const response = await get<InsightResponse>(
        `${API_ENDPOINTS.INSIGHTS}?${params.toString()}`
      );

      if (response.data) {
        const data = response.data;
        let filteredItems = data.items || [];
        
        // 클라이언트 사이드 카테고리 필터링 (API 필터링이 제대로 작동하지 않는 경우를 대비)
        // subcategory.name을 기준으로 필터링 (실제 데이터 구조에 맞춤)
        if (categoryFilter !== 'all') {
          filteredItems = filteredItems.filter((item) => {
            // subcategory가 있으면 subcategory.name을 우선 사용, 없으면 category.name 사용
            const subcategoryName = item.subcategory?.name?.toLowerCase() || '';
            const categoryName = item.category?.name?.toLowerCase() || '';
            const categoryType = item.category?.type?.toLowerCase();
            
            // 필터링할 이름 결정 (subcategory 우선)
            const filterName = subcategoryName || categoryName;
            
            if (categoryFilter === 'industry') {
              // 업종별: subcategory.name 또는 category.name에 업종이 포함되고, 컨설팅이 아닌 경우
              return filterName.includes('업종') && !filterName.includes('컨설팅');
            } else if (categoryFilter === 'consulting') {
              // 컨설팅: subcategory.name 또는 category.name에 컨설팅이 포함되고, 업종별이 아닌 경우
              return filterName.includes('컨설팅') && !filterName.includes('업종');
            }
            return true;
          });
        }
        
        // 클라이언트 사이드 검색 필터링 (API가 검색을 지원하지 않는 경우를 대비)
        if (searchQuery && searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase();
          filteredItems = filteredItems.filter((item) =>
            item.title.toLowerCase().includes(query)
          );
        }
        
        setInsights(filteredItems);
        setTotal(filteredItems.length);
        // totalPages 계산
        const limit = data.limit || 20;
        const calculatedTotalPages = Math.ceil(filteredItems.length / limit);
        setTotalPages(calculatedTotalPages);
      }
    } catch (err) {
      console.error('Failed to fetch insights:', err);
      setError('데이터를 불러오는데 실패했습니다.');
      setInsights([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // URL 쿼리 파라미터 처리
  useEffect(() => {
    if (router.isReady && insightsHierarchical.length > 0) {
      const { category } = router.query;

      // 카테고리 ID로 탭 설정
      if (typeof category === 'string') {
        const found = insightsHierarchical.find(d => String(d.category.id) === category);
        if (found) {
          setActiveTab(category);
        }
      } else if (!activeTab && insightsHierarchical.length > 0) {
        // 쿼리 파라미터가 없으면 첫 번째 탭 선택
        setActiveTab(String(insightsHierarchical[0].category.id));
      }
    }
  }, [router.isReady, router.query, insightsHierarchical]);

  useEffect(() => {
    if (router.isReady) {
      fetchInsights();
    }
  }, [router.isReady, activeTab, categoryFilter, currentPage, searchQuery, currentDataRoom]);

  // 검색 핸들러 (Enter 키 또는 검색 버튼 클릭 시)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 검색 시 첫 페이지로
  };

  // 검색어 변경 핸들러 (실시간 입력)
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // 검색어가 비어있으면 즉시 검색 (필터 초기화)
    if (value === '') {
      setCurrentPage(1);
    }
  };

  // 정렬 핸들러
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // 같은 필드를 클릭하면 정렬 순서 변경
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 다른 필드를 클릭하면 해당 필드로 오름차순 정렬
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 정렬된 insights 가져오기
  const getSortedInsights = () => {
    if (!sortField) return insights;

    return [...insights].sort((a, b) => {
      let aValue: string = '';
      let bValue: string = '';

      if (sortField === 'category') {
        aValue = typeof a.subcategory?.name === 'string' 
          ? a.subcategory.name 
          : (typeof a.category?.name === 'string' ? a.category.name : '');
        bValue = typeof b.subcategory?.name === 'string' 
          ? b.subcategory.name 
          : (typeof b.category?.name === 'string' ? b.category.name : '');
      } else if (sortField === 'author') {
        // 현재 작성자명이 하드코딩되어 있어서 실제로는 정렬이 안되지만,
        // API에서 author 정보가 오면 여기서 처리
        aValue = '작성자명';
        bValue = '작성자명';
      }

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };

  // 탭 변경 핸들러
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setCategoryFilter('all');
    setSearchQuery('');

    // URL 업데이트 - category 파라미터 사용
    router.push(`/insights?category=${tabId}`, undefined, { shallow: true });
  };

  // 카테고리 필터 변경 핸들러
  const handleCategoryChange = (category: CategoryFilter) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 게시물 클릭 핸들러
  const handleItemClick = (id: number) => {
    router.push(`/insights/${id}`);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 브레드크럼 아이템
  const breadcrumbs = [
    { label: '인사이트' }
  ];

  // tabItems는 상단에서 동적으로 생성됨 (insightsHierarchical에서)

  return (
    <div className={styles.insightsPage}>
      <Header
        variant="transparent"
        onMenuClick={() => setIsMenuOpen(true)}
      />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.pageHeaderWrapper}>
            <PageHeader
              title="인사이트"
              breadcrumbs={breadcrumbs}
              tabs={tabItems}
              activeTabId={activeTab}
              onTabChange={handleTabChange}
              size="web"
            />
          </div>

          <div className={styles.mainContent}>
          {/* 모바일 탭 섹션 */}
          <div className={styles.mobileTabSection}>
            <Tab
              items={tabItems}
              activeId={activeTab}
              onChange={handleTabChange}
              style="box"
              size="large"
              showActiveDot={true}
            />
          </div>

          {currentCategory && (
            <>
              <div className={styles.columnTitleSection}>
                <h2 className={styles.columnTitle}>{currentCategory.category.name.toUpperCase()}</h2>
                <p className={styles.columnSubtitle}>{currentCategory.category.name}</p>
              </div>

              {/* 모바일 검색 섹션 */}
              <div className={styles.mobileSearchSection}>
                <SearchField
                  placeholder="제목을 입력해주세요"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onSearch={handleSearch}
                  fullWidth
                />
              </div>

              {/* 모바일 카테고리 탭 - 동적 렌더링 */}
              <div className={styles.mobileCategoryTabs}>
                <button
                  className={`${styles.mobileCategoryTab} ${categoryFilter === 'all' ? styles.mobileCategoryTabActive : ''}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  {categoryFilter === 'all' && <span className={styles.mobileCategoryDot} />}
                  전체
                </button>
                {currentCategory?.subcategories
                  .filter(sub => sub.isExposed)
                  .map((subcategory) => (
                    <button
                      key={subcategory.id}
                      className={`${styles.mobileCategoryTab} ${categoryFilter === subcategory.name ? styles.mobileCategoryTabActive : ''}`}
                      onClick={() => handleCategoryChange(subcategory.name as CategoryFilter)}
                    >
                      {categoryFilter === subcategory.name && <span className={styles.mobileCategoryDot} />}
                      {subcategory.name}
                    </button>
                  ))}
              </div>

              {/* 모바일 게시물 수 */}
              <div className={styles.mobileCount}>
                <span>총 </span>
                <span className={styles.mobileCountNumber}>{total}</span>
                <span>개의 게시물이 있습니다</span>
              </div>

              <div className={styles.columnContent}>
                <div className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>{currentCategory.category.name}</h2>
                <nav className={styles.categoryNav}>
                  <button
                    className={`${styles.categoryItem} ${categoryFilter === 'all' ? styles.categoryItemActive : ''}`}
                    onClick={() => handleCategoryChange('all')}
                  >
                    {categoryFilter === 'all' && <span className={styles.activeDot} />}
                    <span>전체</span>
                  </button>
                  {/* 서브카테고리 동적 렌더링 */}
                  {currentCategory?.subcategories
                    .filter(sub => sub.isExposed)
                    .map((subcategory) => (
                      <button
                        key={subcategory.id}
                        className={`${styles.categoryItem} ${categoryFilter === subcategory.name ? styles.categoryItemActive : ''}`}
                        onClick={() => setCategoryFilter(subcategory.name as CategoryFilter)}
                      >
                        {categoryFilter === subcategory.name && <span className={styles.activeDot} />}
                        <span>{subcategory.name}</span>
                      </button>
                    ))}
                </nav>
              </div>

              <div className={styles.mainSection}>
                <div className={styles.toolbar}>
                  <div className={styles.count}>
                    <span>총 </span>
                    <span className={styles.countNumber}>{total}</span>
                    <span> 개의 게시물이 있습니다</span>
                  </div>
                  <div className={styles.searchWrapper}>
                    <SearchField
                      placeholder="제목을 입력해주세요"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onSearch={handleSearch}
                      fullWidth
                    />
                  </div>
                </div>

                {libraryDisplayType !== 'list' && <div className={styles.divider} />}

                {loading ? (
                  <div className={styles.loading}>로딩 중...</div>
                ) : error ? (
                  <div className={styles.error}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <p>{error}</p>
                  </div>
                ) : insights.length === 0 ? (
                  <div className={styles.empty}>
                    <img
                      src="/images/insights/empty-icon.svg"
                      alt="빈 상태"
                      className={styles.emptyIcon}
                    />
                    <p>등록된 게시글이 없습니다.</p>
                  </div>
                ) : (
                  <>
                    {/* gallery 타입 (A) - 카드 그리드 */}
                    {libraryDisplayType === 'gallery' && (
                      <>
                        {/* 데스크톱 그리드 */}
                        <div className={styles.desktopGrid}>
                          {insights.map((item) => {
                            const plainContent = item.content
                              .replace(/```[\s\S]*?```/g, '')
                              .replace(/#{1,6}\s+/g, '')
                              .replace(/\*\*([^*]+)\*\*/g, '$1')
                              .replace(/\*([^*]+)\*/g, '$1')
                              .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                              .trim();

                            return (
                              <Card
                                key={item.id}
                                variant="column3"
                                size="web"
                                title={item.title}
                                imageUrl={item.thumbnail?.url}
                                category={typeof item.subcategory?.name === 'string' ? item.subcategory.name : (typeof item.category?.name === 'string' ? item.category.name : '카테고리명')}
                                description={plainContent.length > 150
                                  ? `${plainContent.substring(0, 150)}...`
                                  : plainContent}
                                author="작성자명"
                                date={item.createdAt ? formatDate(item.createdAt) : ''}
                                onClick={() => handleItemClick(item.id)}
                                className={item.isMainExposed ? styles.featuredCard : ''}
                              />
                            );
                          })}
                        </div>

                        {/* 모바일 세로형 리스트 */}
                        <div className={styles.mobileCardList}>
                          {insights.map((item) => {
                            const plainContent = item.content
                              .replace(/```[\s\S]*?```/g, '')
                              .replace(/#{1,6}\s+/g, '')
                              .replace(/\*\*([^*]+)\*\*/g, '$1')
                              .replace(/\*([^*]+)\*/g, '$1')
                              .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                              .trim();

                            return (
                              <Card
                                key={item.id}
                                variant="column3"
                                size="web"
                                title={item.title}
                                imageUrl={item.thumbnail?.url}
                                category={typeof item.subcategory?.name === 'string' ? item.subcategory.name : (typeof item.category?.name === 'string' ? item.category.name : '카테고리명')}
                                description={plainContent.length > 150
                                  ? `${plainContent.substring(0, 150)}...`
                                  : plainContent}
                                author="작성자명"
                                date={item.createdAt ? formatDate(item.createdAt) : ''}
                                onClick={() => handleItemClick(item.id)}
                                className={item.isMainExposed ? styles.featuredCard : ''}
                              />
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* snippet 타입 (B) - 가로형 카드 리스트 */}
                    {libraryDisplayType === 'snippet' && (
                      <div className={styles.horizontalCardList}>
                        {insights.map((item) => {
                          const plainContent = item.content
                            .replace(/```[\s\S]*?```/g, '')
                            .replace(/#{1,6}\s+/g, '')
                            .replace(/\*\*([^*]+)\*\*/g, '$1')
                            .replace(/\*([^*]+)\*/g, '$1')
                            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                            .trim();

                          return (
                            <Card
                              key={item.id}
                              variant="horizontal"
                              size="web"
                              title={item.title}
                              imageUrl={item.thumbnail?.url}
                              category={typeof item.subcategory?.name === 'string' ? item.subcategory.name : (typeof item.category?.name === 'string' ? item.category.name : '카테고리명')}
                              description={plainContent.length > 200
                                ? `${plainContent.substring(0, 200)}...`
                                : plainContent}
                              author="작성자명"
                              date={item.createdAt ? formatDate(item.createdAt) : ''}
                              onClick={() => handleItemClick(item.id)}
                              className={item.isMainExposed ? styles.featuredCard : ''}
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* list 타입 (C) - 테이블 형태 */}
                    {libraryDisplayType === 'list' && (
                      <div className={styles.libraryList}>
                        {/* 데스크톱 헤더 */}
                        <div className={styles.libraryListHeader}>
                          <div className={styles.libraryListHeaderRow}>
                            <div className={styles.libraryListHeaderCell}>No.</div>
                            <div
                              className={`${styles.libraryListHeaderCell} ${styles.sortable}`}
                              onClick={() => handleSort('category')}
                            >
                              카테고리
                              <Icon
                                type={sortField === 'category' && sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                size={16}
                                className={styles.sortIcon}
                              />
                            </div>
                            <div className={styles.libraryListHeaderCell}>제목</div>
                            <div
                              className={`${styles.libraryListHeaderCell} ${styles.sortable}`}
                              onClick={() => handleSort('author')}
                            >
                              작성자
                              <Icon
                                type={sortField === 'author' && sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                size={16}
                                className={styles.sortIcon}
                              />
                            </div>
                            <div className={styles.libraryListHeaderCell}>작성 일</div>
                            <div className={styles.libraryListHeaderCell}>조회수</div>
                          </div>
                        </div>

                        {/* 모바일 헤더 */}
                        <div className={styles.mobileListHeader}>
                          <div
                            className={`${styles.mobileListHeaderCell} ${styles.sortable}`}
                            onClick={() => handleSort('category')}
                          >
                            카테고리
                            <Icon
                              type={sortField === 'category' && sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                              size={16}
                              className={styles.sortIcon}
                            />
                          </div>
                          <div
                            className={`${styles.mobileListHeaderCell} ${styles.sortable}`}
                            onClick={() => handleSort('author')}
                          >
                            작성자
                            <Icon
                              type={sortField === 'author' && sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                              size={16}
                              className={styles.sortIcon}
                            />
                          </div>
                        </div>

                        {/* 데스크톱 바디 */}
                        <div className={styles.libraryListBody}>
                          {getSortedInsights().map((item, index) => (
                            <div
                              key={item.id}
                              className={styles.libraryListRow}
                              onClick={() => handleItemClick(item.id)}
                            >
                              <div className={styles.libraryListCell}>
                                {(currentPage - 1) * 20 + index + 1}
                              </div>
                              <div className={`${styles.libraryListCell} ${styles.categoryCell}`}>
                                {typeof item.subcategory?.name === 'string' ? item.subcategory.name : (typeof item.category?.name === 'string' ? item.category.name : '카테고리 명')}
                              </div>
                              <div className={`${styles.libraryListCell} ${styles.titleCell}`}>
                                <span className={styles.libraryListTitle}>{item.title}</span>
                              </div>
                              <div className={styles.libraryListCell}>작성자명</div>
                              <div className={styles.libraryListCell}>
                                {item.createdAt ? formatDate(item.createdAt) : '2025.10.14 13:05'}
                              </div>
                              <div className={styles.libraryListCell}>0</div>
                            </div>
                          ))}
                        </div>

                        {/* 모바일 바디 */}
                        <div className={styles.mobileListBody}>
                          {getSortedInsights().map((item) => (
                            <div
                              key={item.id}
                              className={styles.mobileListRow}
                              onClick={() => handleItemClick(item.id)}
                            >
                              <div className={styles.mobileListRowTop}>
                                <span className={styles.mobileListCategory}>
                                  {typeof item.subcategory?.name === 'string' ? item.subcategory.name : (typeof item.category?.name === 'string' ? item.category.name : '카테고리 명')}
                                </span>
                                <span className={styles.mobileListDate}>
                                  {item.createdAt ? formatDate(item.createdAt) : '2025.06.08'}
                                </span>
                              </div>
                              <div className={styles.mobileListTitle}>{item.title}</div>
                              <div className={styles.mobileListRowBottom}>
                                <span className={styles.mobileListAuthor}>작성자명</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={styles.paginationWrapper}>
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        visiblePages={4}
                      />
                    </div>
                  </>
                )}
              </div>
              </div>
            </>
          )}

          {activeTab === 'library' && (
            <div className={styles.libraryContent}>
              {/* 모바일 타이틀 섹션 */}
              <div className={styles.mobileLibraryTitleSection}>
                <h2 className={styles.mobileLibraryTitle}>
                  ARCHIVES {currentDataRoom || 'A'}
                </h2>
                <p className={styles.mobileLibrarySubtitle}>
                  {dataRoomName || `자료실${currentDataRoom || 'A'}`}
                </p>
              </div>

              {/* 모바일 검색 섹션 */}
              <div className={styles.mobileSearchSection}>
                <SearchField
                  placeholder="제목을 입력해주세요"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onSearch={handleSearch}
                  fullWidth
                />
              </div>

              {/* 모바일 카테고리 탭 - 동적 렌더링 */}
              <div className={styles.mobileCategoryTabs}>
                <button
                  className={`${styles.mobileCategoryTab} ${categoryFilter === 'all' ? styles.mobileCategoryTabActive : ''}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  {categoryFilter === 'all' && <span className={styles.mobileCategoryDot} />}
                  전체
                </button>
                {currentCategory?.subcategories
                  .filter(sub => sub.isExposed)
                  .map((subcategory) => (
                    <button
                      key={subcategory.id}
                      className={`${styles.mobileCategoryTab} ${categoryFilter === subcategory.name ? styles.mobileCategoryTabActive : ''}`}
                      onClick={() => handleCategoryChange(subcategory.name as CategoryFilter)}
                    >
                      {categoryFilter === subcategory.name && <span className={styles.mobileCategoryDot} />}
                      {subcategory.name}
                    </button>
                  ))}
              </div>

              {/* 모바일 게시물 수 */}
              <div className={styles.mobileCount}>
                <span>총 </span>
                <span className={styles.mobileCountNumber}>{total}</span>
                <span>개의 게시물이 있습니다</span>
              </div>

              <div className={styles.libraryTitleSection}>
                <h2 className={styles.libraryTitle}>
                  {dataRoomName ? `ARCHIVES ${currentDataRoom}` : `ARCHIVES ${currentDataRoom || 'A'}`}
                </h2>
              </div>
              <div className={styles.libraryMainContent}>
                <div className={styles.librarySidebar}>
                  <h2 className={styles.librarySidebarTitle}>
                    {dataRoomName || `자료실${currentDataRoom || 'A'}`}
                  </h2>
                  <nav className={styles.libraryCategoryNav}>
                    <button
                      className={`${styles.libraryCategoryItem} ${categoryFilter === 'all' ? styles.libraryCategoryItemActive : ''}`}
                      onClick={() => handleCategoryChange('all')}
                    >
                      {categoryFilter === 'all' && <span className={styles.activeDot} />}
                      <span>전체</span>
                    </button>
                    {/* 서브카테고리 동적 렌더링 */}
                    {currentCategory?.subcategories
                      .filter(sub => sub.isExposed)
                      .map((subcategory) => (
                        <button
                          key={subcategory.id}
                          className={`${styles.libraryCategoryItem} ${categoryFilter === subcategory.name ? styles.libraryCategoryItemActive : ''}`}
                          onClick={() => handleCategoryChange(subcategory.name as CategoryFilter)}
                        >
                          {categoryFilter === subcategory.name && <span className={styles.activeDot} />}
                          <span>{subcategory.name}</span>
                        </button>
                      ))}
                  </nav>
                </div>

                <div className={styles.libraryMainSection}>
                  <div className={styles.libraryToolbar}>
                    <div className={styles.count}>
                      <span>총 </span>
                      <span className={styles.countNumber}>{total}</span>
                      <span> 개의 게시물이 있습니다</span>
                    </div>
                    <div className={styles.searchWrapper}>
                      <SearchField
                        placeholder="제목을 입력해주세요"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onSearch={handleSearch}
                        fullWidth
                      />
                    </div>
                  </div>

                  {libraryDisplayType !== 'list' && <div className={styles.divider} />}

                  {loading ? (
                    <div className={styles.loading}>로딩 중...</div>
                  ) : error ? (
                    <div className={styles.error}>
                      <div className={styles.errorIcon}>⚠️</div>
                      <p>{error}</p>
                    </div>
                  ) : insights.length === 0 ? (
                    <div className={styles.empty}>
                      <p>등록된 게시글이 없습니다.</p>
                    </div>
                  ) : (
                    <>
                      {libraryDisplayType === 'gallery' && (
                        <div className={styles.libraryGallery}>
                          {insights.map((item) => (
                            <div
                              key={item.id}
                              className={`${styles.libraryCard} ${item.isMainExposed ? styles.libraryCardFeatured : ''}`}
                              onClick={() => handleItemClick(item.id)}
                            >
                              <div className={styles.libraryCardImage}>
                                {item.thumbnail?.url ? (
                                  <img src={item.thumbnail.url} alt={item.title} />
                                ) : (
                                  <div className={styles.placeholderImage} />
                                )}
                              </div>
                              <div className={styles.libraryCardContent}>
                                <div className={styles.libraryCardHeader}>
                                  <p className={styles.libraryCardCategory}>
                                    {typeof item.subcategory?.name === 'string' ? item.subcategory.name : (typeof item.category?.name === 'string' ? item.category.name : '카테고리명')}
                                  </p>
                                  <h3 className={styles.libraryCardTitle}>{item.title}</h3>
                                </div>
                                <div className={styles.libraryCardFooter}>
                                  <span className={styles.libraryCardAuthor}>작성자명</span>
                                  <span className={styles.cardDivider} />
                                  <span className={styles.libraryCardDate}>
                                    {item.createdAt ? formatDate(item.createdAt) : '2026.01.28'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {libraryDisplayType === 'snippet' && (
                        <div className={styles.horizontalCardList}>
                          {insights.map((item) => {
                            const plainContent = item.content
                              .replace(/```[\s\S]*?```/g, '')
                              .replace(/#{1,6}\s+/g, '')
                              .replace(/\*\*([^*]+)\*\*/g, '$1')
                              .replace(/\*([^*]+)\*/g, '$1')
                              .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                              .trim();

                            return (
                              <Card
                                key={item.id}
                                variant="horizontal"
                                size="web"
                                title={item.title}
                                imageUrl={item.thumbnail?.url}
                                category={typeof item.subcategory?.name === 'string' ? item.subcategory.name : (typeof item.category?.name === 'string' ? item.category.name : '카테고리명')}
                                description={plainContent.length > 200
                                  ? `${plainContent.substring(0, 200)}...`
                                  : plainContent}
                                author="작성자명"
                                date={item.createdAt ? formatDate(item.createdAt) : ''}
                                onClick={() => handleItemClick(item.id)}
                                className={item.isMainExposed ? styles.featuredCard : ''}
                              />
                            );
                          })}
                        </div>
                      )}

                      {libraryDisplayType === 'list' && (
                        <div className={styles.libraryList}>
                          {/* 데스크톱 헤더 */}
                          <div className={styles.libraryListHeader}>
                            <div className={styles.libraryListHeaderRow}>
                              <div className={styles.libraryListHeaderCell}>No.</div>
                              <div
                                className={`${styles.libraryListHeaderCell} ${styles.sortable}`}
                                onClick={() => handleSort('category')}
                              >
                                카테고리
                                <Icon
                                  type={sortField === 'category' && sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                  size={16}
                                  className={styles.sortIcon}
                                />
                              </div>
                              <div className={styles.libraryListHeaderCell}>제목</div>
                              <div
                                className={`${styles.libraryListHeaderCell} ${styles.sortable}`}
                                onClick={() => handleSort('author')}
                              >
                                작성자
                                <Icon
                                  type={sortField === 'author' && sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                  size={16}
                                  className={styles.sortIcon}
                                />
                              </div>
                              <div className={styles.libraryListHeaderCell}>작성 일</div>
                              <div className={styles.libraryListHeaderCell}>조회수</div>
                            </div>
                          </div>

                          {/* 모바일 헤더 */}
                          <div className={styles.mobileListHeader}>
                            <div
                              className={`${styles.mobileListHeaderCell} ${styles.sortable}`}
                              onClick={() => handleSort('category')}
                            >
                              카테고리
                              <Icon
                                type={sortField === 'category' && sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                size={16}
                                className={styles.sortIcon}
                              />
                            </div>
                            <div
                              className={`${styles.mobileListHeaderCell} ${styles.sortable}`}
                              onClick={() => handleSort('author')}
                            >
                              작성자
                              <Icon
                                type={sortField === 'author' && sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                size={16}
                                className={styles.sortIcon}
                              />
                            </div>
                          </div>

                          {/* 데스크톱 바디 */}
                          <div className={styles.libraryListBody}>
                            {getSortedInsights().map((item, index) => (
                              <div
                                key={item.id}
                                className={styles.libraryListRow}
                                onClick={() => handleItemClick(item.id)}
                              >
                                <div className={styles.libraryListCell}>
                                  {(currentPage - 1) * 20 + index + 1}
                                </div>
                                <div className={`${styles.libraryListCell} ${styles.categoryCell}`}>
                                  {typeof item.subcategory?.name === 'string' ? item.subcategory.name : (typeof item.category?.name === 'string' ? item.category.name : '카테고리 명')}
                                </div>
                                <div className={`${styles.libraryListCell} ${styles.titleCell}`}>
                                  <span className={styles.libraryListTitle}>{item.title}</span>
                                </div>
                                <div className={styles.libraryListCell}>작성자명</div>
                                <div className={styles.libraryListCell}>
                                  {item.createdAt ? formatDate(item.createdAt) : '2025.10.14 13:05'}
                                </div>
                                <div className={styles.libraryListCell}>0</div>
                              </div>
                            ))}
                          </div>

                          {/* 모바일 바디 */}
                          <div className={styles.mobileListBody}>
                            {getSortedInsights().map((item, index) => (
                              <div
                                key={item.id}
                                className={styles.mobileListRow}
                                onClick={() => handleItemClick(item.id)}
                              >
                                <div className={styles.mobileListRowTop}>
                                  <span className={styles.mobileListCategory}>
                                    {typeof item.subcategory?.name === 'string' ? item.subcategory.name : (typeof item.category?.name === 'string' ? item.category.name : '카테고리 명')}
                                  </span>
                                  <span className={styles.mobileListDate}>
                                    {item.createdAt ? formatDate(item.createdAt) : '2025.06.08'}
                                  </span>
                                </div>
                                <div className={styles.mobileListTitle}>
                                  {item.title}
                                </div>
                                <div className={styles.mobileListAuthor}>작성자명</div>
                                <div className={styles.mobileListBottom}>
                                  <span className={styles.mobileListNo}>NO.{(currentPage - 1) * 20 + index + 1}</span>
                                  <span className={styles.mobileListViews}>
                                    <img src="/images/insights/icons/eye.svg" alt="조회수" className={styles.mobileListEyeIcon} />
                                    0
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className={styles.paginationWrapper}>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                          visiblePages={4}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      <div className={styles.floatingButtons}>
        <FloatingButton
          variant="consult"
          label="상담 신청하기"
          onClick={() => router.push('/consultation/apply')}
        />
        <FloatingButton
          variant="top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </div>

      <Footer />
    </div>
  );
};

export default InsightsPage;


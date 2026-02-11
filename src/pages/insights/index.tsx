import React, { useState, useEffect, useCallback } from 'react';
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
import SEO from '@/components/SEO';
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

interface InsightFile {
  id: number;
  fileName: string;
  url: string;
  type: 'DOCUMENT' | 'IMAGE';
}

interface InsightSubMinorCategory {
  id: number;
  name: string;
}

interface InsightItem {
  id: number;
  viewCount: number;
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
  authorName?: string;
  files?: InsightFile[];
  subMinorCategory: InsightSubMinorCategory;
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

  // Track user state for refetching hierarchical data when auth changes
  const [userAuthKey, setUserAuthKey] = useState<string>('');

  // Update user auth key when user state changes (for triggering refetch)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr) as { memberType?: string; isApproved?: boolean };
          const key = `${user.memberType || 'null'}_${user.isApproved || 'null'}`;
          setUserAuthKey(key);
        } catch {
          setUserAuthKey('null_null');
        }
      } else {
        setUserAuthKey('null_null');
      }
    }
  }, []);

  // Insights hierarchical 데이터 가져오기
  useEffect(() => {
    const fetchHierarchical = async () => {
      try {
        // Build query params based on user auth state
        const params = new URLSearchParams();
        params.append('limit', '20');
        params.append('page', '1');

        // Get user from localStorage
        let memberType: string | null = null;
        let isApproved: boolean | null = null;

        if (typeof window !== 'undefined') {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            try {
              const user = JSON.parse(userStr) as { memberType?: string; isApproved?: boolean };
              memberType = user.memberType || null;

              // Only send isApproved when memberType is INSURANCE
              if (memberType === 'INSURANCE') {
                isApproved = user.isApproved ?? false;
              }
            } catch {
              // Invalid user data, treat as not logged in
            }
          }
        }

        // Add memberType to params
        if (memberType) {
          params.append('memberType', memberType);
        } else {
          // Case 3: Not logged in - send memberType=null
          params.append('memberType', 'null');
        }

        // Add isApproved ONLY when memberType is INSURANCE
        if (memberType === 'INSURANCE' && isApproved !== null) {
          params.append('isApproved', String(isApproved));
        }

        const response = await get<InsightsHierarchical[]>(
          `${API_ENDPOINTS.INSIGHTS_HIERARCHICAL}?${params.toString()}`
        );

        if (response.data && Array.isArray(response.data)) {
          // Use backend response directly - no frontend filtering
          setInsightsHierarchical(response.data);

          // 첫 번째 카테고리를 기본 탭으로 설정 (아직 설정되지 않은 경우)
          if (response.data.length > 0 && !activeTab) {
            setActiveTab(String(response.data[0].category.id));
          }
        }
      } catch (err) {
        console.error('Failed to fetch insights hierarchical:', err);
      }
    };
    fetchHierarchical();
  }, [userAuthKey]);

  // 현재 선택된 카테고리 데이터
  const currentCategory = insightsHierarchical.find(
    d => String(d.category.id) === activeTab
  );

  // 동적 탭 목록 생성
  const tabItems = insightsHierarchical.map(d => ({
    id: String(d.category.id),
    label: d.category.name
  }));

  // CONSOLIDATED URL Parameter Processing
  // This handles all URL params in one place to avoid race conditions
  useEffect(() => {
    if (!router.isReady || insightsHierarchical.length === 0) return;

    const { category, sub, search } = router.query;
    console.log('[URL Init] Processing URL params - category:', category, 'sub:', sub, 'search:', search);

    // Step 1: Determine active tab from URL or default to first
    let targetTabId: string;
    if (typeof category === 'string') {
      const found = insightsHierarchical.find(d => String(d.category.id) === category);
      if (found) {
        targetTabId = category;
      } else {
        targetTabId = String(insightsHierarchical[0].category.id);
      }
    } else {
      targetTabId = String(insightsHierarchical[0].category.id);
    }

    // Step 2: Get the category data for display type
    const targetCategory = insightsHierarchical.find(d => String(d.category.id) === targetTabId);

    // Step 3: Set display type IMMEDIATELY based on category type
    if (targetCategory?.category.type) {
      const displayType = getDisplayTypeFromCategoryType(targetCategory.category.type);
      console.log('[URL Init] Setting libraryDisplayType to:', displayType, 'for category type:', targetCategory.category.type);
      setLibraryDisplayType(displayType);
    }

    // Step 4: Set active tab
    if (activeTab !== targetTabId) {
      console.log('[URL Init] Setting activeTab to:', targetTabId);
      setActiveTab(targetTabId);
    }

    // Step 5: Process sub parameter for category filter
    if (sub !== undefined && typeof sub === 'string') {
      if (sub === '0') {
        setCategoryFilter('all');
        console.log('[URL Init] Set categoryFilter to "all" (sub=0)');
      } else if (targetCategory) {
        const subcategory = targetCategory.subcategories.find(s => String(s.id) === sub);
        if (subcategory) {
          setCategoryFilter(subcategory.name as CategoryFilter);
          console.log('[URL Init] Set categoryFilter to:', subcategory.name);
        } else {
          setCategoryFilter('all');
          console.log('[URL Init] Subcategory not found, defaulting to "all"');
        }
      }
    }

    // Step 6: Process search parameter
    if (search && typeof search === 'string') {
      setSearchQuery(search);
      console.log('[URL Init] Set searchQuery to:', search);
    } else if (searchQuery) {
      // Clear search if not in URL (returning from somewhere)
      setSearchQuery('');
    }
  }, [router.isReady, router.query.category, router.query.sub, router.query.search, insightsHierarchical]);

  // Update display type when activeTab changes (for programmatic tab changes)
  useEffect(() => {
    if (currentCategory?.category.type) {
      const displayType = getDisplayTypeFromCategoryType(currentCategory.category.type);
      if (libraryDisplayType !== displayType) {
        console.log('[Tab Change] Updating libraryDisplayType to:', displayType);
        setLibraryDisplayType(displayType);
      }
    }
  }, [activeTab, currentCategory]);

  // 검색 핸들러 (Enter 키 또는 검색 버튼 클릭 시)
  const handleItemClick = useCallback((id: number) => {
    const query: Record<string, string> = {};

    if (activeTab) {
      query.category = activeTab;
    }

    // Always include sub parameter: "0" for all, subcategory id for specific
    if (categoryFilter === 'all') {
      query.sub = '0';
    } else {
      // subcategory name to id conversion
      const currentCat = insightsHierarchical.find(d => String(d.category.id) === activeTab);
      if (currentCat) {
        const subcategory = currentCat.subcategories.find(s => s.name === categoryFilter);
        if (subcategory) {
          query.sub = String(subcategory.id);
        } else {
          query.sub = '0'; // fallback to all
        }
      } else {
        query.sub = '0'; // fallback to all
      }
    }

    if (searchQuery.trim()) {
      query.search = searchQuery.trim();
    }

    console.log('[handleItemClick] Navigating to detail with query:', query);

    router.push({
      pathname: `/insights/${id}`,
      query: query
    });
  }, [activeTab, categoryFilter, insightsHierarchical, searchQuery, router]);

  // search uchun debounce qo'shamiz (1000ms):
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChangeWithDebounce = useCallback((value: string) => {
    setSearchQuery(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      setCurrentPage(1);
    }, 1000);

    setSearchTimeout(newTimeout);
  }, [searchTimeout]);

  // fetchInsights funksiyasini o'zgartirish (search query bilan):
  const fetchInsights = useCallback(async () => {
    if (!activeTab) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '9');

      // Faqat search query ishlatish
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      if (categoryFilter !== 'all') {
        // subcategory nomini id ga aylantirish
        const currentCategory = insightsHierarchical.find(d => String(d.category.id) === activeTab);
        if (currentCategory) {
          const subcategory = currentCategory.subcategories.find(s => s.name === categoryFilter);
          if (subcategory) {
            // sub=0 bo'lsa ham APIga qo'shilmasin, faqat 0 dan farqli bo'lsa
            params.append('subcategoryId', String(subcategory.id));
          }
        }
      }

      // 현재 선택된 탭의 카테고리 ID 사용
      params.append('categoryId', activeTab);

      // Member type va approval filter qo'shamiz
      let memberType = null;
      let isApproved = null;
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            memberType = user.memberType || null;
            if (memberType === 'INSURANCE') {
              isApproved = user.isApproved || null;
            }
          } catch (e) { }
        }
      }

      if (memberType) {
        params.append('memberType', memberType);
      } else {
        params.append('memberType', 'null');
      }

      if (isApproved !== null) {
        params.append('isApproved', String(isApproved));
      }

      const response = await get<InsightResponse>(
        `${API_ENDPOINTS.INSIGHTS}?${params.toString()}`
      );

      if (response.data) {
        const data = response.data;
        setInsights(data.items || []);
        setTotal(data.total || 0);

        // totalPages 계산
        const limit = data.limit || 20;
        const calculatedTotalPages = Math.ceil((data.total || 0) / limit);
        setTotalPages(calculatedTotalPages);
      }
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      setInsights([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, searchQuery, categoryFilter, insightsHierarchical]);

  // Fetch insights when filters change
  useEffect(() => {
    if (router.isReady && activeTab && insightsHierarchical.length > 0) {
      console.log('[Fetch Trigger] activeTab:', activeTab, 'categoryFilter:', categoryFilter, 'libraryDisplayType:', libraryDisplayType);
      fetchInsights();
    }
  }, [router.isReady, activeTab, categoryFilter, insightsHierarchical.length, currentPage, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);

    const queryParams: Record<string, string> = {};
    if (activeTab) {
      queryParams.category = activeTab;
    }

    // Always include sub parameter
    if (categoryFilter === 'all') {
      queryParams.sub = '0';
    } else {
      const currentCat = insightsHierarchical.find(d => String(d.category.id) === activeTab);
      if (currentCat) {
        const subcategory = currentCat.subcategories.find(s => s.name === categoryFilter);
        if (subcategory) {
          queryParams.sub = String(subcategory.id);
        } else {
          queryParams.sub = '0';
        }
      } else {
        queryParams.sub = '0';
      }
    }

    if (query.trim()) {
      queryParams.search = query.trim();
    }

    console.log('[handleSearch] Updating URL with:', queryParams);

    router.replace(
      {
        pathname: '/insights',
        query: queryParams,
      },
      undefined,
      { shallow: true }
    );
  }, [activeTab, categoryFilter, insightsHierarchical, router]);

  // handleCategoryChange: Always include sub parameter in URL
  const handleCategoryChange = useCallback((category: CategoryFilter) => {
    setCategoryFilter(category);
    setCurrentPage(1);

    // Build URL params - always include sub
    const queryParams: Record<string, string> = {};
    if (activeTab) {
      queryParams.category = activeTab;
    }

    // Always include sub: "0" for all, subcategory id for specific
    if (category === 'all') {
      queryParams.sub = '0';
    } else {
      const currentCat = insightsHierarchical.find(d => String(d.category.id) === activeTab);
      if (currentCat) {
        const subcategory = currentCat.subcategories.find(s => s.name === category);
        if (subcategory) {
          queryParams.sub = String(subcategory.id);
        } else {
          queryParams.sub = '0'; // fallback
        }
      } else {
        queryParams.sub = '0'; // fallback
      }
    }

    if (searchQuery.trim()) {
      queryParams.search = searchQuery.trim();
    }

    console.log('[handleCategoryChange] Updating URL with:', queryParams);

    router.replace(
      {
        pathname: '/insights',
        query: queryParams,
      },
      undefined,
      { shallow: true }
    );
  }, [activeTab, insightsHierarchical, searchQuery, router]);

  // handleTabChange: Always include sub=0 for "all" category filter
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setCategoryFilter('all');
    setSearchQuery('');

    // URL update - always include sub=0 for "all"
    console.log('[handleTabChange] Switching to tab:', tabId, 'with sub=0');
    router.push(`/insights?category=${tabId}&sub=0`, undefined, { shallow: true });
  }, [router]);

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
        aValue = a.authorName || '작성자';
        bValue = b.authorName || '작성자';
      }

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };

  // 탭 변경 핸들러
  // const handleTabChange = (tabId: string) => {
  //   setActiveTab(tabId);
  //   setCurrentPage(1);
  //   setCategoryFilter('all');
  //   setSearchQuery('');

  //   // URL 업데이트 - category 파라미터 사용
  //   router.push(`/insights?category=${tabId}`, undefined, { shallow: true });
  // };

  // // 카테고리 필터 변경 핸들러
  // const handleCategoryChange = (category: CategoryFilter) => {
  //   setCategoryFilter(category);
  //   setCurrentPage(1);
  // };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <>
      <SEO menuName="인사이트" />
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
                      onChange={handleSearchChangeWithDebounce}
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
                              onClick={() => handleCategoryChange(subcategory.name as CategoryFilter)}
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
                            onChange={handleSearchChangeWithDebounce}
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
                                      category={item.subMinorCategory ? item.subMinorCategory.name : '카테고리 명'}
                                      description={plainContent.length > 150
                                        ? `${plainContent.substring(0, 150)}...`
                                        : plainContent}
                                      author={item.authorName ? item.authorName : "작성자"}
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
                                      category={item.subMinorCategory ? item.subMinorCategory.name : '카테고리 명'}
                                      description={plainContent.length > 150
                                        ? `${plainContent.substring(0, 150)}...`
                                        : plainContent}
                                      author={item.authorName ? item.authorName : "작성자"}
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
                                    category={item.subMinorCategory ? item.subMinorCategory.name : '카테고리 명'}
                                    description={plainContent.length > 200
                                      ? `${plainContent.substring(0, 200)}...`
                                      : plainContent}
                                    author={item.authorName ? item.authorName : "작성자"}
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
                                      {( item.subMinorCategory ? item.subMinorCategory.name : '카테고리 명')}
                                    </div>
                                    <div className={`${styles.libraryListCell} ${styles.titleCell}`}>
                                      <span className={styles.libraryListTitle}>
                                        {item.title}
                                        
                                      </span>{Array.isArray(item.files) && item.files.length > 0 && (
                                          <Icon
                                            type="document"
                                            size={20}
                                            className={styles.libraryListDocumentIcon}
                                          />
                                        )}
                                    </div>
                                    <div className={styles.libraryListCell}>{item.authorName ? item.authorName : "작성자"}</div>
                                    <div className={styles.libraryListCell}>
                                      {item.createdAt ? formatDate(item.createdAt) : '2025.10.14 13:05'}
                                    </div>
                                    <div className={styles.libraryListCell}>{item.viewCount? item.viewCount : 0}</div>
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
                                        {item.subMinorCategory ? item.subMinorCategory.name : '카테고리 명'}
                                      </span>
                                      <span className={styles.mobileListDate}>
                                        {item.createdAt ? formatDate(item.createdAt) : '2025.06.08'}
                                      </span>
                                    </div>
                                    <div className={styles.mobileListTitle}>{item.title}</div>
                                    <div className={styles.mobileListRowBottom}>
                                      <span className={styles.mobileListAuthor}>{item.authorName ? item.authorName : "작성자"}</span>
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
                      onChange={handleSearchChangeWithDebounce}
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
                            onChange={handleSearchChangeWithDebounce}
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
                                        {item.subMinorCategory ? item.subMinorCategory.name : '카테고리 명'}
                                      </p>
                                      <h3 className={styles.libraryCardTitle}>{item.title}</h3>
                                    </div>
                                    <div className={styles.libraryCardFooter}>
                                      <span className={styles.libraryCardAuthor}>{item.authorName ? item.authorName : "작성자"}</span>
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
                                    category={item.subMinorCategory ? item.subMinorCategory.name : '카테고리 명'}
                                    description={plainContent.length > 200
                                      ? `${plainContent.substring(0, 200)}...`
                                      : plainContent}
                                    author={item.authorName ? item.authorName : "작성자"}
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
                                      {item.subMinorCategory ? item.subMinorCategory.name : '카테고리 명'}
                                    </div>
                                    <div className={`${styles.libraryListCell} ${styles.titleCell}`}>
                                      <span className={styles.libraryListTitle}>{item.title}</span>
                                    </div>
                                    <div className={styles.libraryListCell}>{item.authorName ? item.authorName : "작성자"}</div>
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
                                        {item.subMinorCategory ? item.subMinorCategory.name : '카테고리 명'}
                                      </span>
                                      <span className={styles.mobileListDate}>
                                        {item.createdAt ? formatDate(item.createdAt) : '2025.06.08'}
                                      </span>
                                    </div>
                                    <div className={styles.mobileListTitle}>
                                      {item.title}
                                    </div>
                                    <div className={styles.mobileListAuthor}>{item.authorName ? item.authorName : "작성자"}</div>
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
        </div>

        <Footer />
      </div>
    </>
  );
};

export default InsightsPage;


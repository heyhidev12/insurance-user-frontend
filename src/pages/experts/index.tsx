import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import PageHeader from '@/components/common/PageHeader';
import FloatingButton from '@/components/common/FloatingButton';
import Icon from '@/components/common/Icon';
import Card from '@/components/common/Card';
import SEO from '@/components/SEO';
import { get } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import styles from './experts.module.scss';

interface Expert {
  id?: number;
  name: string;
  position?: string;
  affiliation?: string;
  tel?: string;
  phoneNumber?: string;
  email: string;
  imageUrl?: string;
  mainPhoto?: {
    id: number;
    url: string;
  };
}

interface Category {
  id: number;
  name: string;
  isExposed: boolean;
  majorCategoryId: number;
  majorCategoryName: string;
}

interface MembersResponse {
  items?: Expert[];
  data?: Expert[];
  total?: number;
  page?: number;
  limit?: number;
}

interface OrganizationCategory {
  id: number;
  name: string;
  isExposed?: boolean;
  children?: OrganizationCategory[];
}

const ExpertsPage: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string>('분야를 선택해주세요');
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingExperts, setIsLoadingExperts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizationData, setOrganizationData] = useState<OrganizationCategory[]>([]);
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Search state
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 20;

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 분야 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setError(null);
      try {
        const response = await get<Category[]>(API_ENDPOINTS.BUSINESS_AREAS_CATEGORIES);
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          // isExposed가 true인 분야만 필터링
          const exposedCategories = response.data.filter(cat => cat.isExposed);
          setCategories(exposedCategories);
        }
      } catch (err) {
        setError('분야 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // 조직도 데이터 가져오기
  useEffect(() => {
    const fetchOrganization = async () => {
      setIsLoadingOrganization(true);
      try {
        const response = await get<OrganizationCategory[]>(API_ENDPOINTS.BUSINESS_AREAS_HIERARCHICAL);
        if (response.data) {
          setOrganizationData(response.data);
        }
      } catch (err) {
        console.error('조직도 데이터를 불러오는 중 오류가 발생했습니다.', err);
      } finally {
        setIsLoadingOrganization(false);
      }
    };

    fetchOrganization();
  }, []);

  // Fetch experts based on filters (categoryId and/or search)
  // Backend returns members ordered by: displayOrder ASC, then RANDOM
  // Frontend must NOT re-sort - trust backend ordering
  const fetchExperts = useCallback(async (page: number = 1, categoryId: number | null = selectedFieldId, keyword: string = searchKeyword) => {
    // Do NOT call API if no filter is applied
    if (categoryId === null && !keyword) {
      setExperts([]);
      setTotalItems(0);
      return;
    }

    setIsLoadingExperts(true);
    setError(null);
    setHasSearched(true);
    
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', ITEMS_PER_PAGE.toString());
      
      // Use categoryId for filtering instead of workArea
      if (categoryId !== null) {
        params.append('categoryId', categoryId.toString());
      }
      
      if (keyword) {
        params.append('search', keyword);
      }
      
      const url = `${API_ENDPOINTS.MEMBERS}?${params.toString()}`;
      const response = await get<Expert[] | MembersResponse>(url);
      
      if (response.error) {
        setError(response.error);
        setExperts([]);
        setTotalItems(0);
      } else if (response.data) {
        // 응답이 배열인 경우와 객체인 경우 모두 처리
        // Do NOT sort - maintain backend ordering (displayOrder ASC, then RANDOM)
        let expertsList: Expert[] = [];
        let total = 0;
        
        if (Array.isArray(response.data)) {
          expertsList = response.data;
          total = response.data.length;
        } else {
          const membersResponse = response.data as MembersResponse;
          // items 필드 우선 확인, 없으면 data 필드 확인
          expertsList = membersResponse.items || membersResponse.data || [];
          total = membersResponse.total || expertsList.length;
        }
        setExperts(expertsList);
        setTotalItems(total);
        setCurrentPage(page);
      } else {
        setExperts([]);
        setTotalItems(0);
      }
    } catch (err) {
      setError('전문가 목록을 불러오는 중 오류가 발생했습니다.');
      setExperts([]);
      setTotalItems(0);
    } finally {
      setIsLoadingExperts(false);
    }
  }, [selectedFieldId, searchKeyword]);

  const handleFieldSelect = (category: Category) => {
    setSelectedField(category.name);
    setSelectedFieldId(category.id);
    setIsDropdownOpen(false);
    setCurrentPage(1);
    
    // Fetch with new workArea (and existing search keyword if any)
    fetchExperts(1, category.id, searchKeyword);
    
    // 선택된 분야로 스크롤
    setTimeout(() => {
      const expertsSection = document.getElementById('experts-list-section');
      if (expertsSection) {
        expertsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle search submit (button click or Enter key)
  const handleSearchSubmit = () => {
    const trimmedKeyword = searchInputValue.trim();
    setSearchKeyword(trimmedKeyword);
    setCurrentPage(1);
    
    // If search is empty and no select, clear results
    if (!trimmedKeyword && selectedFieldId === null) {
      setExperts([]);
      setTotalItems(0);
      setHasSearched(false);
      return;
    }
    
    // Fetch with current filters
    fetchExperts(1, selectedFieldId, trimmedKeyword);
    
    // Scroll to results
    setTimeout(() => {
      const expertsSection = document.getElementById('experts-list-section');
      if (expertsSection) {
        expertsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle Enter key on search input
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchExperts(page, selectedFieldId, searchKeyword);
    
    // Scroll to top of results
    const expertsSection = document.getElementById('experts-list-section');
    if (expertsSection) {
      expertsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedField('분야를 선택해주세요');
    setSelectedFieldId(null);
    setSearchKeyword('');
    setSearchInputValue('');
    setExperts([]);
    setTotalItems(0);
    setCurrentPage(1);
    setHasSearched(false);
  };

  const handleConsultClick = () => {
    router.push('/consultation/apply');
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <SEO menuName="전문가 소개" />
      <div className={styles.expertsPage}>
      <Header
        variant="transparent"
        onMenuClick={() => setIsMenuOpen(true)}
        onLogoClick={() => router.push('/')}
      />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={styles.pageContent}>
        {/* Page Header */}
        <div className={styles.pageHeaderSection}>
          <PageHeader
            title="전문가 소개"
            breadcrumbs={[
              { label: '전문가 소개' }
            ]}
            size={isMobile ? 'mobile' : 'web'}
          />
        </div>

        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroBackground}>
            <div className={styles.heroOverlay} />
          </div>
          <p className={styles.heroSubtitle}>(전문가 소개)</p>
          <div className={styles.heroTitle}>
            <span className={styles.heroTitleText}>TEAM OF</span>
            <span className={`${styles.heroTitleText} ${styles.heroTitleItalic}`}>EXPERTS</span>
          </div>
          <div className={styles.heroContent}>
            <div className={styles.heroDescription}>
              <p className={styles.heroDescriptionTitle}>
                세무법인 함께, 라인업에서 나옵니다
              </p>
              <div className={styles.heroDescriptionText}>
                <p>
                  <span>국세청 근무 경력을 포함 </span>
                  <span className={styles.boldText}>30년 이상 세무사 n명</span>
                </p>
                <p>
                  <span>세무사 경력 </span>
                  <span className={styles.boldText}>10년 이상 세무사 n명</span>
                </p>
                <p>함께 하는 신뢰와 함께, 든든한 구성원을 안내드립니다.</p>
              </div>
            </div>
            <div className={styles.searchContainer}>
              {/* Work Area Select */}
              <div className={styles.fieldSelector} ref={dropdownRef}>
                <div
                  className={styles.fieldSelectorInput}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <p>{selectedField}</p>
                  <Icon 
                    type="chevron-down-white" 
                    size={20}
                    className={styles.dropdownArrow}
                    style={{
                      transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </div>
                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownContent}>
                      {isLoadingCategories ? (
                        <div className={styles.dropdownItem}>
                          <p>로딩 중...</p>
                        </div>
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <div
                            key={category.id}
                            className={`${styles.dropdownItem} ${
                              selectedFieldId === category.id ? styles.dropdownItemActive : ''
                            }`}
                            onClick={() => handleFieldSelect(category)}
                          >
                            <p>{category.name}</p>
                          </div>
                        ))
                      ) : (
                        <div className={styles.dropdownItem}>
                          <p>분야가 없습니다</p>
                        </div>
                      )}
                    </div>
                    <div className={styles.dropdownDivider} />
                    <div className={styles.dropdownDivider} />
                  </div>
                )}
              </div>

              {/* Search Input */}
              <div className={styles.searchInputWrapper}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="이름 또는 분야를 검색해주세요"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <button
                  className={styles.searchButton}
                  onClick={handleSearchSubmit}
                  aria-label="검색"
                >
                  <Icon type="search" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Experts List Section - shown when search/filter has been applied */}
        <div id="experts-list-section" className={styles.expertsListSection}>
          <div className={styles.expertsListContent}>
            <div className={styles.expertsListLayout}>
              {/* Header with current filters */}
              <div className={styles.expertsListHeader}>
                {selectedFieldId !== null && (
                  <h2 className={styles.expertsListTitle}>{selectedField}</h2>
                )}
                {searchKeyword && (
                  <p className={styles.searchKeywordLabel}>
                    검색어: &quot;{searchKeyword}&quot;
                  </p>
                )}
              </div>
              
              {/* When no filter applied - show nothing */}
              {!hasSearched && selectedFieldId === null && !searchKeyword ? null : isLoadingExperts ? (
                <div className={styles.loadingContainer}>
                  <p>전문가 목록을 불러오는 중...</p>
                </div>
              ) : error ? (
                <div className={styles.errorContainer}>
                  <p>{error}</p>
                </div>
              ) : experts.length > 0 ? (
                <div className={styles.expertsGridWrapper}>
                  <div className={styles.expertsGrid}>
                    {experts.map((expert, index) => (
                      <Card
                        key={expert.id || index}
                        variant="profile"
                        title={expert.name}
                        position={expert.position || expert.affiliation || ''}
                        tel={expert.tel || expert.phoneNumber || ''}
                        email={expert.email}
                        imageUrl={expert.imageUrl || expert.mainPhoto?.url}
                        size={isMobile ? 'mobile' : 'web'}
                        className={styles.expertCard}
                        onClick={() => expert.id && router.push(`/experts/${expert.id}`)}
                      />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className={styles.paginationWrapper}>
                      <button
                        className={styles.paginationButton}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <Icon type="arrow-left" size={20} />
                      </button>
                      <div className={styles.paginationNumbers}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            className={`${styles.paginationNumber} ${currentPage === page ? styles.paginationNumberActive : ''}`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        className={styles.paginationButton}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <Icon type="arrow-right" size={20} />
                      </button>
                    </div>
                  )}
                </div>
              ) : hasSearched ? (
                <div className={styles.emptyContainer}>
                  <p>검색 결과가 없습니다.</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Organization Section - shown when no filter is applied */}
        {!hasSearched && selectedFieldId === null && !searchKeyword && (
          <div className={styles.organizationSection}>
            <div className={styles.organizationContent}>
              <div className={styles.organizationChart}>
                <img
                  src="/images/experts/organization-web.png"
                  alt="Organization Chart"
                  className={styles.organizationImageWeb}
                />
                <img
                  src="/images/experts/organization-mobile.png"
                  alt="Organization Chart"
                  className={styles.organizationImageMobile}
                />
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>

      {/* Floating Buttons */}
      <div className={styles.floatingButtons}>
        <FloatingButton
          variant="consult"
          label="상담 신청하기"
          onClick={handleConsultClick}
        />
      </div>
    </div>
    </>
  );
};

export default ExpertsPage;


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import PageHeader from '@/components/common/PageHeader';
import FloatingButton from '@/components/common/FloatingButton';
import Icon from '@/components/common/Icon';
import { get } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import styles from './hierarchical.module.scss';

interface SectionContent {
  content: string;
  section: string;
}

interface BusinessItem {
  id: number;
  name: string;
  subDescription?: string;
  image?: {
    id: number;
    url: string;
  };
  overview?: string;
  sectionContents?: SectionContent[];
  youtubeUrls?: string[];
  youtubeCount?: number;
  isMainExposed?: boolean;
  isExposed?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface MinorCategory {
  id: number;
  name: string;
  isExposed: boolean;
  items: BusinessItem[];
}

interface MajorCategory {
  id: number;
  name: string;
  sections: string[];
  isExposed: boolean;
  displayOrder: number;
}

interface HierarchicalData {
  majorCategory: MajorCategory;
  minorCategories: MinorCategory[];
}

const HierarchicalPage: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allData, setAllData] = useState<HierarchicalData[]>([]); // 모든 카테고리 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL 쿼리 파라미터에서 카테고리 ID 읽기
  const categoryFromQuery = router.query.category as string;
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set([1])); // 첫 번째 카테고리 기본 펼침

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await get<HierarchicalData[]>(
          `${API_ENDPOINTS.BUSINESS_AREAS_HIERARCHICAL}?limit=20&page=1`
        );

        if (response.error) {
          setError(response.error);
        } else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // isExposed가 true인 카테고리만 필터링
          const exposedData = response.data.filter(d => d.majorCategory.isExposed);
          setAllData(exposedData);

          // 첫 번째 카테고리를 기본 탭으로 설정
          if (exposedData.length > 0 && !categoryFromQuery) {
            setActiveTabId(exposedData[0].majorCategory.id);
          }
        } else {
          setError('데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // URL 쿼리 파라미터가 변경되면 탭 업데이트
  useEffect(() => {
    if (categoryFromQuery && allData.length > 0) {
      const categoryId = Number(categoryFromQuery);
      const found = allData.find(d => d.majorCategory.id === categoryId);
      if (found) {
        setActiveTabId(categoryId);
      }
    } else if (allData.length > 0 && !activeTabId) {
      // 쿼리 파라미터가 없으면 첫 번째 탭 선택
      setActiveTabId(allData[0].majorCategory.id);
    }
  }, [categoryFromQuery, allData]);

  // 현재 선택된 탭의 데이터
  const currentData = allData.find(d => d.majorCategory.id === activeTabId) || null;

  // 동적 탭 목록 생성
  const tabs = allData.map(d => ({
    id: String(d.majorCategory.id),
    label: d.majorCategory.name
  }));

  // 탭 변경 핸들러
  const handleTabChange = (tabId: string) => {
    const newTabId = Number(tabId);
    setActiveTabId(newTabId);
    router.push(`/business-areas/hierarchical?category=${newTabId}`, undefined, { shallow: true });
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleItemClick = (item: BusinessItem) => {
    router.push(`/business-areas/${item.id}`);
  };


  const handleConsultClick = () => {
    // 상담 신청하기 로직
    router.push('/consultation/apply');
  };

  if (loading) {
    return (
      <div className={styles.page}>
       <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true}/>
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error || allData.length === 0) {
    return (
      <div className={styles.page}>
       <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true}/>
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.error}>{error || '데이터를 불러올 수 없습니다.'}</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
     <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true}/>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={styles.container}>
        <PageHeader
          title="업무분야"
          breadcrumbs={[{ label: '업무 분야' }]}
          tabs={tabs}
          activeTabId={activeTabId ? String(activeTabId) : tabs[0]?.id}
          onTabChange={handleTabChange}
        />

        {/* Categories List - 현재 선택된 탭의 데이터 표시 */}
        {currentData && (
          <div className={styles.categoriesContainer}>
            <div className={styles.categoriesGrid}>
              {/* Left Column */}
              <div className={styles.leftColumn}>
                {currentData.minorCategories.filter((_, index) => index % 2 === 0).map((minorCategory) => {
                  const isExpanded = expandedCategories.has(minorCategory.id);
                  const items = minorCategory.items || [];

                  return (
                    <div key={minorCategory.id} className={styles.categoryColumn}>
                      <div
                        className={`${styles.categoryHeader} ${isExpanded ? styles.categoryHeaderExpanded : ''}`}
                        onClick={() => toggleCategory(minorCategory.id)}
                      >
                        <span className={styles.categoryName}>{minorCategory.name}</span>
                        <button
                          type="button"
                          className={`${styles.categoryToggle} ${isExpanded ? styles.categoryToggleExpanded : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory(minorCategory.id);
                          }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className={`${styles.chevronIcon} ${isExpanded ? styles.chevronIconRotated : ''}`}
                          >
                            <path
                              d="M6 9L12 15L18 9"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {isExpanded && items.length > 0 && (
                        <div className={styles.categoryItems}>
                          {items.map((item, index) => (
                            <div
                              key={item.id}
                              className={`${styles.categoryItem} ${index === 0 ? styles.categoryItemFirst : ''}`}
                              onClick={() => handleItemClick(item)}
                            >
                              <span className={styles.itemName}>{item.name}</span>
                              <Icon type="arrow-right2-gray" size={16} className={styles.arrowIcon} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className={styles.rightColumn}>
                {currentData.minorCategories.filter((_, index) => index % 2 === 1).map((minorCategory) => {
                  const isExpanded = expandedCategories.has(minorCategory.id);
                  const items = minorCategory.items || [];

                  return (
                    <div key={minorCategory.id} className={styles.categoryColumn}>
                      <div
                        className={`${styles.categoryHeader} ${isExpanded ? styles.categoryHeaderExpanded : ''}`}
                        onClick={() => toggleCategory(minorCategory.id)}
                      >
                        <span className={styles.categoryName}>{minorCategory.name}</span>
                        <button
                          type="button"
                          className={`${styles.categoryToggle} ${isExpanded ? styles.categoryToggleExpanded : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory(minorCategory.id);
                          }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className={`${styles.chevronIcon} ${isExpanded ? styles.chevronIconRotated : ''}`}
                          >
                            <path
                              d="M6 9L12 15L18 9"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {isExpanded && items.length > 0 && (
                        <div className={styles.categoryItems}>
                          {items.map((item, index) => (
                            <div
                              key={item.id}
                              className={`${styles.categoryItem} ${index === 0 ? styles.categoryItemFirst : ''}`}
                              onClick={() => handleItemClick(item)}
                            >
                              <span className={styles.itemName}>{item.name}</span>
                              <Icon type="arrow-right2-gray" size={16} className={styles.arrowIcon} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Floating Buttons */}
      <div className={styles.floatingButtons}>
        <FloatingButton
          variant="consult"
          label="상담 신청하기"
          onClick={handleConsultClick}
        />
      </div>
    </div>
  );
};

export default HierarchicalPage;


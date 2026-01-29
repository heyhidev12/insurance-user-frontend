import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import FloatingButton from '@/components/common/FloatingButton';
import PageHeader from '@/components/common/PageHeader';
import ContentBox from '@/components/common/ContentBox';
import Icon from '@/components/common/Icon';
import { get } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import styles from './detail.module.scss';

// 섹션 설정 매핑 객체
const SECTION_CONFIG: Record<string, { englishTitle: string; id: string; className: string }> = {
  '발생원인': { englishTitle: 'CAUSE', id: 'cause', className: 'causeContent' },
  '리스크': { englishTitle: 'RISK', id: 'risk', className: 'riskContent' },
  '체크포인트': { englishTitle: 'CHECK POINT', id: 'checkpoint', className: 'checkPointContent' },
  '함께 실행방안': { englishTitle: 'EXECUTION STRATEGY', id: 'execution', className: 'executionContent' },
  '케이스': { englishTitle: 'CASES', id: 'cases', className: 'casesContent' },
};

// Toast UI Viewer는 클라이언트 사이드에서만 로드
const Viewer = dynamic(
  () => import('@toast-ui/react-editor').then((mod) => mod.Viewer),
  { ssr: false }
);

interface SectionContent {
  content: string;
  section: string;
}

interface BusinessAreaDetail {
  id: number;
  name: string;
  subDescription: string;
  image: {
    id: number;
    url: string;
  };
  majorCategory: {
    id: number;
    name: string;
    sections: string[];
    isExposed: boolean;
    displayOrder: number;
  };
  minorCategory: {
    id: number;
    name: string;
    isExposed: boolean;
  };
  overview: string;
  sectionContents: SectionContent[];
  youtubeUrls: string[];
  isMainExposed: boolean;
  isExposed: boolean;
  displayOrder: number;
}

interface Expert {
  id: number;
  name: string;
  position?: string;
  affiliation?: string;
  tel?: string;
  phoneNumber?: string;
  email?: string;
  imageUrl?: string;
  mainPhoto?: {
    id: number;
    url: string;
  };
  workAreas?: string[] | Array<{ id: number; value: string }>;
  tags?: string[]; // 전문 분야 태그
}

interface InsightItem {
  id: number;
  title: string;
  content: string;
  thumbnail?: {
    url: string;
  };
  createdAt?: string;
  category?: string | { id: number; name: string; type: string }; // 카테고리 (문자열 또는 객체)
  author?: string; // 작성자
}

interface InsightResponse {
  items: InsightItem[];
  total: number;
}

const BusinessAreaDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState<BusinessAreaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [relatedNews, setRelatedNews] = useState<InsightItem[]>([]);
  const [expertsPage, setExpertsPage] = useState(0);
  const [newsPage, setNewsPage] = useState(0);
  const [youtubePage, setYoutubePage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<{ [key: string]: { title: string; author_name: string } }>({});
  const [isOverviewPassed, setIsOverviewPassed] = useState(false);
  const [isOverviewBannerExpanded, setIsOverviewBannerExpanded] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const overviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchBusinessAreaDetail();
      setImageError(false); // 새 데이터 로드 시 이미지 에러 상태 초기화
    }
  }, [id]);

  // 관련 데이터는 메인 데이터 로드 후에 가져오기
  useEffect(() => {
    if (id && typeof id === 'string' && data?.id) {
      console.log('Fetching related data for workArea:', id);
      fetchRelatedData();
    }
  }, [id, data?.id]);

  // 섹션 활성화 감지 (목차 하이라이트용)
  useEffect(() => {
    if (!data) return;

    // API 응답의 sections 배열을 기반으로 동적으로 섹션 목록 생성
    const sections = data.majorCategory.sections
      .map(sectionName => {
        const config = SECTION_CONFIG[sectionName];
        if (!config) return null;
        return { id: config.id, name: sectionName };
      })
      .filter((section): section is { id: string; name: string } => section !== null);

    const observers: IntersectionObserver[] = [];

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // 가장 많이 보이는 섹션을 찾기
      let maxRatio = 0;
      let activeId: string | null = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          const section = sections.find(s => sectionRefs.current[s.id] === entry.target);
          if (section && entry.intersectionRatio > 0.1) {
            activeId = section.id;
          }
        }
      });

      if (activeId) {
        setActiveSection(activeId);
      }
    };

    sections.forEach(({ id }) => {
      const ref = sectionRefs.current[id];
      if (!ref) return;

      const observer = new IntersectionObserver(
        handleIntersection,
        {
          threshold: [0, 0.1, 0.3, 0.5, 0.7, 1],
          rootMargin: '-10% 0px -70% 0px'
        }
      );

      observer.observe(ref);
      observers.push(observer);
    });

    // 초기 스크롤 위치 확인
    const checkInitialSection = () => {
      sections.forEach(({ id }) => {
        const ref = sectionRefs.current[id];
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isVisible = rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.3;
        if (isVisible) {
          setActiveSection(id);
        }
      });
    };

    // 약간의 지연 후 초기 섹션 확인
    const timeoutId = setTimeout(checkInitialSection, 100);

    return () => {
      observers.forEach(observer => observer.disconnect());
      clearTimeout(timeoutId);
    };
  }, [data]);

  // Overview 섹션이 화면에서 보이지 않는지 감지
  useEffect(() => {
    if (!overviewRef.current || !data?.overview) return;

    const handleScroll = () => {
      if (!overviewRef.current) return;
      const rect = overviewRef.current.getBoundingClientRect();
      // Overview 섹션이 화면에서 완전히 사라졌는지 확인 (화면 상단을 지나갔을 때)
      // rect.bottom <= 0이면 Overview가 화면 위로 완전히 사라짐
      // rect.bottom > 0이면 Overview가 다시 보임
      const isNotVisible = rect.bottom <= 0;
      setIsOverviewPassed(isNotVisible);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 상태 확인

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [data]);


  const fetchBusinessAreaDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<BusinessAreaDetail>(
        `${API_ENDPOINTS.BUSINESS_AREAS}/${id}`
      );

      if (response.data) {
        setData(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedData = async () => {
    try {
      // 관련 업무 세무사 가져오기 (workArea 파라미터 사용)
      if (id && typeof id === 'string') {
        try {
          const url = `${API_ENDPOINTS.MEMBERS}?page=1&limit=20&workArea=${data?.minorCategory?.id}`;
          console.log('Calling members API:', url);
          const membersResponse = await get<Expert[] | { items: Expert[]; data: Expert[] }>(url);
          console.log('Members API response:', membersResponse);
          
          if (membersResponse.data) {
            // 응답이 배열인 경우와 객체인 경우 모두 처리
            let expertsList: Expert[] = [];
            if (Array.isArray(membersResponse.data)) {
              expertsList = membersResponse.data;
            } else {
              const response = membersResponse.data as { items?: Expert[]; data?: Expert[] };
              expertsList = response.items || response.data || [];
            }
            // workAreas를 tags로 변환
            expertsList = expertsList.map(expert => ({
              ...expert,
              tags: expert.workAreas 
                ? expert.workAreas.map(area => typeof area === 'string' ? area : area.value)
                : expert.tags || [],
              tel: expert.tel || expert.phoneNumber,
              position: expert.position || expert.affiliation || '세무사',
            }));
            setExperts(expertsList);
          }
        } catch (err) {
          console.error('세무사 데이터를 불러오는 중 오류:', err);
          setExperts([]);
        }
      }

      // 관련 소식 가져오기
      try {
        const newsResponse = await get<InsightResponse>(
          `${API_ENDPOINTS.INSIGHTS}?page=1&limit=4`
        );
        if (newsResponse.data?.items) {
          setRelatedNews(newsResponse.data.items);
        }
      } catch (err) {
        // 실패 시 빈 배열
        setRelatedNews([]);
      }
    } catch (err) {
      console.error('관련 데이터를 불러오는 중 오류:', err);
    }
  };

  const getSectionContent = (sectionName: string): string => {
    if (!data?.sectionContents) return '';
    const section = data.sectionContents.find(
      (sc) => sc.section === sectionName
    );
    return section?.content || '';
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const fetchYouTubeVideoInfo = async (url: string) => {
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const response = await fetch(oembedUrl);
      if (response.ok) {
        const data = await response.json();
        return { title: data.title, author_name: data.author_name };
      }
    } catch (err) {
      console.error('YouTube video info fetch error:', err);
    }
    return null;
  };

  // YouTube 영상 정보 가져오기
  useEffect(() => {
    if (data?.youtubeUrls && data.youtubeUrls.length > 0) {
      const fetchAllVideoInfo = async () => {
        const videoInfoMap: { [key: string]: { title: string; author_name: string } } = {};
        await Promise.all(
          data.youtubeUrls.map(async (url) => {
            const info = await fetchYouTubeVideoInfo(url);
            if (info) {
              videoInfoMap[url] = info;
            }
          })
        );
        setYoutubeVideos(videoInfoMap);
      };
      fetchAllVideoInfo();
    }
  }, [data?.youtubeUrls]);

  const handleTopClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConsultClick = () => {
    router.push('/consultation/apply');
  };

  const handleExpertPrev = () => {
    if (expertsPage > 0) {
      setExpertsPage(expertsPage - 1);
    }
  };

  const handleExpertNext = () => {
    const maxPage = Math.ceil(experts.length / 4) - 1;
    if (expertsPage < maxPage) {
      setExpertsPage(expertsPage + 1);
    }
  };

  const handleNewsPrev = () => {
    if (newsPage > 0) {
      setNewsPage(newsPage - 1);
    }
  };

  const handleNewsNext = () => {
    if (newsPage < Math.ceil(relatedNews.length / 4) - 1) {
      setNewsPage(newsPage + 1);
    }
  };

  const handleYoutubePrev = () => {
    if (youtubePage > 0 && data?.youtubeUrls) {
      setYoutubePage(youtubePage - 1);
    }
  };

  const handleYoutubeNext = () => {
    if (data?.youtubeUrls && youtubePage < Math.ceil(data.youtubeUrls.length / 4) - 1) {
      setYoutubePage(youtubePage + 1);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.container}>
          <div className={styles.loading}>로딩 중...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error || '업무 분야를 찾을 수 없습니다.'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Breadcrumb 생성
  const breadcrumbs = [
    { label: '업무 분야', href: '/business-areas/hierarchical' },
    { label: data.majorCategory.name, href: '/business-areas/hierarchical' },
    { label: data.minorCategory.name, href: '/business-areas/hierarchical' },
    { label: data.name }, // 현재 페이지는 링크 없음
  ];

  return (
    <div className={styles.page}>
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={styles.container}>
        {/* Page Header with Breadcrumb */}
        <div className={styles.pageHeaderWrapper}>
          <PageHeader
            title={data.name}
            breadcrumbs={breadcrumbs}
            size="web"
          />
        </div>
      </div>

      {/* Hero Section - Full Width */}
      <div className={styles.heroSection}>
        {data.image?.url && !imageError ? (
          <img 
            src={data.image.url} 
            alt={data.name}
            className={styles.heroImage}
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>{data.name}</span>
          </div>
        )}
        <div className={styles.heroOverlay} />
        <p className={styles.heroLabel}>(업무 분야)</p>
        <h1 className={styles.heroTitle}>PRACTICE AREAS</h1>
        <div className={styles.heroContent}>
          <div className={styles.heroTitleRow}>
            <h2 className={styles.heroSubtitle}>{data.name}</h2>
          </div>
          {data.subDescription && (
            <p className={styles.heroDescription}>{data.subDescription}</p>
          )}
        </div>
      </div>

      {/* Fixed Overview Banner - Shows when Overview section is not visible */}
      {isOverviewPassed && data.overview && (
        <div
          className={`${styles.overviewFixedBanner} ${isOverviewBannerExpanded ? styles.expanded : ''}`}
          onClick={() => setIsOverviewBannerExpanded(!isOverviewBannerExpanded)}
        >
          <div className={styles.overviewFixedBannerContent}>
            {/* 모바일 헤더 (OVERVIEW + 토글) */}
            <div className={styles.overviewFixedBannerHeader}>
              <div className={styles.overviewFixedBannerTitle}>OVERVIEW</div>
              <div className={styles.overviewFixedBannerToggle}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d={isOverviewBannerExpanded ? "M5 12.5L10 7.5L15 12.5" : "M5 7.5L10 12.5L15 7.5"}
                    stroke="#FFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {/* 데스크탑 타이틀 */}
            <div className={styles.overviewFixedBannerTitleDesktop}>OVERVIEW</div>
            <div className={styles.overviewFixedBannerDivider} />
            <div className={`${styles.overviewFixedBannerBody} ${!isOverviewBannerExpanded ? styles.collapsed : ''}`}>
              <div className={styles.overviewContentInner}>
                <Viewer initialValue={data.overview} />
              </div>
            </div>
            {/* 데스크탑 토글 */}
            <div className={styles.overviewFixedBannerToggleDesktop}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d={isOverviewBannerExpanded ? "M5 12.5L10 7.5L15 12.5" : "M5 7.5L10 12.5L15 7.5"}
                  stroke="#FFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Tab Navigation - Shows when scrolled past overview */}
      {isOverviewPassed && (
        <nav className={styles.mobileStickyNav}>
          {data.majorCategory.sections.map((sectionName) => {
            const config = SECTION_CONFIG[sectionName];
            if (!config) return null;
            return (
              <button
                key={config.id}
                className={`${styles.mobileTabItem} ${activeSection === config.id ? styles.mobileTabItemActive : ''}`}
                onClick={() => document.getElementById(config.id)?.scrollIntoView({ behavior: 'smooth' })}
              >
                {activeSection === config.id && <span className={styles.mobileTabDot} />}
                <span>{sectionName}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Overview Section - Below Hero Image */}
      {data.overview && (
        <div ref={overviewRef} className={styles.overviewSectionWrapper}>
          <div className={styles.overviewContainer}>
            <section id="overview" className={styles.overviewSection}>
              <div className={styles.overviewHeader}>
                <h2 className={styles.overviewTitle}>OVERVIEW</h2>
                <svg className={styles.overviewHeaderToggle} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.overviewContent}>
                <div className={styles.overviewContentLayout}>
                  <div className={styles.overviewFieldTitle}>
                    {data.name}
                  </div>
                  <div className={styles.overviewDivider} />
                  <div className={styles.overviewContentInner}>
                    <Viewer initialValue={data.overview} />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      <div className={styles.container}>
        {/* Left Sidebar Navigation */}
        <div className={styles.sidebarNav}>
          {data.majorCategory.sections.map((sectionName) => {
            const config = SECTION_CONFIG[sectionName];
            if (!config) return null;
            return (
              <a
                key={config.id}
                href={`#${config.id}`}
                className={`${styles.navItem} ${activeSection === config.id ? styles.active : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(config.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className={styles.navLine} />
                <span className={styles.navText}>{sectionName}</span>
              </a>
            );
          })}
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {data.majorCategory.sections.map((sectionName) => {
            const config = SECTION_CONFIG[sectionName];
            if (!config) return null;
            const content = getSectionContent(sectionName);

            return (
              <section
                key={config.id}
                id={config.id}
                ref={(el) => { sectionRefs.current[config.id] = el; }}
                className={styles.section}
              >
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>{config.englishTitle}</h2>
                </div>
                <div className={styles.sectionContent}>
                  <h3 className={styles.subSectionTitle}>{sectionName}</h3>
                  <ContentBox>
                    <div className={styles[config.className] || styles.sectionContentInner}>
                      {content && (
                        <div className={styles.contentText}>
                          <Viewer initialValue={content} />
                        </div>
                      )}
                    </div>
                  </ContentBox>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Contact Section - Full Width like Overview */}
      <div className={styles.contactSectionWrapper}>
        <div className={styles.contactContainer}>
          <section className={styles.contactSection}>
            <div className={styles.contactBanner}>
              <div className={styles.contactBannerOverlay} />
              <div className={styles.contactContent}>
                <div className={styles.contactText}>
                  <h2 className={styles.contactMainTitle}>CONTACT</h2>
                  <p className={styles.contactDescription}>
                    경험과 전문성을 바탕으로,<br />
                    맞춤형 세무 해답을 제시합니다
                  </p>
                </div>
                <button
                  className={styles.consultButton}
                  onClick={handleConsultClick}
                >
                  구성원 신청
                  <Icon type="arrow-right2-white" size={24} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Related Experts Section - Full Width */}
      {experts.length > 0 && (
        <div className={styles.fullWidthSection}>
          <div className={styles.fullWidthContainer}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderContent}>
                <div>
                  <h2 className={styles.sectionTitle}>RELATED EXPERTS</h2>
                  <p className={styles.sectionSubtitle}>관련 업무 세무사</p>
                </div>
                <div className={styles.navigationButtons}>
                  <button
                    className={styles.navButton}
                    onClick={handleExpertPrev}
                    disabled={expertsPage === 0}
                  >
                    <Icon type="arrow-left2-white" size={20} />
                  </button>
                  <button
                    className={styles.navButton}
                    onClick={handleExpertNext}
                    disabled={expertsPage >= Math.ceil(experts.length / 4) - 1}
                  >
                    <Icon type="arrow-right2-white" size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.expertsContent}>
              <div
                className={styles.expertsGrid}
                style={{
                  transform: `translateX(-${expertsPage * 100}%)`,
                }}
              >
                {Array.from({ length: Math.ceil(experts.length / 4) }).map((_, pageIndex) => (
                  <div key={pageIndex} className={styles.expertsPage}>
                    {experts.slice(pageIndex * 4, (pageIndex + 1) * 4).map((expert, index) => (
                      <div 
                        key={expert.id || index} 
                        className={styles.expertCard}
                        onClick={() => router.push(`/experts/${expert.id}`)}
                      >
                        <div className={styles.expertImage}>
                          <img
                            src={expert.mainPhoto?.url || expert.imageUrl || '/images/common/default-avatar.png'}
                            alt={expert.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/common/default-avatar.png';
                            }}
                          />
                        </div>
                        <div className={styles.expertInfo}>
                          <div className={styles.expertNameRow}>
                            <p className={styles.expertName}>{expert.name}</p>
                            <p className={styles.expertPositionLabel}>{expert.position || '세무사'}</p>
                          </div>
                          <div className={styles.expertContact}>
                            {(expert.tel || expert.phoneNumber) && (
                              <div className={styles.expertContactItem}>
                                <span className={styles.expertContactLabel}>TEL</span>
                                <span className={styles.expertContactValue}>{expert.tel || expert.phoneNumber}</span>
                              </div>
                            )}
                            {expert.email && (
                              <div className={styles.expertContactItem}>
                                <span className={styles.expertContactLabel}>EMAIL</span>
                                <span className={styles.expertContactValue}>{expert.email}</span>
                              </div>
                            )}
                          </div>
                          {expert.tags && expert.tags.length > 0 && (
                            <div className={styles.expertTags}>
                              {expert.tags.map((tag, tagIndex) => {
                                // 인덱스에 따라 표시 변경
                                let indicator = '';
                                if (tagIndex === 0) {
                                  indicator = ' ■■■';
                                } else if (tagIndex === 1) {
                                  indicator = ' ■■□';
                                } else if (tagIndex === 2) {
                                  indicator = ' ■□□';
                                }
                                return (
                                  <span key={tagIndex} className={styles.expertTag}>
                                    {tag}{indicator}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
          </div>
        </div>
        )}

        {/* YouTube Section - Full Width */}
        {data.youtubeUrls && data.youtubeUrls.length > 0 && (
          <div className={styles.fullWidthSection}>
            <div className={styles.fullWidthContainer}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderContent}>
                <div>
                  <h2 className={styles.sectionTitle}>YOUTUBE</h2>
                  <p className={styles.sectionSubtitle}>함께공식 유튜브</p>
                </div>
                <div className={styles.navigationButtons}>
                  <button
                    className={styles.navButton}
                    onClick={handleYoutubePrev}
                    disabled={youtubePage === 0}
                  >
                    <Icon type="arrow-left2-white" size={20} />
                  </button>
                  <button
                    className={styles.navButton}
                    onClick={handleYoutubeNext}
                    disabled={youtubePage >= Math.ceil(data.youtubeUrls.length / 4) - 1}
                  >
                    <Icon type="arrow-right2-white" size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.youtubeContent}>
              <div
                className={styles.youtubeGrid}
                style={{
                  transform: `translateX(-${youtubePage * 100}%)`,
                }}
              >
                {Array.from({ length: Math.ceil(data.youtubeUrls.length / 4) }).map((_, pageIndex) => (
                  <div key={pageIndex} className={styles.youtubePage}>
                    {data.youtubeUrls.slice(pageIndex * 4, (pageIndex + 1) * 4).map((url, index) => {
                      const videoId = extractYouTubeId(url);
                      if (!videoId) return null;
                      return (
                        <div 
                          key={index} 
                          className={styles.youtubeCard}
                          onClick={() => window.open(url, '_blank')}
                        >
                          <div className={styles.youtubeThumbnail}>
                            <img
                              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                              alt={`YouTube video ${index + 1}`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                              }}
                            />
                          </div>
                          <div className={styles.youtubeInfo}>
                            <p className={styles.youtubeChannel}>
                              {youtubeVideos[url]?.author_name || '세무법인함께 TV'}
                            </p>
                            <p className={styles.youtubeTitle}>
                              {youtubeVideos[url]?.title || '세무 관련 정보를 제공하는 영상입니다'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>
          </div>
        </div>
        )}

        {/* Related News Section - Full Width */}
        {relatedNews.length > 0 && (
          <div className={styles.fullWidthSection}>
            <div className={styles.fullWidthContainer}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderContent}>
                <div>
                  <h2 className={styles.sectionTitle}>RELATED NEWS</h2>
                  <p className={styles.sectionSubtitle}>관련 소식</p>
                </div>
                <div className={styles.navigationButtons}>
                  <button
                    className={styles.navButton}
                    onClick={handleNewsPrev}
                    disabled={newsPage === 0}
                  >
                    <Icon type="arrow-left2-white" size={20} />
                  </button>
                  <button
                    className={styles.navButton}
                    onClick={handleNewsNext}
                    disabled={newsPage >= Math.ceil(relatedNews.length / 4) - 1}
                  >
                    <Icon type="arrow-right2-white" size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.newsContent}>
              <div
                className={styles.newsGrid}
                style={{
                  transform: `translateX(-${newsPage * 100}%)`,
                }}
              >
                {Array.from({ length: Math.ceil(relatedNews.length / 4) }).map((_, pageIndex) => (
                  <div key={pageIndex} className={styles.newsPage}>
                    {relatedNews.slice(pageIndex * 4, (pageIndex + 1) * 4).map((news) => (
                      <div
                        key={news.id}
                        className={styles.newsCard}
                        onClick={() => router.push(`/insights/${news.id}`)}
                      >
                        {news.thumbnail && (
                          <div className={styles.newsThumbnail}>
                            <img src={news.thumbnail.url} alt={news.title} />
                          </div>
                        )}
                        <div className={styles.newsInfo}>
                          <div className={styles.newsHeader}>
                            {news.category && (
                              <p className={styles.newsCategory}>
                                {typeof news.category === 'string' 
                                  ? news.category 
                                  : (typeof news.category === 'object' && news.category?.name 
                                    ? news.category.name 
                                    : '카테고리')}
                              </p>
                            )}
                            <h3 className={styles.newsTitle}>{news.title}</h3>
                          </div>
                          <div className={styles.newsMeta}>
                            {news.author && (
                              <>
                                <span className={styles.newsAuthor}>{news.author}</span>
                                <span className={styles.newsSeparator}>•</span>
                              </>
                            )}
                            {news.createdAt && (
                              <span className={styles.newsDate}>{formatDate(news.createdAt)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
          </div>
        </div>
        )}

      <Footer />

      {/* Floating Buttons */}
      <div className={styles.floatingButtons}>
        <FloatingButton
          variant="consult"
          label="상담 신청하기"
          onClick={handleConsultClick}
        />
        <FloatingButton variant="top" onClick={handleTopClick} />
      </div>
    </div>
  );
};

export default BusinessAreaDetailPage;


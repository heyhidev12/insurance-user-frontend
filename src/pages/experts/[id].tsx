import React, { useState, useEffect } from 'react';
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

// Toast UI Viewer는 클라이언트 사이드에서만 로드
const Viewer = dynamic(
  () => import('@toast-ui/react-editor').then((mod) => mod.Viewer),
  { ssr: false }
);

interface MemberDetail {
  id: number;
  name: string;
  mainPhoto?: {
    id: number;
    url: string;
  };
  subPhoto?: {
    id: number;
    url: string;
  };
  workAreas: string[] | Array<{ id: number; value: string }>;
  affiliation: string;
  phoneNumber: string;
  email: string;
  vcard?: {
    id: number;
    url: string;
  };
  pdf?: {
    id: number;
    url: string;
  };
  oneLineIntro: string;
  expertIntro: string;
  mainCases: string;
  education: string;
  careerAndAwards: string;
  booksActivitiesOther: string;
  isExposed: boolean;
  displayOrder: number;
}

interface InsightItem {
  id: number;
  title: string;
  content: string;
  thumbnail?: {
    url: string;
  };
  createdAt?: string;
  category?: string | { id: number; name: string; type: string };
  author?: string;
}

interface InsightResponse {
  items: InsightItem[];
  total: number;
}

const ExpertDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedNews, setRelatedNews] = useState<InsightItem[]>([]);
  const [newsPage, setNewsPage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (id) {
      fetchExpertDetail();
      fetchRelatedNews();
    }
  }, [id]);

  const fetchExpertDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<MemberDetail>(
        `${API_ENDPOINTS.MEMBERS}/${id}`
      );

      if (response.data) {
        setData(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('전문가 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async () => {
    try {
      const response = await get<InsightResponse>(
        `${API_ENDPOINTS.INSIGHTS}?page=1&limit=4`
      );

      if (response.data) {
        setRelatedNews(response.data.items || []);
      }
    } catch (err) {
      console.error('관련 소식을 불러오는 중 오류:', err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleTopClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConsultClick = () => {
    router.push('/consultation/apply');
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

  const handleDownloadVCard = () => {
    if (data?.vcard?.url) {
      window.open(data.vcard.url, '_blank');
    }
  };

  const handleDownloadPDF = () => {
    if (data?.pdf?.url) {
      window.open(data.pdf.url, '_blank');
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${data?.name} 세무사 - 세무법인 함께`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } catch (err) {
        // 사용자가 공유를 취소한 경우
      }
    } else {
      // 공유 API를 지원하지 않는 경우 클립보드에 복사
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('링크가 클립보드에 복사되었습니다.');
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
      }
    }
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
            <p>{error || '전문가를 찾을 수 없습니다.'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Breadcrumb 생성
  const breadcrumbs = [
    { label: '전문가 소개', href: '/experts' },
    { label: `${data.name} 세무사` },
  ];

  return (
    <div className={styles.page}>
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Hero Section - Full Width */}
      <div className={styles.heroSection}>
        {/* Breadcrumb */}
        <div className={styles.heroBreadcrumb}>
          <div className={styles.container}>
            <div className={styles.breadcrumbRow}>
              <PageHeader
                title=""
                breadcrumbs={breadcrumbs}
                size="web"
              />
              {/* 데스크탑 액션 버튼 */}
              {!isMobile && (
                <div className={styles.desktopActionButtons}>
                  <button
                    className={styles.desktopActionButton}
                    onClick={() => router.push(`/experts/${id}`)}
                    aria-label="이력서 보기"
                  >
                    <Icon type="resume" size={20} />
                  </button>
                  <span className={styles.desktopActionDivider} />
                  {data.vcard?.url && (
                    <>
                      <button
                        className={styles.desktopActionButton}
                        onClick={handleDownloadVCard}
                        aria-label="연락처 저장"
                      >
                        <Icon type="vcard" size={20} />
                      </button>
                      <span className={styles.desktopActionDivider} />
                    </>
                  )}
                  {data.pdf?.url && (
                    <>
                      <button
                        className={styles.desktopActionButton}
                        onClick={handleDownloadPDF}
                        aria-label="PDF 다운로드"
                      >
                        <Icon type="pdf" size={20} />
                      </button>
                      <span className={styles.desktopActionDivider} />
                    </>
                  )}
                  <button
                    className={styles.desktopActionButton}
                    onClick={handleShare}
                    aria-label="공유하기"
                  >
                    <Icon type="share" size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.heroBackground} />
        <div className={styles.heroContainer}>
          <div className={styles.heroImageWrapper}>
            {data.mainPhoto?.url && !imageError ? (
              <img 
                src={data.mainPhoto.url} 
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
          </div>
          <div className={styles.heroInfo}>
            <div className={styles.heroNameRow}>
              <h1 className={styles.heroName}>{data.name}</h1>
              <span className={styles.heroPosition}>세무사</span>
            </div>
            <div className={styles.heroContact}>
              {data.affiliation && (
                <div className={styles.heroContactItem}>
                  <Icon type="location" size={20} />
                  <span className={styles.heroContactLabel}>{data.affiliation}</span>
                </div>
              )}
              {data.phoneNumber && (
                <div className={styles.heroContactItem}>
                  <Icon type="call" size={20} />
                  <span className={styles.heroContactLabel}>{data.phoneNumber}</span>
                </div>
              )}
              {data.email && (
                <div className={styles.heroContactItem}>
                  <Icon type="mail" size={20} />
                  <span className={styles.heroContactLabel}>{data.email}</span>
                </div>
              )}
            </div>
            {/* 주요 업무 분야 */}
            {data.workAreas && data.workAreas.length > 0 && (
              <div className={`${styles.heroWorkAreas} ${isMobile ? styles.heroWorkAreasMobile : ''}`}>
                <p className={styles.heroWorkAreasLabel}>주요 업무 분야</p>
                <div className={styles.heroWorkAreasTags}>
                  {data.workAreas.map((area, index) => {
                    const areaName = typeof area === 'string' ? area : (area?.value || String(area?.id || ''));
                    const indicator = index === 0 ? '■■■' : index === 1 ? '■■□' : '■□□';
                    return (
                      <span key={index} className={styles.heroWorkAreaTag}>
                        {areaName} {indicator}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            {/* 모바일 액션 버튼 - 주요 업무 분야 아래 */}
            {isMobile && (
              <div className={styles.heroActionButtons}>
                <button
                  className={styles.heroActionButton}
                  onClick={() => router.push(`/experts/${id}`)}
                  aria-label="이력서 보기"
                >
                  <Icon type="resume" size={20} />
                </button>
                {data.vcard?.url && (
                  <button
                    className={styles.heroActionButton}
                    onClick={handleDownloadVCard}
                    aria-label="연락처 저장"
                  >
                    <Icon type="vcard" size={20} />
                  </button>
                )}
                {data.pdf?.url && (
                  <button
                    className={styles.heroActionButton}
                    onClick={handleDownloadPDF}
                    aria-label="PDF 다운로드"
                  >
                    <Icon type="pdf" size={20} />
                  </button>
                )}
                <button
                  className={styles.heroActionButton}
                  onClick={handleShare}
                  aria-label="공유하기"
                >
                  <Icon type="share" size={20} />
                </button>
              </div>
            )}
            {/* 모바일 인용구 - 아이콘 아래 */}
            {isMobile && data.oneLineIntro && (
              <div className={styles.heroQuoteMobile}>
                <div className={styles.heroQuoteMobileContent}>
                  <img src="/images/experts/icons/quote-right.svg" alt="" className={styles.quoteMarkMobile} />
                  <p className={styles.heroQuoteMobileText}>{data.oneLineIntro}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {!isMobile && data.oneLineIntro && (
          <div className={styles.heroQuote}>
            <div className={styles.heroQuoteContent}>
              <img src="/images/experts/icons/quote-right.svg" alt="" className={`${styles.quoteMark} ${styles.quoteMarkLeft}`} />
              <p className={styles.heroQuoteText}>{data.oneLineIntro}</p>
              <img src="/images/experts/icons/quote-left.svg" alt="" className={styles.quoteMark} />
            </div>
          </div>
        )}
      </div>

      {/* About the Expert Section with Sidebar */}
      <div className={styles.aboutSectionWrapper}>
        <div className={styles.aboutContainer}>
          {/* About the Expert Section - Full Width */}
          {data.expertIntro && (
            <section className={styles.aboutSection}>
              <div className={styles.aboutHeader}>
                <h2 className={styles.aboutTitle}>About<br />the Expert</h2>
              </div>
              <div className={styles.aboutContent}>
                <div className={styles.aboutContentLayout}>
                  <div className={styles.aboutFieldTitle}>
                    전문가 소개
                  </div>
                  <div className={styles.aboutDivider} />
                  <div className={styles.aboutContentInner}>
                    <Viewer initialValue={data.expertIntro} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Sidebar and Main Content - Two Columns */}
          <div className={styles.aboutLayout}>
            {/* Sidebar - 모바일에서는 숨김 (Hero에서 표시) */}
            {!isMobile && (
              <div className={styles.sidebar}>
                <div className={styles.sidebarCard}>
                  {data.subPhoto?.url && (
                    <div className={styles.sidebarImage}>
                      <img src={data.subPhoto.url} alt={data.name} />
                    </div>
                  )}
                  <div className={styles.sidebarInfo}>
                    <div className={styles.sidebarNameRow}>
                      <h3 className={styles.sidebarName}>{data.name}</h3>
                      <span className={styles.sidebarPosition}>세무사</span>
                    </div>
                    <div className={styles.sidebarContact}>
                      {data.affiliation && (
                        <div className={styles.sidebarContactItem}>
                          <Icon type="location" size={20} />
                          <span>{data.affiliation}</span>
                        </div>
                      )}
                      {data.phoneNumber && (
                        <div className={styles.sidebarContactItem}>
                          <Icon type="call" size={20} />
                          <span>{data.phoneNumber}</span>
                        </div>
                      )}
                      {data.email && (
                        <div className={styles.sidebarContactItem}>
                          <Icon type="mail" size={20} />
                          <span>{data.email}</span>
                        </div>
                      )}
                    </div>
                    {data.workAreas && data.workAreas.length > 0 && (
                      <div className={styles.sidebarWorkAreas}>
                        <p className={styles.sidebarWorkAreasLabel}>주요 업무 분야</p>
                        <div className={styles.sidebarWorkAreasTags}>
                          {data.workAreas.map((area, index) => {
                            const areaName = typeof area === 'string' ? area : (area?.value || String(area?.id || ''));
                            const indicator = index === 0 ? '■■■' : index === 1 ? '■■□' : '■□□';
                            return (
                              <span key={index} className={styles.sidebarWorkAreaTag}>
                                {areaName}{indicator}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className={styles.mainContent}>
              {/* Main Cases Section */}
              {data.mainCases && (
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>주요 처리 사례</h2>
                  </div>
                  <div className={styles.sectionContent}>
                    <ContentBox>
                      <div className={styles.listContent}>
                        <Viewer initialValue={data.mainCases} />
                      </div>
                    </ContentBox>
                  </div>
                </section>
              )}

              {/* Education Section */}
              {data.education && (
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>학력</h2>
                  </div>
                  <div className={styles.sectionContent}>
                    <ContentBox>
                      <div className={styles.listContent}>
                        <Viewer initialValue={data.education} />
                      </div>
                    </ContentBox>
                  </div>
                </section>
              )}

              {/* Career and Awards Section */}
              {data.careerAndAwards && (
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>경력 및 수상 실적</h2>
                  </div>
                  <div className={styles.sectionContent}>
                    <ContentBox>
                      <div className={styles.listContent}>
                        <Viewer initialValue={data.careerAndAwards} />
                      </div>
                    </ContentBox>
                  </div>
                </section>
              )}

              {/* Books, Activities, Other Section */}
              {data.booksActivitiesOther && (
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>저서·활동·기타</h2>
                  </div>
                  <div className={styles.sectionContent}>
                    <ContentBox>
                      <div className={styles.listContent}>
                        <Viewer initialValue={data.booksActivitiesOther} />
                      </div>
                    </ContentBox>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <div className={styles.fullWidthSection}>
          <div className={styles.fullWidthContainer}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderContent}>
                  <div>
                    <h2 className={styles.sectionTitleEn}>RELATED NEWS</h2>
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
                          {news.thumbnail?.url && (
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
        <FloatingButton
          variant="top"
          onClick={handleTopClick}
        />
      </div>
    </div>
  );
};

export default ExpertDetailPage;


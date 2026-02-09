import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import PageHeader from '@/components/common/PageHeader';
import FloatingButton from '@/components/common/FloatingButton';
import Tab from '@/components/common/Tab';
import { TextField } from '@/components/common/TextField';
import Checkbox from '@/components/common/Checkbox';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import SEO from '@/components/SEO';
import TermsModal, { TermsType } from '@/components/common/TermsModal';
import { get, post } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import type { EducationItem, EducationListResponse, EducationType } from '@/types/education';
import styles from './education.module.scss';

const EducationPage: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'education' | 'newsletter'>('education');

  // 뉴스레터 탭 노출 여부
  const [newsletterExposed, setNewsletterExposed] = useState(true);
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [newEducationList, setNewEducationList] = useState<EducationItem[]>([]); // 신규 교육용 별도 목록
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<EducationType | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newEducationIndex, setNewEducationIndex] = useState(0);

  /**
   * GLOBAL RULE — MEMBER TYPE HANDLING (MANDATORY)
   * - Guest: omit memberType/isApproved
   * - INSURANCE + approved: memberType=INSURANCE&isApproved=true
   * - INSURANCE + not approved: treat as Guest (omit both)
   * - Other member types: memberType=<USER_TYPE>
   */
  const buildMemberParams = (): { memberType?: string; isApproved?: 'true' } => {
    if (typeof window === 'undefined') return {};

    const userStr = localStorage.getItem('user');
    if (!userStr) return {};

    try {
      const user = JSON.parse(userStr) as { memberType?: string; isApproved?: boolean } | null;
      if (!user?.memberType) return {};

      if (user.memberType === 'INSURANCE') {
        if (user.isApproved === true) {
          return { memberType: 'INSURANCE', isApproved: 'true' };
        }
        return {};
      }

      return { memberType: user.memberType };
    } catch {
      return {};
    }
  };
  
  // Newsletter form state
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [optionalAgreed, setOptionalAgreed] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Terms modal state
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [activeTermsType, setActiveTermsType] = useState<TermsType>('privacy');

  // Open terms modal handler
  const handleOpenTermsModal = (termsType: TermsType) => {
    setActiveTermsType(termsType);
    setIsTermsModalOpen(true);
  };

  // Close terms modal handler
  const handleCloseTermsModal = () => {
    setIsTermsModalOpen(false);
  };

  // Confirm terms modal handler - checks the corresponding checkbox
  const handleConfirmTermsModal = () => {
    if (activeTermsType === 'privacy') {
      setPrivacyAgreed(true);
    } else if (activeTermsType === 'marketing') {
      setOptionalAgreed(true);
    }
  };

  // 로그인된 사용자 정보로 뉴스레터 폼 미리 채우기
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.name && !newsletterName) {
          setNewsletterName(user.name);
        }
        // email 또는 loginId(이메일 형식인 경우) 사용
        const email = user.email || (user.loginId && user.loginId.includes('@') ? user.loginId : '');
        if (email && !newsletterEmail) {
          setNewsletterEmail(email);
        }
      } catch (e) {
        // 파싱 실패 시 무시
      }
    }
  }, []);

  // 뉴스레터 탭 노출 여부 확인
  useEffect(() => {
    const checkNewsletterExposed = async () => {
      try {
        const response = await get<{ isExposed: boolean }>(API_ENDPOINTS.NEWSLETTER.PAGE);
        if (response.data) {
          setNewsletterExposed(response.data.isExposed);
        } else {
          setNewsletterExposed(false);
        }
      } catch {
        setNewsletterExposed(false);
      }
    };
    checkNewsletterExposed();
  }, []);

  // 뉴스레터 탭이 숨겨진 상태에서 newsletter 탭에 접근하면 education으로 변경
  useEffect(() => {
    if (!newsletterExposed && activeSubTab === 'newsletter') {
      setActiveSubTab('education');
    }
  }, [newsletterExposed, activeSubTab]);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Handle newsletter subscription
  const handleNewsletterSubmit = async () => {
    // Reset errors
    setNameError('');
    setEmailError('');
    
    // Validate name
    if (!newsletterName.trim()) {
      setNameError('이름을 입력해주세요');
      return;
    }
    
    // Validate email
    if (!newsletterEmail.trim()) {
      setEmailError('이메일을 입력해주세요');
      return;
    }
    
    if (!validateEmail(newsletterEmail)) {
      setEmailError('올바른 이메일 주소를 입력해주세요');
      return;
    }
    
    // Validate privacy agreement
    if (!privacyAgreed) {
      alert('개인정보 처리 방침 이용 동의는 필수입니다.');
      return;
    }
    
    // Prevent double submission
    if (isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await post(
        API_ENDPOINTS.NEWSLETTER.SUBSCRIBE,
        {
          name: newsletterName.trim(),
          email: newsletterEmail.trim(),
        }
      );
      
      if (response.error) {
        alert(response.error || '뉴스레터 구독 중 오류가 발생했습니다.');
        return;
      }
      
      // Success
      alert('뉴스레터 구독이 완료되었습니다.');
      window.gtag?.("event", "newsletter_submit", {
        event_category: "engagement",
        event_label: "newsletter_form",
      });
      
      // Reset form
      setNewsletterName('');
      setNewsletterEmail('');
      setPrivacyAgreed(false);
      setOptionalAgreed(false);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('뉴스레터 구독 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check if form is valid
  const isFormValid = newsletterName.trim() !== '' && 
                      newsletterEmail.trim() !== '' && 
                      validateEmail(newsletterEmail) && 
                      privacyAgreed;

  const subTabItems = [
    { id: 'education', label: '교육/세미나 안내' },
    { id: 'newsletter', label: '뉴스레터' },
  ];

  // 뉴스레터 탭 노출 여부에 따라 탭 필터링
  const filteredSubTabItems = subTabItems.filter(tab => {
    if (tab.id === 'newsletter') return newsletterExposed;
    return true;
  });

  // 신규 교육 목록 가져오기 (필터 무관, 최초 1회)
  useEffect(() => {
    if (activeSubTab === 'education') {
      fetchNewEducationList();
    }
  }, [activeSubTab]);

  const fetchNewEducationList = async () => {
    try {
      const memberParams = buildMemberParams();
      const params = new URLSearchParams({
        page: '1',
        limit: '20',
        sort: 'new',
        ...(memberParams.memberType ? { memberType: memberParams.memberType } : {}),
        ...(memberParams.isApproved ? { isApproved: memberParams.isApproved } : {}),
      });

      const response = await get<EducationListResponse>(
        `${API_ENDPOINTS.TRAINING_SEMINARS}?${params.toString()}`
      );
      if (response.data) {
        setNewEducationList(response.data.items);
      }
    } catch (err) {
      console.error('신규 교육 목록 로딩 실패:', err);
    }
  };

  // 전체 교육 목록 가져오기 (필터 적용)
  useEffect(() => {
    if (activeSubTab === 'education') {
      setCurrentPage(1); // 타입 변경 시 첫 페이지로 리셋
    }
  }, [activeSubTab, selectedType]);

  useEffect(() => {
    if (activeSubTab === 'education') {
      fetchEducationList();
    }
  }, [activeSubTab, selectedType, currentPage]);

  const fetchEducationList = async () => {
    setLoading(true);
    setError(null);

    try {
      const memberParams = buildMemberParams();
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        sort: 'deadline',
        ...(memberParams.memberType ? { memberType: memberParams.memberType } : {}),
        ...(memberParams.isApproved ? { isApproved: memberParams.isApproved } : {}),
      });

      if (selectedType !== 'ALL') {
        params.append('type', selectedType);
      }

      const response = await get<EducationListResponse>(
        `${API_ENDPOINTS.TRAINING_SEMINARS}?${params.toString()}`
      );

      if (response.data) {
        setEducationList(response.data.items);
        const limit = 9; // 요청한 limit 사용
        const calculatedTotalPages = Math.ceil(response.data.total / limit);
        setTotalPages(calculatedTotalPages);
        console.log('Education pagination:', {
          total: response.data.total,
          limit,
          totalPages: calculatedTotalPages,
          items: response.data.items.length
        });
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 신규 교육 캐러셀 로직 (newEducationList 사용)
  const itemsPerPage = 3;
  const maxIndex = Math.max(0, Math.ceil(newEducationList.length / itemsPerPage) - 1);
  const startIndex = newEducationIndex * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const newEducations = newEducationList.slice(startIndex, endIndex);
  const hasNewEducationData = newEducationList.length > 0;
  
  const handlePrevEducation = () => {
    setNewEducationIndex((prev) => Math.max(0, prev - 1));
  };
  
  const handleNextEducation = () => {
    setNewEducationIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return dateString.replace(/\./g, '.');
  };

  // 모집 마감일까지 남은 일수 계산
  const getDaysUntilDeadline = (endDate: string) => {
    const today = new Date();
    const deadline = new Date(endDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))+1;
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <>
      <SEO menuName="교육/세미나" />
      <div className={styles.page}>
     <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true}/>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className={styles.container}>
        <div className={styles.pageHeaderWrapper}>
          <PageHeader
            title="교육/세미나"
            breadcrumbs={[{ label: '교육/세미나' }]}
          />
        </div>

        <div className={styles.tabSection}>
          <Tab
            items={filteredSubTabItems}
            activeId={activeSubTab}
            onChange={(tabId) => {
              setActiveSubTab(tabId as 'education' | 'newsletter');
            }}
            style="box"
            size="large"
            showActiveDot={true}
          />
        </div>

        {activeSubTab === 'education' && (
          <>
            <div className={styles.heroSection}>
              <div className={styles.heroOverlay} />
              <p className={styles.heroLabel}>(교육/세미나)</p>
              <div className={styles.heroTitle}>
                <h2>EDUCATION</h2>
                <h2><span className={styles.heroTitleItalic}>&</span> SEMINARS</h2>
              </div>
              <div className={styles.heroContent}>
                <div className={styles.heroDescription}>
                  <p className={styles.heroDescriptionMain}>
                    기업의 성장을 돕는 <span className={styles.heroDescriptionItalic}>가장 확실한 방법!</span>
                  </p>
                  <p className={styles.heroDescriptionSub}>
                    세무법인 함께의 <strong>전문가 교육</strong>은
                    <br className={styles.mobileBreak} />
                    기업의 <strong>성공적인 내일</strong>을 만듭니다.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSubTab === 'education' && (
          <div className={styles.content}>
            {loading ? (
              <div className={styles.emptyState}>
                <p>로딩 중...</p>
              </div>
            ) : error ? (
              <div className={styles.emptyState}>
                <p>{error}</p>
              </div>
            ) : (
              <>
                {newEducationList.length > 0 && (
                  <div className={styles.newSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.sectionTitleWrapper}>
                        <div className={styles.sectionTitleBg}>
                          <h3>New</h3>
                        </div>
                        <h4 className={styles.sectionTitle}>신규 교육</h4>
                      </div>
                      {hasNewEducationData && newEducationList.length > itemsPerPage && (
                        <div className={styles.sectionNav}>
                          <button
                            className={styles.navButton}
                            onClick={handlePrevEducation}
                            disabled={newEducationIndex === 0}
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M12.5 5L7.5 10L12.5 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button
                            className={styles.navButton}
                            onClick={handleNextEducation}
                            disabled={newEducationIndex >= maxIndex}
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M7.5 5L12.5 10L7.5 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className={styles.educationGrid}>
                      {newEducations.map((item) => {
                        const daysLeft = getDaysUntilDeadline(item.recruitmentEndDate);
                        return (
                          <div
                            key={item.id}
                            className={styles.educationCard}
                            onClick={() => router.push(`/education/${item.id}`)}
                          >
                            <div className={styles.cardImage}>
                              <img src={item.image?.url || '/images/education/default-thumbnail.png'} alt={item.name} />
                            </div>
                            <div className={styles.cardContent}>
                              <div className={styles.cardLabels}>
                                {daysLeft > 0 ? (
                                  <span className={styles.labelRed}>
                                    신청마감 D-{daysLeft}
                                  </span>
                                ) : (
                                  <span className={styles.labelGray}>
                                    신청마감
                                  </span>
                                )}
                                <span className={styles.labelWhite}>
                                  {item.typeLabel}
                                </span>
                              </div>
                              <h3 className={styles.cardTitle}>{item.name}</h3>
                              <div className={styles.cardInfo}>
                                <p className={styles.cardLocation}>{item.location}</p>
                                <div className={styles.cardDateWrapper}>
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.cardDateIcon}>
                                    <path d="M3 2V4M13 2V4M2 6H14M3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2Z" stroke="#d8d8d8" strokeWidth="1" strokeLinecap="round"/>
                                  </svg>
                                  <p className={styles.cardDate}>
                                    {item.educationDates[0]} {item.educationTimeSlots[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className={styles.allSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitleWrapper}>
                      <div className={styles.sectionTitleBg}>
                        <h3>ALL</h3>
                      </div>
                      <h4 className={styles.sectionTitle}>전체 교육</h4>
                    </div>
                  </div>
                  <div className={styles.allContent}>
                    <div className={styles.sidebar}>
                      <div
                        className={`${styles.sidebarTab} ${selectedType === 'ALL' ? styles.sidebarTabActive : ''}`}
                        onClick={() => setSelectedType('ALL')}
                      >
                        {selectedType === 'ALL' && <span className={styles.sidebarDot} />}
                        <span>전체</span>
                      </div>
                      <div
                        className={`${styles.sidebarTab} ${selectedType === 'VOD' ? styles.sidebarTabActive : ''}`}
                        onClick={() => setSelectedType('VOD')}
                      >
                        {selectedType === 'VOD' && <span className={styles.sidebarDot} />}
                        <span>VOD</span>
                      </div>
                      <div
                        className={`${styles.sidebarTab} ${selectedType === 'TRAINING' ? styles.sidebarTabActive : ''}`}
                        onClick={() => setSelectedType('TRAINING')}
                      >
                        {selectedType === 'TRAINING' && <span className={styles.sidebarDot} />}
                        <span>교육</span>
                      </div>
                      <div
                        className={`${styles.sidebarTab} ${selectedType === 'LECTURE' ? styles.sidebarTabActive : ''}`}
                        onClick={() => setSelectedType('LECTURE')}
                      >
                        {selectedType === 'LECTURE' && <span className={styles.sidebarDot} />}
                        <span>강의</span>
                      </div>
                      <div
                        className={`${styles.sidebarTab} ${selectedType === 'SEMINAR' ? styles.sidebarTabActive : ''}`}
                        onClick={() => setSelectedType('SEMINAR')}
                      >
                        {selectedType === 'SEMINAR' && <span className={styles.sidebarDot} />}
                        <span>세미나</span>
                      </div>
                    </div>
                    <div className={styles.mainContent}>
                      {educationList.length > 0 ? (
                        <>
                          <div className={styles.educationGrid}>
                            {educationList.map((item) => {
                              const daysLeft = getDaysUntilDeadline(item.recruitmentEndDate);
                              return (
                                <div
                                  key={item.id}
                                  className={styles.educationCard}
                                  onClick={() => router.push(`/education/${item.id}`)}
                                >
                                  <div className={styles.cardImage}>
                                    <img src={item.image?.url || '/images/education/default-thumbnail.png'} alt={item.name} />
                                    {daysLeft <= 0 && <div className={styles.cardImageOverlay} />}
                                  </div>
                                  <div className={styles.cardContent}>
                                    <div className={styles.cardLabels}>
                                      {daysLeft > 0 ? (
                                        <span className={styles.labelRed}>
                                          신청마감 D-{daysLeft}
                                        </span>
                                      ) : (
                                        <span className={styles.labelGray}>
                                          신청마감
                                        </span>
                                      )}
                                      <span className={styles.labelWhite}>
                                        {item.typeLabel}
                                      </span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{item.name}</h3>
                                    <div className={styles.cardInfo}>
                                      <p className={styles.cardLocation}>{item.location}</p>
                                      <div className={styles.cardDateWrapper}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.cardDateIcon}>
                                          <path d="M3 2V4M13 2V4M2 6H14M3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2Z" stroke="#d8d8d8" strokeWidth="1" strokeLinecap="round"/>
                                        </svg>
                                        <p className={styles.cardDate}>
                                          {item.educationDates[0].replace(/\-/g, '.')} {item.educationTimeSlots[0]}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className={styles.paginationWrapper}>
                            <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={(page) => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              visiblePages={4}
                            />
                          </div>
                        </>
                      ) : (
                        <div className={styles.emptyState}>
                          <img src="/images/education/empty-icon.svg" alt="Empty" className={styles.emptyIcon} />
                          <p>등록된 세미나/교육이 없습니다</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeSubTab === 'newsletter' && (
          <div className={styles.newsletterSection}>
            <div className={styles.newsletterHero}>
              <div className={styles.newsletterHeroOverlay} />
              <div className={styles.newsletterHeroContent}>
                <div className={styles.newsletterLeft}>
                  <p className={styles.newsletterLabel}>(뉴스레터)</p>
                  <h2 className={styles.newsletterTitle}>NEWSLETTER</h2>
                  <p className={styles.newsletterDescription}>
                    알면 이익이 되는세무 정보,
                    <br />
                    구독하고 빠르게 전달 받으세요
                  </p>
                </div>
                <div className={styles.newsletterRight}>
                  <div className={styles.newsletterForm}>
                    <div className={styles.newsletterFormFields}>
                      <TextField
                        variant="line"
                        label="이름"
                        required
                        placeholder="수신자 명"
                        value={newsletterName}
                        onChange={(value) => {
                          setNewsletterName(value);
                          if (nameError) setNameError('');
                        }}
                        error={!!nameError}
                        errorMessage={nameError}
                        fullWidth
                        className={styles.newsletterTextField}
                      />
                      <TextField
                        variant="line"
                        label="이메일"
                        required
                        type="email"
                        placeholder="뉴스레터를 받을 이메일 주소"
                        value={newsletterEmail}
                        onChange={(value) => {
                          setNewsletterEmail(value);
                          if (emailError) setEmailError('');
                        }}
                        error={!!emailError}
                        errorMessage={emailError}
                        fullWidth
                        className={styles.newsletterTextField}
                      />
                    </div>
                    <div className={styles.newsletterCheckboxes}>
                      <div className={styles.newsletterCheckboxRow}>
                        <Checkbox
                          variant="square"
                          checked={privacyAgreed}
                          onChange={setPrivacyAgreed}
                          label="[필수] 개인정보 처리 방침 이용 동의"
                        />
                        <button type="button" className={styles.newsletterLink} onClick={() => handleOpenTermsModal('privacy')}>보기</button>
                      </div>
                      <div className={styles.newsletterCheckboxRow}>
                        <Checkbox
                          variant="square"
                          checked={optionalAgreed}
                          onChange={setOptionalAgreed}
                          label="[선택] OO OOOOO 이용 동의"
                        />
                        <button type="button" className={styles.newsletterLink} onClick={() => handleOpenTermsModal('marketing')}>보기</button>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      size="large"
                      fullWidth
                      disabled={!isFormValid || isSubmitting}
                      onClick={handleNewsletterSubmit}
                    >
                      {isSubmitting ? '구독 중...' : '구독하기'}
                    </Button>
                  </div>
                </div>
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
          onClick={() => router.push('/consultation/apply')}
        />
      </div>

      {/* Terms Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={handleCloseTermsModal}
        onConfirm={handleConfirmTermsModal}
        termsType={activeTermsType}
      />
    </div>
    </>
  );
};

export default EducationPage;


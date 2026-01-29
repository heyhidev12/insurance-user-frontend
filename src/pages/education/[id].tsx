import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import Icon from '@/components/common/Icon';
import DatePickerModal from '@/components/education/DatePickerModal';
import ApplicationModal from '@/components/education/ApplicationModal';
import { get, del } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import type { EducationDetail, ApplicationStatus } from '@/types/education';
import styles from './detail.module.scss';

interface UserProfile {
  id: number;
  loginId: string;
  name: string;
}

// Toast UI Viewer는 클라이언트 사이드에서만 로드
const Viewer = dynamic(
  () => import('@toast-ui/react-editor').then((mod) => mod.Viewer),
  { ssr: false }
);

const EducationDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [education, setEducation] = useState<EducationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // 사용자 정보 가져오기
  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (id) {
      fetchEducationDetail();
    }
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const response = await get<UserProfile>(API_ENDPOINTS.AUTH.ME);
      if (response.data) {
        setUserProfile(response.data);
      }
    } catch (err) {
      console.error('유저 정보를 불러오는 중 오류:', err);
    }
  };

  const fetchEducationDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<EducationDetail>(
        `${API_ENDPOINTS.TRAINING_SEMINARS}/${id}`
      );

      if (response.data) {
        setEducation(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilDeadline = (endDate: string) => {
    const today = new Date();
    const deadline = new Date(endDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (dateString: string) => {
    return dateString.replace(/\./g, '.');
  };

  // 교육 일자 포맷팅 (첫 번째 날짜 ~ 마지막 날짜 형식)
  const formatEducationDates = (dates: string[]) => {
    if (!dates || dates.length === 0) return '';
    
    const formatSingleDate = (dateString: string) => {
      // 날짜 문자열을 Date 객체로 변환 (YYYY.MM.DD 또는 YYYY-MM-DD 형식 지원)
      const normalizedDate = dateString.replace(/\./g, '-');
      const dateObj = new Date(normalizedDate);
      
      // 유효하지 않은 날짜인 경우 원본 반환
      if (isNaN(dateObj.getTime())) {
        return dateString;
      }
      
      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
      const weekday = weekdays[dateObj.getDay()];
      
      // YY.MM.DD 형식으로 변환
      const year = dateObj.getFullYear().toString().slice(-2);
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      
      return `${year}.${month}.${day} (${weekday})`;
    };
    
    if (dates.length === 1) {
      return formatSingleDate(dates[0]);
    }
    
    // 첫 번째와 마지막 날짜만 사용
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    
    const firstNormalized = firstDate.replace(/\./g, '-');
    const lastNormalized = lastDate.replace(/\./g, '-');
    const firstDateObj = new Date(firstNormalized);
    const lastDateObj = new Date(lastNormalized);
    
    // 유효하지 않은 날짜인 경우 원본 반환
    if (isNaN(firstDateObj.getTime()) || isNaN(lastDateObj.getTime())) {
      return `${firstDate} ~ ${lastDate}`;
    }
    
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const firstWeekday = weekdays[firstDateObj.getDay()];
    const lastWeekday = weekdays[lastDateObj.getDay()];
    
    const firstYear = firstDateObj.getFullYear().toString().slice(-2);
    const firstMonth = String(firstDateObj.getMonth() + 1).padStart(2, '0');
    const firstDay = String(firstDateObj.getDate()).padStart(2, '0');
    
    const lastYear = lastDateObj.getFullYear().toString().slice(-2);
    const lastMonth = String(lastDateObj.getMonth() + 1).padStart(2, '0');
    const lastDay = String(lastDateObj.getDate()).padStart(2, '0');
    
    // 같은 연도면 두 번째 날짜에서 연도 생략
    const firstFormatted = `${firstYear}.${firstMonth}.${firstDay} (${firstWeekday})`;
    const lastFormatted = firstYear === lastYear 
      ? `${lastMonth}.${lastDay} (${lastWeekday})`
      : `${lastYear}.${lastMonth}.${lastDay} (${lastWeekday})`;
    
    return `${firstFormatted} ~ ${lastFormatted}`;
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

  if (error || !education) {
    return (
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.container}>
          <div className={styles.error}>{error || '교육 정보를 찾을 수 없습니다.'}</div>
        </div>
        <Footer />
      </div>
    );
  }

  const daysLeft = getDaysUntilDeadline(education.recruitmentEndDate);

  // 모집 종료 여부 확인 (모달과 동일한 로직)
  const checkRecruitmentClosed = () => {
    if (!education.recruitmentEndDate) return false;
    const today = new Date();
    const endDate = new Date(education.recruitmentEndDate);
    return today > endDate;
  };

  const isRecruitmentClosed = checkRecruitmentClosed();

  // applications 배열에서 현재 사용자의 가장 최근 신청 찾기 (모달과 동일한 로직)
  const getUserApplication = () => {
    if (!userProfile || !education.applications || education.applications.length === 0) {
      return null;
    }
    // 현재 유저의 모든 신청 찾기
    const userApps = education.applications.filter(
      (app: any) => app.userId === userProfile.id || app.name === userProfile.name
    );
    if (userApps.length === 0) return null;
    // 가장 최근 신청 반환 (id가 큰 것 또는 appliedAt이 최신인 것)
    return userApps.sort((a: any, b: any) => {
      if (a.appliedAt && b.appliedAt) {
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
      }
      return (b.id || 0) - (a.id || 0);
    })[0];
  };

  const userApplication = getUserApplication();
  const hasApplication = !!userApplication;

  // 버튼 상태 결정 (모달과 동일한 로직)
  const getButtonState = () => {
    if (isRecruitmentClosed) {
      return 'recruitment_closed';
    }
    if (hasApplication) {
      const status = (userApplication?.status || '').toUpperCase();
      // 취소/거절된 경우 다시 신청 가능
      if (status === 'CANCELLED' || status === 'REJECTED') {
        return 'can_apply';
      }
      if (status === 'COMPLETED') {
        return 'completed';
      }
      if (status === 'APPROVED' || status === 'CONFIRMED') {
        return 'approved';
      }
      // WAITING, PENDING 등은 모두 승인 대기중
      return 'pending';
    }
    return 'can_apply';
  };

  const buttonState = getButtonState();

  // 신청 취소 처리
  const handleCancelApplication = async () => {
    if (!userApplication?.id) return;

    const confirmed = window.confirm('신청을 취소하시겠습니까?');
    if (!confirmed) return;

    try {
      // 신청 취소 API: DELETE /training-seminars/{seminarId}/apply
      const response = await del(
        `${API_ENDPOINTS.TRAINING_SEMINARS}/${id}/apply`
      );

      if (response.error) {
        // API 미지원 시 조용히 처리
        console.error('신청 취소 실패:', response.error);
        alert('신청 취소 기능이 현재 지원되지 않습니다.');
        return;
      }

      alert('신청이 취소되었습니다.');
      fetchEducationDetail(); // 데이터 새로고침
    } catch (err) {
      console.error('신청 취소 중 오류:', err);
      alert('신청 취소 기능이 현재 지원되지 않습니다.');
    }
  };

  // 버튼 렌더링 함수 (모달과 동일한 로직)
  const renderActionButton = () => {
    if (buttonState === 'recruitment_closed') {
      return (
        <button className={styles.closedButton} disabled>
          모집 종료
        </button>
      );
    }

    if (buttonState === 'completed') {
      return (
        <button className={styles.completedButton} disabled>
          수강 완료
        </button>
      );
    }

    if (buttonState === 'approved') {
      return (
        <button className={styles.pendingButton} disabled>
          승인 완료
        </button>
      );
    }

    if (buttonState === 'pending') {
      return (
        <>
          <button className={styles.pendingButton} disabled>
            승인 대기중
          </button>
          <button className={styles.cancelLink} onClick={handleCancelApplication}>
            신청 취소
          </button>
        </>
      );
    }

    // can_apply: 신청하기 버튼
    return (
      <button
        className={styles.applyButton}
        onClick={() => setIsApplicationModalOpen(true)}
      >
        신청하기
      </button>
    );
  };

  return (
    <div className={styles.page}>
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className={styles.container}>
        <div className={styles.content}>
          {/* 이미지 섹션 */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <img src={education.image?.url || '/images/education/default-thumbnail.png'} alt={education.name} />
            </div>
          </div>

          {/* 강의 정보 */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <div className={styles.cardHeader}>
                <div className={styles.labels}>
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
                    {education.typeLabel}
                  </span>
                </div>
                <h2 className={styles.cardTitle}>{education.name}</h2>
              </div>

              <div className={styles.divider} />

              <div className={styles.cardInfo}>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>
                    <span className={styles.icon}>유형</span>
                  </div>
                  <p className={styles.infoValue}>{education.typeLabel}</p>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>
                    <span className={styles.icon}>강사</span>
                  </div>
                  <p className={styles.infoValue}>{education.instructorName}</p>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>
                    <span className={styles.icon}>대상</span>
                  </div>
                  <p className={styles.infoValue}>{education.target}</p>
                </div>
              </div>

              <div className={styles.educationDetails}>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <img 
                      src="/images/education/icons/graduation 1.svg" 
                      alt="교육 주제" 
                      className={styles.detailIconImage}
                    />
                    <span className={styles.detailIcon}>교육 주제</span>
                  </div>
                  <p className={styles.detailValue}>{education.name}</p>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <img 
                      src="/images/education/icons/calendar-clock.svg" 
                      alt="교육 일자" 
                      className={styles.detailIconImage}
                    />
                    <span className={styles.detailIcon}>교육 일자</span>
                  </div>
                  <p className={styles.detailValue}>
                    {formatEducationDates(education.educationDates)}
                  </p>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <img 
                      src="/images/education/icons/icon_16.svg" 
                      alt="교육 시간" 
                      className={styles.detailIconImage}
                    />
                    <span className={styles.detailIcon}>교육 시간</span>
                  </div>
                  <p className={styles.detailValue}>
                    {education.educationTimeSlots.join(', ')}
                  </p>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <img 
                      src="/images/education/icons/marker.svg" 
                      alt="교육 장소" 
                      className={styles.detailIconImage}
                    />
                    <span className={styles.detailIcon}>교육 장소</span>
                  </div>
                  <p className={styles.detailValue}>{education.location}</p>
                </div>
              </div>

              {education.otherInfo && (
                <div className={styles.otherInfo}>
                  <p>{education.otherInfo}</p>
                </div>
              )}

              <div className={styles.dateSelector}>
                <div className={styles.dateInput}>
                  <img 
                    src="/images/education/icons/Group 1321315006.svg" 
                    alt="날짜 선택" 
                    className={styles.dateIcon}
                  />
                  <p>
                    {selectedDate || '참여 날짜 선택'}
                  </p>
                </div>
                <button 
                  className={styles.dateButton}
                  onClick={() => setIsDatePickerOpen(true)}
                >
                  날짜 선택
                </button>
              </div>

              <div className={styles.price}>
                <p>0원</p>
              </div>

              <div className={styles.actionButtonDesktop}>
                {renderActionButton()}
              </div>
            </div>
          </div>

          {/* 설명 섹션 */}
          <div className={styles.bodySection}>
            <div className={styles.bodyContent}>
              <Viewer initialValue={education.body} />
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 하단 고정 버튼 */}
      <div className={styles.stickyButtonWrapper}>
        {renderActionButton()}
      </div>

      <Footer />

      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onConfirm={(date) => setSelectedDate(date)}
        availableDates={education.educationDates}
      />

      {education && (
        <ApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          education={education}
          initialDate={selectedDate}
          onSuccess={() => {
            // 신청 성공 후 데이터 새로고침
            fetchEducationDetail();
          }}
        />
      )}
    </div>
  );
};

export default EducationDetailPage;


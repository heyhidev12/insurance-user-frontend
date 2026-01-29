import React, { useState, useEffect } from 'react';
import DatePickerModal from './DatePickerModal';
import type { EducationDetail } from '@/types/education';
import { get, post, del } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import styles from './ApplicationModal.module.scss';

interface UserProfile {
  id: number;
  loginId: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  memberType?: string;
  oauthProvider?: string;
  newsletterSubscribed?: boolean;
}

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education: EducationDetail;
  initialDate?: string;
  onSuccess?: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  education,
  initialDate = '',
  onSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [participantCount, setParticipantCount] = useState<string>('1');
  const [requestNote, setRequestNote] = useState<string>('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // 유저 정보 가져오기
  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  // initialDate가 변경되면 selectedDate 업데이트
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  const fetchUserProfile = async () => {
    try {
      setIsLoadingUser(true);
      const response = await get<UserProfile>(API_ENDPOINTS.AUTH.ME);
      
      if (response.data) {
        setUserProfile(response.data);
      }
    } catch (err) {
      console.error('유저 정보를 불러오는 중 오류:', err);
    } finally {
      setIsLoadingUser(false);
    }
  };

  if (!isOpen) return null;

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
      
      return `${year}.${month}.${day}(${weekday})`;
    };
    
    if (dates.length === 1) {
      return formatSingleDate(dates[0]);
    }
    
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
    
    const firstFormatted = `${firstYear}.${firstMonth}.${firstDay}(${firstWeekday})`;
    const lastFormatted = firstYear === lastYear 
      ? `${lastMonth}.${lastDay}(${lastWeekday})`
      : `${lastYear}.${lastMonth}.${lastDay}(${lastWeekday})`;
    
    return `${firstFormatted} ~ ${lastFormatted}`;
  };

  const formatSelectedDate = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr.replace(/\./g, '-'));
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[dateObj.getDay()];
    const parts = dateStr.split('.');
    const year = parts[0].slice(-2);
    return `${year}.${parts[1]}.${parts[2]}(${weekday})`;
  };

  // 날짜 형식 변환 (YYYY.MM.DD -> YYYY-MM-DD)
  const convertDateToApiFormat = (dateStr: string): string => {
    if (!dateStr) return '';
    return dateStr.replace(/\./g, '-');
  };

  // 시간 형식 변환 (필요시)
  const convertTimeToApiFormat = (timeStr: string): string => {
    if (!timeStr) return '';
    // 이미 "16:00~17:00" 형식이면 그대로 반환
    if (timeStr.includes('~')) {
      return timeStr;
    }
    // "16:00-17:00" 형식이면 "~"로 변환
    if (timeStr.includes('-')) {
      return timeStr.replace('-', '~');
    }
    return timeStr;
  };

  const handleApply = async () => {
    // 유효성 검사
    if (!selectedDate || !selectedTime || !isAgreed) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!userProfile) {
      alert('유저 정보를 불러올 수 없습니다. 다시 시도해주세요.');
      return;
    }

    if (!userProfile.name) {
      alert('유저 이름 정보가 없습니다.');
      return;
    }

    if (parseInt(participantCount) < 1) {
      alert('참석인원은 1명 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        name: userProfile.name,
        phoneNumber: userProfile.phoneNumber || '',
        email: userProfile.email || '',
        participationDate: convertDateToApiFormat(selectedDate),
        participationTime: convertTimeToApiFormat(selectedTime),
        attendeeCount: parseInt(participantCount),
        requestDetails: requestNote || '',
        privacyAgreed: isAgreed,
      };

      const response = await post(
        `${API_ENDPOINTS.TRAINING_SEMINARS}/${education.id}/apply`,
        requestBody
      );

      if (response.error) {
        alert(`신청 중 오류가 발생했습니다: ${response.error}`);
        return;
      }

      // 성공
      alert('신청이 완료되었습니다.');
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '신청 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const canApply = selectedDate && selectedTime && isAgreed;

  // 모집 종료 여부 확인
  const isRecruitmentClosed = () => {
    if (!education.recruitmentEndDate) return false;
    const today = new Date();
    const endDate = new Date(education.recruitmentEndDate);
    return today > endDate;
  };

  // 현재 유저의 가장 최근 신청 내역 찾기
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
  const isRecruitmentEnded = isRecruitmentClosed();
  const hasApplication = !!userApplication;

  // 버튼 상태 결정
  const getButtonState = () => {
    if (isRecruitmentEnded) {
      return 'recruitment_closed'; // 모집 종료
    }
    if (hasApplication) {
      const status = (userApplication?.status || '').toUpperCase();
      // 취소/거절된 경우 다시 신청 가능
      if (status === 'CANCELLED' || status === 'REJECTED') {
        return 'can_apply';
      }
      if (status === 'COMPLETED') {
        return 'completed'; // 수강 완료
      }
      if (status === 'APPROVED' || status === 'CONFIRMED') {
        return 'approved'; // 승인 완료
      }
      // WAITING, PENDING 등은 모두 승인 대기중
      return 'pending';
    }
    return 'can_apply'; // 신청 가능
  };

  const buttonState = getButtonState();

  // 신청 취소 핸들러
  const handleCancelApplication = async () => {
    if (!userApplication || !confirm('신청을 취소하시겠습니까?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await del(`${API_ENDPOINTS.TRAINING_SEMINARS}/${education.id}/apply`);

      if (response.error) {
        console.error('신청 취소 실패:', response.error);
        alert('신청 취소 기능이 현재 지원되지 않습니다.');
        return;
      }

      alert('신청이 취소되었습니다.');
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('신청 취소 중 오류:', err);
      alert('신청 취소 기능이 현재 지원되지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerSpacer} />
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <h1 className={styles.mobileTitle}>교육/세미나 신청</h1>

        <div className={styles.content}>
          <div className={styles.mainContent}>
            <div className={styles.formSection}>
              <h2 className={styles.title}>교육/세미나 신청</h2>

              <div className={styles.formFields}>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>
                    <span>참여 일자</span>
                    <span className={styles.required}>*</span>
                  </div>
                  <div className={styles.dateInputRow}>
                    <div className={styles.dateInput}>
                      <p>{selectedDate ? formatSelectedDate(selectedDate) : ''}</p>
                    </div>
                    <button
                      className={styles.dateSelectButton}
                      onClick={() => setIsDatePickerOpen(true)}
                    >
                      날짜 선택
                    </button>
                  </div>
                </div>

                <div className={styles.field}>
                  <div className={styles.fieldLabel}>
                    <span>참여 시간</span>
                    <span className={styles.required}>*</span>
                  </div>
                  <div className={styles.timeOptions}>
                    {Array.from({ length: Math.ceil(education.educationTimeSlots.length / 2) }).map((_, rowIndex) => {
                      const rowSlots = education.educationTimeSlots.slice(rowIndex * 2, (rowIndex + 1) * 2);
                      return (
                        <div key={rowIndex} className={styles.timeOptionsRow}>
                          {rowSlots.map((time, cellIndex) => {
                            const index = rowIndex * 2 + cellIndex;
                            return (
                              <div
                                key={index}
                                className={`${styles.timeOption} ${selectedTime === time ? styles.timeOptionSelected : ''}`}
                                onClick={() => setSelectedTime(time)}
                              >
                                <div className={`${styles.timeRadio} ${selectedTime === time ? styles.timeRadioSelected : ''}`}>
                                  {selectedTime === time && (
                                    <div className={styles.timeRadioDot} />
                                  )}
                                </div>
                                <span>{time}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.field}>
                  <div className={styles.fieldLabel}>
                    <span>참석인원 (신청자 포함)</span>
                    <span className={styles.required}>*</span>
                  </div>
                  <div className={styles.participantInput}>
                    <input
                      type="number"
                      value={participantCount}
                      onChange={(e) => setParticipantCount(e.target.value)}
                      min="0"
                    />
                    <span className={styles.participantUnit}>명</span>
                  </div>
                </div>

                <div className={styles.field}>
                  <div className={styles.fieldLabel}>
                    <span>요청사항</span>
                  </div>
                  <textarea
                    className={styles.requestTextarea}
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                    placeholder="추가 참석인원이 있는 경우 요청사항에 인원 수를 작성해주세요."
                  />
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.agreementSection}>
                <div className={styles.agreementTitle}>
                  [필수] 개인정보 수집 및 이용 동의
                </div>
                <div className={styles.agreementContent}>
                  <p>세무법인 ○○○(이하 "회사")은 『개인정보 보호법』 등 관련 법령을 준수하며, 고객의 개인정보를 안전하게 보호하기 위해 다음과 같이 처리방침을 수립·공개합니다. 본 방침은 회사가 제공하는 웹/앱/오프라인 상담 및 위임업무(세무대리, 신고대행, 자문 등)에 적용됩니다.</p>
                  <p>&nbsp;</p>
                  <p><strong>1. 수집 항목 및 방법</strong></p>
                  <p> 1-1. 필수 수집 항목</p>
                  <p>신원: 성명, 생년월일(또는 사업자등록번호/법인등록번호 일부), 내·외국인 구분, 고객 구분(개인/사업자/법인)</p>
                  <p>연락: 휴대전화번호, 이메일, 주소(사업장/납세지)</p>
                  <p>과세/업무: 의뢰 내용, 거래내역 요약, 신고 대상 기간, 매출·매입 관련 기본자료 메타(증빙 보유 여부 등)</p>
                  <p>인증/보안: 로그인 ID, 접속기기 정보(브라우저·OS), 접속 IP, 쿠키, 서비스 이용기록</p>
                  <p>&nbsp;</p>
                  <p> 1-2. 선택 수집 항목</p>
                  <p>담당자 정보, 제3의 연락 창구, 마케팅 수신 동의 여부</p>
                  <p> 1-3. 민감·고위험 정보 처리</p>
                  <p>주민등록번호, 여권번호, 계좌번호, 신용카드번호, 건강보험·연금·고용보험 등 공적보험 정보, 급여/인사자료 등은 법령상 처리 근거 또는 명시적 동의가 있는 경우에 한해 최소한으로 수집·이용합니다.</p>
                  <p> 1-4. 수집 방법</p>
                  <p>홈페이지(회원가입/상담신청/자료업로드), 서면/이메일/메신저/팩스, 대면/비대면 상담, 제휴사를 통한 고객 위임, 자동생성정보(로그·쿠키) 등</p>
                  <p>&nbsp;</p>
                  <p><strong>2. 이용 목적</strong></p>
                  <p>(계약·서비스) 세무대리 계약 체결·이행, 신고·조사 대응, 자문 제공, 고객관리 및 민원 대응</p>
                  <p>(본인확인) 회원 식별, 비밀번호 재설정, 본인·권한 확인</p>
                  <p>(정산·청구) 수수료 계산·청구·영수, 전자세금계산서 발행</p>
                  <p>(안전·품질) 서비스 보안, 부정사용 방지, 접속 기록 관리, 통계/품질 개선</p>
                  <p>(법령 준수) 세법·상법 등 관계법령상의 의무 이행 및 행정기관 제출</p>
                  <p>(마케팅/안내 – 선택) 세무 뉴스레터, 세미나·이벤트 안내, 신규 서비스 정보 제공</p>
                  <p>&nbsp;</p>
                  <p><strong>3. 보유 및 이용 기간</strong></p>
                  <p>원칙: 목적 달성 시 지체 없이 파기</p>
                  <p>예외: 관계법령에 따른 보존(예: 상법·국세기본법·전자상거래법·전자금융거래법 등) 기간 동안 보관 후 파기</p>
                  <p>계약·청구 관련 서류: 최소 5년 이상</p>
                  <p>회계장부·증빙서류: 최소 5년 내지 10년(자료 성격에 따라 상이)</p>
                  <p>전자상거래·전자금융 관련 기록: 3~5년</p>
                  <p>접속기록(로그): 최소 1년</p>
                  <p>※ 구체 기간은 실제 업무 범주·자료 유형·적용 법령에 따라 내부 규정으로 확정·운영합니다.</p>
                  <p>&nbsp;</p>
                  <p><strong>4. 제3자 제공</strong></p>
                  <p>회사는 원칙적으로 고객 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만 다음의 경우 예외로 제공될 수 있습니다.</p>
                  <p>법령에 근거하거나 수사기관·법원 등 공공기관이 적법하게 요청한 경우</p>
                </div>
                <div className={styles.agreementCheckbox}>
                  <button
                    className={`${styles.checkbox} ${isAgreed ? styles.checkboxChecked : ''}`}
                    onClick={() => setIsAgreed(!isAgreed)}
                  >
                    {isAgreed && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.80078 5.99992L5.70604 8.79992L9.60078 2.79992"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </button>
                  <span>이용약관 수집에 동의합니다</span>
                </div>
              </div>

              {/* 데스크톱 버튼 */}
              <div className={styles.buttonWrapper}>
                {buttonState === 'recruitment_closed' && (
                  <button
                    className={`${styles.applyButton} ${styles.applyButtonDisabled}`}
                    disabled
                  >
                    모집 종료
                  </button>
                )}

                {buttonState === 'completed' && (
                  <button
                    className={`${styles.applyButton} ${styles.applyButtonDisabled}`}
                    disabled
                  >
                    수강 완료
                  </button>
                )}

                {buttonState === 'pending' && (
                  <>
                    <button
                      className={`${styles.applyButton} ${styles.applyButtonDisabled}`}
                      disabled
                    >
                      승인 대기중
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={handleCancelApplication}
                      disabled={isLoading}
                    >
                      신청 취소
                    </button>
                  </>
                )}

                {buttonState === 'can_apply' && (
                  <button
                    className={`${styles.applyButton} ${!canApply || isLoading || isLoadingUser ? styles.applyButtonDisabled : ''}`}
                    onClick={handleApply}
                    disabled={!canApply || isLoading || isLoadingUser}
                  >
                    {isLoading ? '신청 중...' : isLoadingUser ? '정보 불러오는 중...' : '신청하기'}
                  </button>
                )}
              </div>
            </div>

            <div className={styles.verticalDivider} />

            <div className={styles.summarySection}>
              <div className={styles.summaryHeader}>
                <div className={styles.summaryImage}>
                  <img src={education.image.url} alt={education.name} />
                </div>
                <div className={styles.summaryTitleWrapper}>
                  <h3 className={styles.summaryTitle}>{education.name}</h3>
                </div>
              </div>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryDetailItem}>
                  <img
                    src="/images/education/icons/calendar-clock.svg"
                    alt="교육 일자"
                    className={styles.summaryIcon}
                  />
                  <span className={styles.summaryLabel}>교육 일자</span>
                  <p className={styles.summaryValue}>
                    {formatEducationDates(education.educationDates)}
                  </p>
                </div>
                <div className={styles.summaryDetailItem}>
                  <img
                    src="/images/education/icons/icon_16.svg"
                    alt="교육 시간"
                    className={styles.summaryIcon}
                  />
                  <span className={styles.summaryLabel}>교육 시간</span>
                  <p className={styles.summaryValue}>
                    {education.educationTimeSlots.join(', ')}
                  </p>
                </div>
                <div className={styles.summaryDetailItem}>
                  <img
                    src="/images/education/icons/marker.svg"
                    alt="교육 장소"
                    className={styles.summaryIcon}
                  />
                  <span className={styles.summaryLabel}>교육 장소</span>
                  <p className={styles.summaryValue}>{education.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 모바일 하단 고정 버튼 */}
        <div className={styles.footer}>
          {buttonState === 'recruitment_closed' && (
            <button
              className={`${styles.applyButton} ${styles.applyButtonDisabled}`}
              disabled
            >
              모집 종료
            </button>
          )}

          {buttonState === 'completed' && (
            <button
              className={`${styles.applyButton} ${styles.applyButtonDisabled}`}
              disabled
            >
              수강 완료
            </button>
          )}

          {buttonState === 'pending' && (
            <button
              className={`${styles.applyButton} ${styles.applyButtonDisabled}`}
              disabled
            >
              승인 대기중
            </button>
          )}

          {buttonState === 'can_apply' && (
            <button
              className={`${styles.applyButton} ${!canApply || isLoading || isLoadingUser ? styles.applyButtonDisabled : ''}`}
              onClick={handleApply}
              disabled={!canApply || isLoading || isLoadingUser}
            >
              {isLoading ? '신청 중...' : isLoadingUser ? '정보 불러오는 중...' : '신청하기'}
            </button>
          )}
        </div>
      </div>

      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onConfirm={(date) => setSelectedDate(date)}
        availableDates={education.educationDates}
      />
    </>
  );
};

export default ApplicationModal;


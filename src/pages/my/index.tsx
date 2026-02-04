import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import PageHeader from '@/components/common/PageHeader';
import DateRangePickerModal from '@/components/common/DateRangePickerModal';
import { TextField } from '@/components/common/TextField';
import Pagination from '@/components/common/Pagination';
import { get, post, patch, del } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { clearAuth } from '@/lib/auth';
import styles from './my.module.scss';
import { MemberType } from '@/types/education';

interface UserProfile {
  id: number;
  loginId: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  memberType?: string;
  provider?: string;
  newsletterSubscribed?: boolean;
  isApproved?: boolean;
}

interface ApplicationSummary {
  seminarTotal: number;
  consultationTotal: number;
  total: number;
}

interface SeminarImage {
  id: number;
  url: string;
}

interface TrainingSeminarApplication {
  no: number;
  id: number;
  applicationId: number;
  seminarId: number;
  name: string;
  type: 'TRAINING' | 'SEMINAR' | 'VOD' | 'LECTURE';
  typeLabel: string;
  image?: SeminarImage;
  location: string;
  deadlineLabel: string;
  deadlineDays: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
  statusLabel: string;
  participationDate: string;
  participationTime: string;
  attendeeCount: number;
  appliedAt: string;
  recruitmentEndDate: string;
}

interface ConsultationApplication {
  id: number;
  date: string;
  content: string;
  field: string;
  consultant: string;
  status: ConsultationStatus;
  reply?: string;
}

enum ConsultationStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

// API에서 반환되는 상담 데이터 형식
interface ConsultationApiResponse {
  id: number;
  consultingField: string;
  assignedTaxAccountant: string;
  content: string;
  status: string;
  createdAt: string;
  answer?: string;
}

interface MyApplicationsResponse {
  type: string;
  seminars: {
    items: TrainingSeminarApplication[];
    total: number;
    page: number;
    limit: number;
  };
  consultations: {
    items: ConsultationApiResponse[];
    total: number;
    page: number;
    limit: number;
  };
  summary: ApplicationSummary;
  isExposed: boolean;
}

const MyPage: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'applications'>('profile');
  const [activeSubTab, setActiveSubTab] = useState<'training' | 'member'>('training');
  const [mobileView, setMobileView] = useState<'main' | 'profile' | 'applications'>('main');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [applicationSummary, setApplicationSummary] = useState<ApplicationSummary>({
    seminarTotal: 0,
    consultationTotal: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Training/Seminar applications
  const [trainingApplications, setTrainingApplications] = useState<TrainingSeminarApplication[]>([]);
  const [trainingLoading, setTrainingLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '15days' | '1month' | '6months'>('7days');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [trainingPage, setTrainingPage] = useState(1);
  const [trainingTotal, setTrainingTotal] = useState(0);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [datePickerType, setDatePickerType] = useState<'start' | 'end'>('start');
  const [datePickerPosition, setDatePickerPosition] = useState({ top: 0, left: 0 });

  // Consultation applications
  const [consultationApplications, setConsultationApplications] = useState<ConsultationApplication[]>([]);
  const [consultationLoading, setConsultationLoading] = useState(false);
  const [consultationPage, setConsultationPage] = useState(1);
  const [consultationTotal, setConsultationTotal] = useState(0);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 회원정보 수정 관련 상태
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showPasswordVerify, setShowPasswordVerify] = useState(false);
  const [passwordVerify, setPasswordVerify] = useState('');
  const [passwordVerifyError, setPasswordVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // 모바일 드롭다운 상태
  const [isEmailDomainDropdownOpen, setIsEmailDomainDropdownOpen] = useState(false);

  // 회원정보 수정 폼 상태
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    emailDomain: '',
    phoneNumber: '',
  });
  const [emailDomainSelect, setEmailDomainSelect] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 비밀번호 변경 폼 상태
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 휴대폰 번호 변경 관련 상태
  const [showChangePhoneForm, setShowChangePhoneForm] = useState(false);
  const [phoneChangeForm, setPhoneChangeForm] = useState({
    phoneNumber: '',
  });
  const [phoneChangeError, setPhoneChangeError] = useState('');
  const [isRequestingVerification, setIsRequestingVerification] = useState(false);
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // 회원 탈퇴 관련 상태
  const [showDeletePasswordModal, setShowDeletePasswordModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // 뉴스레터 구독 상태
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(true);

  // 타이머 효과
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTimerActive, timeLeft]);

  // URL 쿼리 파라미터에서 탭 읽기
  const tabFromQuery = router.query.tab as string;
  const validTabs = ['profile', 'applications'];

  useEffect(() => {
    if (tabFromQuery && validTabs.includes(tabFromQuery)) {
      setActiveTab(tabFromQuery as 'profile' | 'applications');
    }
  }, [tabFromQuery]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await get<UserProfile>(API_ENDPOINTS.AUTH.ME);

      if (response.error) {
        // 인증 오류인 경우 로그인 상태 해제
        if (response.status === 401 || response.status === 403) {
          clearAuth();
          setUserProfile(null);
          setIsAuthenticated(false);
          setError(null);
        } else {
          setError(response.error);
        }
      } else if (response.data) {
        setUserProfile(response.data);
        setIsAuthenticated(true);
        // 서버 프로필을 로컬에도 동기화 (다른 컴포넌트에서 재사용 가능)
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('user', JSON.stringify(response.data));
          } catch {
            // ignore
          }
        }
      } else {
        // 데이터 없음 → 비인증 상태로 처리
        clearAuth();
        setUserProfile(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      // 오류 발생 시 비인증 상태로 처리 (세션 만료 등)
      clearAuth();
      setUserProfile(null);
      setIsAuthenticated(false);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // 뉴스레터 구독 상태 조회
  const fetchNewsletterStatus = async () => {
    try {
      setNewsletterLoading(true);
      const response = await get<{ isSubscribed: boolean }>(API_ENDPOINTS.NEWSLETTER.ME);

      if (response.data) {
        setNewsletterSubscribed(response.data.isSubscribed);
      }
    } catch (err) {
      console.error('뉴스레터 상태 조회 실패:', err);
    } finally {
      setNewsletterLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchNewsletterStatus();
  }, []);

  // API 응답을 UI 형식으로 변환하는 함수
  const mapConsultationResponse = (item: ConsultationApiResponse): ConsultationApplication => {
    // 날짜 포맷 변환 (ISO -> YYYY.MM.DD)
    const formatDate = (dateStr: string): string => {
      try {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
      } catch {
        return dateStr;
      }
    };

    // API status를 UI enum으로 변환
    const mapStatus = (status: string): ConsultationStatus => {
      const upper = status.toUpperCase();
      if (upper === ConsultationStatus.COMPLETED) {
        return ConsultationStatus.COMPLETED;
      }
      // 그 외(RECEIVED, PENDING, WAITING 등)은 모두 PENDING으로 처리
      return ConsultationStatus.PENDING;
    };

    return {
      id: item.id,
      date: formatDate(item.createdAt),
      content: item.content,
      field: item.consultingField,
      consultant: item.assignedTaxAccountant,
      status: mapStatus(item.status),
      reply: item.answer,
    };
  };

  useEffect(() => {
    const fetchAllApplications = async () => {
      try {
        const response = await get<MyApplicationsResponse>(API_ENDPOINTS.AUTH.MY_APPLICATIONS);

        if (response.error) {
          if (response.status === 401 || response.status === 403) {
            // 인증 오류 → 세션 해제 및 비인증 상태
            clearAuth();
            setIsAuthenticated(false);
            setApplicationSummary({
              seminarTotal: 0,
              consultationTotal: 0,
              total: 0,
            });
          } else {
            console.error('신청 내역을 불러오는 중 오류:', response.error);
          }
        } else if (response.data) {
          // summary 설정
          setApplicationSummary(response.data.summary);
          // 세미나/교육 신청 내역 설정
          setTrainingApplications(response.data.seminars.items || []);
          setTrainingTotal(response.data.seminars.total || 0);
          // 상담 신청 내역 설정 (API 응답을 UI 형식으로 변환)
          const consultationItems = response.data.consultations.items || [];
          const mappedConsultations = consultationItems.map(mapConsultationResponse);
          setConsultationApplications(mappedConsultations);
          setConsultationTotal(response.data.consultations.total || 0);
        } else {
          setApplicationSummary({
            seminarTotal: 0,
            consultationTotal: 0,
            total: 0,
          });
        }
      } catch (err) {
        // 오류 발생 시 기본값 사용 (네트워크 등)
        setApplicationSummary({
          seminarTotal: 0,
          consultationTotal: 0,
          total: 0,
        });
        console.error('신청 내역을 불러오는 중 오류:', err);
      }
    };

    fetchAllApplications();
  }, []);

  // 날짜 필터 계산
  useEffect(() => {
    const today = new Date();
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}. ${month}. ${day}`;
    };

    let start: Date;
    switch (dateFilter) {
      case 'today':
        start = new Date(today);
        break;
      case '7days':
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        break;
      case '15days':
        start = new Date(today);
        start.setDate(today.getDate() - 15);
        break;
      case '1month':
        start = new Date(today);
        start.setMonth(today.getMonth() - 1);
        break;
      case '6months':
        start = new Date(today);
        start.setMonth(today.getMonth() - 6);
        break;
      default:
        start = new Date(today);
        start.setDate(today.getDate() - 7);
    }

    setStartDate(formatDate(start));
    setEndDate(formatDate(today));
  }, [dateFilter]);

  const getDaysUntilDeadline = (endDate: string) => {
    if (!endDate) return -1; // 마감일 정보가 없으면 -1 반환

    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정

    const deadline = new Date(endDate);
    deadline.setHours(23, 59, 59, 999); // 마감일의 마지막 시간으로 설정

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  };

  // 날짜 포맷 변환 함수: YYYY. MM. DD 또는 YYYY.MM.DD → YYYY-MM-DD
  const formatDateForApi = (dateStr: string): string => {
    if (!dateStr) return '';
    return dateStr.replace(/\.\s*/g, '-').replace(/-$/, '');
  };

  // 날짜 필터 검색 핸들러
  const handleSearch = async () => {
    const formattedStartDate = formatDateForApi(startDate);
    const formattedEndDate = formatDateForApi(endDate);

    if (activeSubTab === 'training') {
      setTrainingLoading(true);
      try {
        let url = `${API_ENDPOINTS.AUTH.MY_APPLICATIONS}?page=${trainingPage}&limit=10`;
        if (formattedStartDate) url += `&startDate=${formattedStartDate}`;
        if (formattedEndDate) url += `&endDate=${formattedEndDate}`;

        const response = await get<MyApplicationsResponse>(url);
        if (response.data) {
          setTrainingApplications(response.data.seminars.items || []);
          setTrainingTotal(response.data.seminars.total || 0);
        }
      } catch (err) {
        console.error('교육/세미나 신청 내역을 불러오는 중 오류:', err);
      } finally {
        setTrainingLoading(false);
      }
    } else if (activeSubTab === 'member') {
      setConsultationLoading(true);
      try {
        let url = `${API_ENDPOINTS.AUTH.MY_APPLICATIONS}?page=${consultationPage}&limit=10`;
        if (formattedStartDate) url += `&startDate=${formattedStartDate}`;
        if (formattedEndDate) url += `&endDate=${formattedEndDate}`;

        const response = await get<MyApplicationsResponse>(url);
        if (response.data) {
          const consultationItems = response.data.consultations.items || [];
          const mappedConsultations = consultationItems.map(mapConsultationResponse);
          setConsultationApplications(mappedConsultations);
          setConsultationTotal(response.data.consultations.total || 0);
        }
      } catch (err) {
        console.error('상담 신청 내역을 불러오는 중 오류:', err);
      } finally {
        setConsultationLoading(false);
      }
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as 'profile' | 'applications');
    router.replace(`/my?tab=${tabId}`, undefined, { shallow: true });
  };

  const handleSummaryCardClick = (subTab: 'training' | 'member') => {
    setActiveTab('applications');
    setActiveSubTab(subTab);
    router.replace(`/my?tab=applications`, undefined, { shallow: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('autoLogin');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // 탈퇴하기 버튼 클릭 핸들러
  const handleWithdrawClick = () => {
    if (window.confirm('정말로 탈퇴하시겠습니까?')) {
      setShowDeletePasswordModal(true);
      setDeletePassword('');
      setDeletePasswordError('');
    }
  };

  // 회원 탈퇴 핸들러
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeletePasswordError('비밀번호를 입력해주세요.');
      return;
    }

    setIsDeleting(true);
    setDeletePasswordError('');

    try {
      // 1. 비밀번호 확인
      const verifyResponse = await post(API_ENDPOINTS.AUTH.VERIFY_PASSWORD, {
        password: deletePassword
      });

      if (verifyResponse.error) {
        setDeletePasswordError(
          verifyResponse.status === 401
            ? '비밀번호가 일치하지 않습니다.'
            : verifyResponse.error
        );
        return;
      }

      // 2. 계정 삭제 API 호출
      const deleteResponse = await del(API_ENDPOINTS.AUTH.DELETE_ACCOUNT, {
        body: { password: deletePassword }
      });

      if (deleteResponse.error) {
        setDeletePasswordError('계정 삭제에 실패했습니다.');
        return;
      }

      // 3. 로그아웃 및 리다이렉트
      localStorage.removeItem('accessToken');
      localStorage.removeItem('autoLogin');
      localStorage.removeItem('user');
      alert('회원 탈퇴가 완료되었습니다.');
      router.push('/');
    } catch (err) {
      setDeletePasswordError('계정 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  // 뉴스레터 구독 해제 핸들러
  const handleNewsletterUnsubscribe = async () => {
    if (!window.confirm('뉴스레터 구독을 해제하시겠습니까?')) {
      return;
    }

    setIsUnsubscribing(true);
    try {
      const response = await post(API_ENDPOINTS.NEWSLETTER.ME_UNSUBSCRIBE);

      if (response.error) {
        alert('구독 해제에 실패했습니다.');
        return;
      }

      // UI 즉시 업데이트
      setNewsletterSubscribed(false);
      alert('뉴스레터 구독이 해제되었습니다.');
    } catch (err) {
      alert('구독 해제 중 오류가 발생했습니다.');
    } finally {
      setIsUnsubscribing(false);
    }
  };

  // 비밀번호 확인 핸들러
  const handlePasswordVerify = async () => {
    if (!passwordVerify) {
      setPasswordVerifyError('비밀번호를 입력해주세요.');
      return;
    }

    setIsVerifying(true);
    setPasswordVerifyError('');

    // 임시 비밀번호 1234로 우회 (API 점검중)
    const proceedWithVerification = () => {
      setIsPasswordVerified(true);
      setShowPasswordVerify(false);
      setPasswordVerify('');
      setPasswordVerifyError('');

      // 현재 사용자 정보로 폼 초기화
      const emailParts = displayProfile.email?.split('@') || ['', ''];

      setEditForm({
        name: displayProfile.name || '',
        email: emailParts[0] || '',
        emailDomain: emailParts[1] || '',
        phoneNumber: displayProfile.phoneNumber || '',
      });
    };

    try {
      // 비밀번호 확인 API 사용
      const response = await post(
        API_ENDPOINTS.AUTH.VERIFY_PASSWORD,
        {
          password: passwordVerify,
        }
      );

      if (response.error) {
        if (response.status === 500) {
          setPasswordVerifyError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else if (response.status === 401) {
          setPasswordVerifyError('비밀번호가 일치하지 않습니다.');
        } else {
          setPasswordVerifyError(response.error);
        }
        return;
      }

      // 비밀번호 확인 성공 - 회원정보 수정 화면 표시
      proceedWithVerification();
    } catch (err) {
      setPasswordVerifyError('비밀번호 확인 중 오류가 발생했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  // 회원정보 수정 저장 핸들러
  const handleSaveProfile = async () => {
    setIsSaving(true);

    try {
      const email = editForm.emailDomain
        ? `${editForm.email}@${editForm.emailDomain}`
        : editForm.email;

      // 휴대폰 번호에서 하이픈 제거하여 숫자만 전송
      const phoneNumberOnly = editForm.phoneNumber
        ? editForm.phoneNumber.replace(/\D/g, '')
        : '';

      const response = await patch(
        API_ENDPOINTS.AUTH.PROFILE,
        {
          name: editForm.name,
          email: email,
          phoneNumber: phoneNumberOnly,
        }
      );

      if (response.error) {
        alert('회원정보 수정에 실패했습니다: ' + response.error);
        return;
      }

      // 성공 시 사용자 정보 새로고침
      const profileResponse = await get<UserProfile>(API_ENDPOINTS.AUTH.ME);
      if (profileResponse.data) {
        setUserProfile(profileResponse.data);
      }

      setIsPasswordVerified(false);
      setShowPasswordVerify(false);
      setShowChangePasswordForm(false);
      alert('회원정보가 수정되었습니다.');
    } catch (err) {
      alert('회원정보 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 비밀번호 변경 핸들러
  const handleChangePassword = async () => {
    // 유효성 검사
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!passwordForm.currentPassword) {
      errors.currentPassword = '현재 비밀번호를 입력해주세요.';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = '새 비밀번호를 입력해주세요.';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = '새 비밀번호 확인을 입력해주세요.';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (errors.currentPassword || errors.newPassword || errors.confirmPassword) {
      setPasswordErrors(errors);
      return;
    }

    setIsChangingPassword(true);
    setPasswordErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });

    try {
      const response = await patch(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          newPasswordConfirm: passwordForm.confirmPassword,
        }
      );

      if (response.error) {
        setPasswordErrors({
          currentPassword: response.error,
          newPassword: '',
          confirmPassword: '',
        });
        return;
      }

      setShowChangePasswordForm(false);
      setIsPasswordVerified(false);
      setShowPasswordVerify(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('비밀번호가 변경되었습니다.');
    } catch (err) {
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 휴대폰 번호 포맷팅 함수 (하이픈 자동 추가)
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/\D/g, '');
    // 11자리 제한
    const limited = numbers.slice(0, 11);

    // 하이픈 자동 추가
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 7) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
    }
  };

  // 휴대폰 번호 변경 핸들러
  const handleRequestPhoneVerification = async () => {
    setPhoneChangeError('');

    // 휴대폰 번호 유효성 검사 (하이픈 있거나 없거나 둘 다 허용)
    const phoneRegex = /^010-?\d{4}-?\d{4}$/;
    const phoneNumberOnly = phoneChangeForm.phoneNumber.replace(/\D/g, '');

    if (!phoneChangeForm.phoneNumber) {
      setPhoneChangeError('휴대폰 번호를 입력해주세요.');
      return;
    }

    // 숫자만으로 11자리인지 확인
    if (phoneNumberOnly.length !== 11 || !phoneNumberOnly.startsWith('010')) {
      setPhoneChangeError('올바른 휴대폰번호 양식을 입력해주세요.');
      return;
    }

    setIsRequestingVerification(true);

    try {
      const response = await post(API_ENDPOINTS.AUTH.PHONE_SEND, {
        phone: phoneNumberOnly
      });

      if (response.error) {
        setPhoneChangeError(response.error);
        setIsRequestingVerification(false);
        return;
      }

      setIsVerificationRequested(true);
      setTimeLeft(300); // 5분
      setIsTimerActive(true);
      setPhoneChangeError('');
    } catch (err) {
      setPhoneChangeError('인증번호 발송에 실패했습니다.');
    } finally {
      setIsRequestingVerification(false);
    }
  };

  const handleVerifyPhoneCode = async () => {
    setVerificationError('');

    if (!verificationCode) {
      setVerificationError('인증번호를 입력해주세요.');
      return;
    }

    try {
      setIsVerifyingCode(true);
      const phoneNumberOnly = phoneChangeForm.phoneNumber.replace(/\D/g, '');
      const response = await post(API_ENDPOINTS.AUTH.PHONE_VERIFY, {
        phone: phoneNumberOnly,
        code: verificationCode
      });

      if (response.error) {
        setVerificationError(response.error);
        return;
      }

      setIsCodeVerified(true);
      setIsTimerActive(false);
      setVerificationError('');
    } catch (err) {
      setVerificationError('인증번호가 올바르지 않습니다.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleChangePhoneNumber = async () => {
    if (!isCodeVerified) {
      return;
    }

    setIsChangingPhone(true);
    try {
      const phoneNumberOnly = phoneChangeForm.phoneNumber.replace(/\D/g, '');

      // 프로필 수정 API 호출 (휴대폰 번호만 업데이트)
      const response = await patch(API_ENDPOINTS.AUTH.PROFILE, {
        phoneNumber: phoneNumberOnly,
      });

      if (response.error) {
        alert(response.error);
        return;
      }

      await fetchUserProfile();
      setShowChangePhoneForm(false);
      setIsPasswordVerified(false);
      setShowPasswordVerify(false);
      setPhoneChangeForm({ phoneNumber: '' });
      setVerificationCode('');
      setIsVerificationRequested(false);
      setIsCodeVerified(false);
      setIsTimerActive(false);
      setTimeLeft(0);
      alert('휴대폰 번호가 변경되었습니다.');
    } catch (err) {
      alert('휴대폰 번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsChangingPhone(false);
    }
  };

  const handleRequestPhoneVerificationAgain = async () => {
    await handleRequestPhoneVerification();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleConsultationClick = (consultation: ConsultationApplication) => {
    setSelectedConsultation(consultation);
    setIsDetailModalOpen(true);
  };

  const getStatusLabel = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.COMPLETED:
        return '상담완료';
      case ConsultationStatus.PENDING:
        return '대기중';
      default:
        return status;
    }
  };

  const getStatusClass = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.COMPLETED:
        return styles.statusCompleted;
      case ConsultationStatus.PENDING:
        return styles.statusPending;
      default:
        return '';
    }
  };

  if (loading || isAuthenticated === null) {
    return (
      <div className={styles.page}>
       <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true}/>
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  // 비로그인 상태 UI (회원 전용 데이터 숨김)
  if (!userProfile || isAuthenticated === false) {
    return (
      <div className={styles.page}>
       <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true}/>
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.loggedOutContainer}>
          <div className={styles.loggedOutContent}>
            <p className={styles.loggedOutTitle}>로그인이 필요한 서비스입니다.</p>
            <p className={styles.loggedOutDescription}>
              마이페이지는 로그인 후 이용하실 수 있습니다.
            </p>
            <div className={styles.loggedOutActions}>
              <button
                className={styles.loggedOutLoginButton}
                onClick={() => router.push('/login')}
              >
                로그인
              </button>
              <button
                className={styles.loggedOutSignupButton}
                onClick={() => router.push('/signup')}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayProfile = userProfile;

  // Mobile back handler
  const handleMobileBack = () => {
    if (showPasswordVerify || isPasswordVerified || showChangePasswordForm || showChangePhoneForm) {
      setShowPasswordVerify(false);
      setIsPasswordVerified(false);
      setShowChangePasswordForm(false);
      setShowChangePhoneForm(false);
      setPasswordVerify('');
      setPasswordVerifyError('');
    }
    setMobileView('main');
  };

  // Mobile menu item click handler
  const handleMobileMenuClick = (menu: 'profile' | 'applications') => {
    setMobileView(menu);
    setActiveTab(menu);
  };

  return (
    <div className={styles.page}>
     <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true}/>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Mobile Layout */}
      <div className={styles.mobileMyPage}>
        {mobileView === 'main' && (
          <>
            {/* Mobile Profile Card */}
            <div className={styles.mobileProfileCard}>
              <div className={styles.mobileProfileHeader}>
                <div className={styles.mobileProfileAvatar}>
                  <img src="/images/my/icons/profile-avatar.png" alt="프로필" />
                </div>
                <div className={styles.mobileProfileInfo}>
                  <div className={styles.mobileProfileGreeting}>
                    <p className={styles.mobileProfileName}>{displayProfile.name}님,</p>
                    <p className={styles.mobileProfileWelcome}>방문을 환영합니다</p>
                  </div>
                </div>
              </div>
              <div className={styles.mobileProfileDivider} />
              <div className={styles.mobileMemberTypeCard}>
                <div className={styles.mobileMemberTypeLabel}>
                  <img
                    src="/images/common/user-icon.svg"
                    alt="회원 유형"
                    className={styles.mobileMemberTypeIcon}
                  />
                  <p>회원 유형</p>
                </div>
                <div className={styles.mobileMemberTypeBadge}>
                  {displayProfile.memberType == MemberType.GENERAL
                    ? "일반"
                    : displayProfile.memberType == MemberType.OTHER
                      ? "기타"
                      : displayProfile.isApproved
                        ? "세무사"
                        : "세무사 (승인 대기 중)"}
                </div>
              </div>
            </div>

            {/* Mobile Menu List */}
            <div className={styles.mobileMenuList}>
              <button
                className={styles.mobileMenuItem}
                onClick={() => handleMobileMenuClick('profile')}
              >
                <span>회원 정보 관리</span>
                <img src="/images/common/arrow-right-gray.svg" alt="" />
              </button>
              <button
                className={styles.mobileMenuItem}
                onClick={() => handleMobileMenuClick('applications')}
              >
                <span>신청 내역</span>
                <img src="/images/common/arrow-right-gray.svg" alt="" />
              </button>
            </div>

            {/* Mobile Logout Button */}
            <button className={styles.mobileLogoutButton} onClick={handleLogout}>
              로그아웃
            </button>
          </>
        )}

        {mobileView === 'profile' && (
          <>
            {/* Mobile Header with Back Button */}
            <div className={styles.mobileHeader}>
              <button className={styles.mobileBackButton} onClick={handleMobileBack}>
                <img src="/images/common/arrow-left-white.svg" alt="뒤로" />
              </button>
              <h1 className={styles.mobileTitle}>
                {showChangePasswordForm ? '비밀번호 변경' :
                  showChangePhoneForm ? '휴대폰 번호 변경' :
                    showPasswordVerify || isPasswordVerified ? '회원 정보 수정' : '회원 정보 관리'}
              </h1>
            </div>

            {/* Mobile Profile Info Display */}
            {!showPasswordVerify && !isPasswordVerified && !showChangePasswordForm && !showChangePhoneForm && (
              <div className={styles.mobileProfileContent}>
                <div className={styles.mobileProfileForm}>
                  <div className={styles.mobileFormRow}>
                    <p className={styles.mobileFormLabel}>아이디</p>
                    <p className={styles.mobileFormValue}>{displayProfile.loginId}</p>
                  </div>
                  <div className={styles.mobileFormRow}>
                    <p className={styles.mobileFormLabel}>비밀번호</p>
                    <p className={styles.mobileFormValue}>**********</p>
                  </div>
                  <div className={styles.mobileFormDivider} />
                  <div className={styles.mobileFormRow}>
                    <p className={styles.mobileFormLabel}>이름</p>
                    <p className={styles.mobileFormValue}>{displayProfile.name}</p>
                  </div>
                  <div className={styles.mobileFormRow}>
                    <p className={styles.mobileFormLabel}>휴대폰 번호</p>
                    <p className={styles.mobileFormValue}>{displayProfile.phoneNumber || '-'}</p>
                  </div>
                  <div className={styles.mobileFormRow}>
                    <p className={styles.mobileFormLabel}>이메일</p>
                    <p className={styles.mobileFormValue}>{displayProfile.email || '-'}</p>
                  </div>
                  <div className={styles.mobileFormRow}>
                    <p className={styles.mobileFormLabel}>간편 로그인</p>
                    <p className={styles.mobileFormValue}>
                      {displayProfile.provider ?
                        (displayProfile.provider === 'google' ? '구글(Google)' :
                          displayProfile.provider === 'kakao' ? '카카오(Kakao)' :
                            displayProfile.provider === 'naver' ? '네이버(Naver)' : displayProfile.provider)
                        : '-'}
                    </p>
                  </div>
                  <div className={styles.mobileNewsletterRow}>
                    <p className={styles.mobileFormLabel}>뉴스레터 구독</p>
                    <div className={styles.mobileNewsletterActions}>
                      <div className={styles.mobileNewsletterBadge}>
                        <p>{newsletterLoading ? '로딩 중...' : (newsletterSubscribed ? '구독 중' : '미구독')}</p>
                      </div>
                      {newsletterSubscribed && !newsletterLoading && (
                        <button
                          className={styles.mobileUnsubscribeButton}
                          onClick={handleNewsletterUnsubscribe}
                          disabled={isUnsubscribing}
                        >
                          {isUnsubscribing ? '처리 중...' : '구독 해제'}
                        </button>
                      )}
                    </div>
                  </div>
                  <button className={styles.mobileWithdrawButton} onClick={handleWithdrawClick}>탈퇴하기</button>
                  <div className={styles.mobileFormFooterDivider} />
                  <button
                    className={styles.mobileEditButton}
                    onClick={() => {
                      setShowPasswordVerify(true);
                      setPasswordVerify('');
                      setPasswordVerifyError('');
                    }}
                  >
                    회원 정보 수정
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Password Verify */}
            {showPasswordVerify && !isPasswordVerified && (
              <div className={styles.mobilePasswordVerifySection}>
                <div className={styles.mobilePasswordVerifyBox}>
                  <p className={styles.mobilePasswordVerifyDescription}>
                    개인정보 보호를 위해<br />
                    비밀번호를 입력해 주세요
                  </p>
                  <div className={styles.mobilePasswordVerifyField}>
                    <TextField
                      variant="line"
                      label="비밀번호"
                      required
                      type="password"
                      placeholder="비밀번호를 입력해주세요"
                      value={passwordVerify}
                      onChange={setPasswordVerify}
                      error={!!passwordVerifyError}
                      errorMessage={passwordVerifyError}
                      disabled={isVerifying}
                      fullWidth
                      showPasswordToggle
                    />
                  </div>
                </div>
                <button
                  className={`${styles.mobilePasswordVerifyButton} ${passwordVerify ? styles.mobilePasswordVerifyButtonActive : ''}`}
                  onClick={handlePasswordVerify}
                  disabled={!passwordVerify || isVerifying}
                >
                  확인
                </button>
              </div>
            )}

            {/* Mobile Edit Profile Form */}
            {isPasswordVerified && !showChangePasswordForm && !showChangePhoneForm && mobileView === 'profile' && (
              <div className={styles.mobileEditProfileSection}>
                <div className={styles.mobileEditProfileBox}>
                  {/* 아이디 */}
                  <div className={styles.mobileEditFormField}>
                    <TextField
                      variant="line"
                      label="아이디"
                      required
                      value={displayProfile.loginId}
                      readOnly
                      disabled
                      fullWidth
                    />
                  </div>

                  {/* 비밀번호 */}
                  <div className={styles.mobileEditFormField}>
                    <div className={styles.mobileEditFormFieldRow}>
                      <TextField
                        variant="line"
                        label="비밀번호"
                        required
                        type="password"
                        value="**********"
                        readOnly
                        disabled
                        fullWidth
                      />
                      <button
                        className={styles.mobileChangeButton}
                        onClick={() => setShowChangePasswordForm(true)}
                      >
                        비밀번호 변경
                      </button>
                    </div>
                  </div>

                  {/* 이름 */}
                  <div className={styles.mobileEditFormField}>
                    <TextField
                      variant="line"
                      label="이름"
                      required
                      placeholder="이름을 입력해주세요"
                      value={editForm.name}
                      onChange={(value) => setEditForm({ ...editForm, name: value })}
                      fullWidth
                    />
                  </div>

                  {/* 이메일 */}
                  <div className={styles.mobileEditFormField}>
                    <div className={styles.mobileEmailRow}>
                      <TextField
                        variant="line"
                        label="이메일"
                        required
                        type="email"
                        placeholder="이메일"
                        value={editForm.email}
                        onChange={(value) => setEditForm({ ...editForm, email: value })}
                        showClear={false}
                      />
                      <span className={styles.mobileEmailAt}>@</span>
                      <TextField
                        variant="line"
                        placeholder="naver.com"
                        value={editForm.emailDomain}
                        onChange={(value) => setEditForm({ ...editForm, emailDomain: value })}
                        showClear={false}
                      />
                    </div>
                  </div>

                  {/* 이메일 선택 */}
                  <div className={styles.mobileEditFormField}>
                    <div className={styles.mobileDropdownWrapper}>
                      <button
                        className={styles.mobileEmailDomainSelect}
                        onClick={() => setIsEmailDomainDropdownOpen(!isEmailDomainDropdownOpen)}
                      >
                        <span>{editForm.emailDomain || '이메일 선택'}</span>
                        <img
                          src="/images/common/arrow-down.svg"
                          alt=""
                          style={{
                            width: 20,
                            height: 20,
                            transform: isEmailDomainDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                          }}
                        />
                      </button>
                      {isEmailDomainDropdownOpen && (
                        <div className={styles.mobileDropdownMenu}>
                          {['naver.com', 'gmail.com', 'daum.net', 'hanmail.net', 'nate.com', '직접입력'].map((domain) => (
                            <button
                              key={domain}
                              className={styles.mobileDropdownItem}
                              onClick={() => {
                                if (domain === '직접입력') {
                                  setEditForm({ ...editForm, emailDomain: '' });
                                } else {
                                  setEditForm({ ...editForm, emailDomain: domain });
                                }
                                setIsEmailDomainDropdownOpen(false);
                              }}
                            >
                              {domain}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 휴대폰 번호 */}
                  <div className={styles.mobileEditFormField}>
                    <p className={styles.mobileFormLabel}>휴대폰 번호 <span style={{ color: '#f35064' }}>*</span></p>
                    <div className={styles.mobilePhoneRow}>
                      <TextField
                        variant="line"
                        type="tel"
                        placeholder="010-0000-0000"
                        value={editForm.phoneNumber}
                        onChange={(value) => setEditForm({ ...editForm, phoneNumber: value })}
                        fullWidth
                      />
                      <button
                        className={styles.mobileChangeButton}
                        onClick={() => {
                          setShowChangePhoneForm(true);
                          setPhoneChangeForm({
                            phoneNumber: editForm.phoneNumber,
                          });
                        }}
                      >
                        휴대폰 번호 변경
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className={styles.mobileConfirmButton}
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  확인
                </button>
              </div>
            )}

            {/* Mobile Password Change Form */}
            {showChangePasswordForm && (
              <div className={styles.mobilePasswordChangeSection}>
                <div className={styles.mobilePasswordChangeBox}>
                  <div className={styles.mobilePasswordChangeField}>
                    <TextField
                      variant="line"
                      label="현재 비밀번호"
                      required
                      type="password"
                      placeholder="현재 비밀번호를 입력해주세요"
                      value={passwordForm.currentPassword}
                      onChange={(value) => setPasswordForm({ ...passwordForm, currentPassword: value })}
                      error={!!passwordErrors.currentPassword}
                      errorMessage={passwordErrors.currentPassword}
                      fullWidth
                      showPasswordToggle
                    />
                  </div>
                  <div className={styles.mobilePasswordChangeField}>
                    <TextField
                      variant="line"
                      label="새 비밀번호"
                      required
                      type="password"
                      placeholder="새로운 비밀번호를 입력해주세요"
                      value={passwordForm.newPassword}
                      onChange={(value) => setPasswordForm({ ...passwordForm, newPassword: value })}
                      error={!!passwordErrors.newPassword}
                      errorMessage={passwordErrors.newPassword}
                      fullWidth
                      showPasswordToggle
                    />
                  </div>
                  <div className={styles.mobilePasswordChangeField}>
                    <TextField
                      variant="line"
                      label="새 비밀번호 확인"
                      required
                      type="password"
                      placeholder="새로운 비밀번호를 다시 입력해주세요"
                      value={passwordForm.confirmPassword}
                      onChange={(value) => setPasswordForm({ ...passwordForm, confirmPassword: value })}
                      error={!!passwordErrors.confirmPassword}
                      errorMessage={passwordErrors.confirmPassword}
                      fullWidth
                      showPasswordToggle
                    />
                  </div>
                </div>
                <button
                  className={`${styles.mobilePasswordChangeButton} ${passwordForm.currentPassword && passwordForm.newPassword && passwordForm.confirmPassword
                      ? styles.mobilePasswordChangeButtonActive
                      : ''
                    }`}
                  onClick={handleChangePassword}
                  disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || isChangingPassword}
                >
                  비밀번호 변경
                </button>
              </div>
            )}

            {/* Mobile Phone Change Form */}
            {showChangePhoneForm && (
              <div className={styles.mobilePhoneChangeSection}>
                <div className={styles.mobilePhoneChangeBox}>
                  <div className={styles.mobilePhoneChangeField}>
                    <p className={styles.mobilePhoneChangeLabel}>휴대폰 번호 <span style={{ color: '#f35064' }}>*</span></p>
                  </div>
                  <div className={styles.mobilePhoneChangeField}>
                    <div className={styles.mobilePhoneInputRow}>
                      <TextField
                        variant="line"
                        type="tel"
                        placeholder="휴대폰 번호를 입력해주세요"
                        value={phoneChangeForm.phoneNumber}
                        onChange={(value) => setPhoneChangeForm({ ...phoneChangeForm, phoneNumber: value })}
                        error={!!phoneChangeError}
                        errorMessage={phoneChangeError}
                        fullWidth
                      />
                      <button
                        className={styles.mobileVerifyRequestButton}
                        onClick={handleRequestPhoneVerification}
                        disabled={!phoneChangeForm.phoneNumber || isRequestingVerification}
                      >
                        인증 요청
                      </button>
                    </div>
                  </div>
                  {isVerificationRequested && (
                    <div className={styles.mobileVerificationField}>
                      <p className={styles.mobilePhoneChangeLabel}>인증번호 <span style={{ color: '#f35064' }}>*</span></p>
                      <div className={styles.mobileVerificationInputRow}>
                        <TextField
                          variant="line"
                          type="text"
                          placeholder="인증번호 입력"
                          value={verificationCode}
                          onChange={setVerificationCode}
                          fullWidth
                        />
                        {timeLeft > 0 && (
                          <span className={styles.mobileVerificationTimer}>
                            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                          </span>
                        )}
                        <button
                          className={styles.mobileVerifyCodeButton}
                          onClick={handleVerifyPhoneCode}
                          disabled={!verificationCode || isVerifyingCode}
                        >
                          인증 확인
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className={`${styles.mobilePhoneChangeButton} ${isCodeVerified ? styles.mobilePhoneChangeButtonActive : ''
                    }`}
                  onClick={handleChangePhoneNumber}
                  disabled={!isCodeVerified || isChangingPhone}
                >
                  휴대폰 번호 변경
                </button>
              </div>
            )}
          </>
        )}

        {mobileView === 'applications' && (
          <>
            {/* Mobile Header with Back Button */}
            <div className={styles.mobileHeader}>
              <button className={styles.mobileBackButton} onClick={handleMobileBack}>
                <img src="/images/common/arrow-left-white.svg" alt="뒤로" />
              </button>
              <h1 className={styles.mobileTitle}>신청 내역</h1>
            </div>

            {/* Mobile Tab Buttons */}
            <div className={styles.mobileApplicationTabs}>
              <button
                className={`${styles.mobileAppTab} ${activeSubTab === 'training' ? styles.mobileAppTabActive : ''}`}
                onClick={() => setActiveSubTab('training')}
              >
                {activeSubTab === 'training' && <span className={styles.mobileTabDot} />}
                교육/세미나
              </button>
              <button
                className={`${styles.mobileAppTab} ${activeSubTab === 'member' ? styles.mobileAppTabActive : ''}`}
                onClick={() => setActiveSubTab('member')}
              >
                {activeSubTab === 'member' && <span className={styles.mobileTabDot} />}
                구성원
              </button>
            </div>

            {/* Divider below tabs */}
            <div className={styles.mobileTabDivider} />

            {activeSubTab === 'training' && (
              <div className={styles.mobileTrainingContent}>
                {/* Date Filter Section */}
                <div className={styles.mobileDateFilter}>
                  <div className={styles.mobilePeriodRow}>
                    <span className={styles.mobilePeriodLabel}>조회기간</span>
                    <div className={styles.mobilePeriodTabs}>
                      {['오늘', '7일', '15일', '1개월', '6개월'].map((period) => (
                        <button
                          key={period}
                          className={`${styles.mobilePeriodTab} ${period === '7일' ? styles.mobilePeriodTabActive : ''}`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.mobileDateInputRow}>
                    <div
                      className={styles.mobileDateInputWrapper}
                      onClick={() => {
                        setDatePickerType('start');
                        setIsDatePickerOpen(true);
                      }}
                    >
                      <input
                        type="text"
                        className={styles.mobileDateInput}
                        value={startDate || '2025. 05. 19'}
                        readOnly
                      />
                      <img src="/images/common/calendar-white.svg" alt="" className={styles.mobileDateIcon} />
                    </div>
                    <span className={styles.mobileDateSeparator}>~</span>
                    <div
                      className={styles.mobileDateInputWrapper}
                      onClick={() => {
                        setDatePickerType('end');
                        setIsDatePickerOpen(true);
                      }}
                    >
                      <input
                        type="text"
                        className={styles.mobileDateInput}
                        value={endDate || '2025. 05. 26'}
                        readOnly
                      />
                      <img src="/images/common/calendar-white.svg" alt="" className={styles.mobileDateIcon} />
                    </div>
                    <button className={styles.mobileSearchButton} onClick={handleSearch}>
                      <img src="/images/common/search-icon.svg" alt="검색" />
                    </button>
                  </div>
                </div>

                {/* Results Summary */}
                <div className={styles.mobileResultsSummary}>
                  <p className={styles.mobileResultsCount}>
                    총 <span className={styles.mobileCountHighlight}>{trainingTotal}</span>건
                  </p>
                  <p className={styles.mobileResultsDate}>
                    {startDate || '2025. 05. 19'} - {endDate || '2025.05.26'}
                  </p>
                </div>

                {/* Card Grid */}
                {trainingLoading ? (
                  <div className={styles.loading}>로딩 중...</div>
                ) : trainingApplications.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>신청 내역이 없습니다.</p>
                  </div>
                ) : (
                  <div className={styles.mobileCardGrid}>
                    {trainingApplications.map((item) => (
                      <div
                        key={item.id}
                        className={styles.mobileEducationCard}
                        onClick={() => router.push(`/education/${item.seminarId}`)}
                      >
                        <div className={styles.mobileCardImage}>
                          <img src={item.image?.url || '/images/common/default-thumbnail.jpg'} alt={item.name} />
                        </div>
                        <div className={styles.mobileCardContent}>
                          <div className={styles.mobileCardLabels}>
                            {(() => {
                              const daysLeft = getDaysUntilDeadline(item.recruitmentEndDate || "");
                              if (daysLeft <= 0) {
                                return <span className={styles.labelGray}>신청마감</span>;
                              }
                              else {
                                return <span className={styles.labelRed}>신청마감 D-{daysLeft}</span>;
                              }
                            })()}
                            <span className={styles.mobileCardLabelType}>{item.typeLabel}</span>
                          </div>
                          <h3 className={styles.mobileCardTitle}>{item.name}</h3>
                          <p className={styles.mobileCardLocation}>{item.location || '온라인'}</p>
                          <div className={styles.mobileCardDate}>
                            <img src="/images/common/calendar-icon.svg" alt="" />
                            <span>{item.participationDate} 종료</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'member' && (
              <div className={styles.mobileTrainingContent}>
                {/* Date Filter Section */}
                <div className={styles.mobileDateFilter}>
                  <div className={styles.mobilePeriodRow}>
                    <span className={styles.mobilePeriodLabel}>조회기간</span>
                    <div className={styles.mobilePeriodTabs}>
                      {['오늘', '7일', '15일', '1개월', '6개월'].map((period) => (
                        <button
                          key={period}
                          className={`${styles.mobilePeriodTab} ${period === '7일' ? styles.mobilePeriodTabActive : ''}`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.mobileDateInputRow}>
                    <div
                      className={styles.mobileDateInputWrapper}
                      onClick={() => {
                        setDatePickerType('start');
                        setIsDatePickerOpen(true);
                      }}
                    >
                      <input
                        type="text"
                        className={styles.mobileDateInput}
                        value={startDate || '2025. 05. 19'}
                        readOnly
                      />
                      <img src="/images/common/calendar-white.svg" alt="" className={styles.mobileDateIcon} />
                    </div>
                    <span className={styles.mobileDateSeparator}>~</span>
                    <div
                      className={styles.mobileDateInputWrapper}
                      onClick={() => {
                        setDatePickerType('end');
                        setIsDatePickerOpen(true);
                      }}
                    >
                      <input
                        type="text"
                        className={styles.mobileDateInput}
                        value={endDate || '2025. 05. 26'}
                        readOnly
                      />
                      <img src="/images/common/calendar-white.svg" alt="" className={styles.mobileDateIcon} />
                    </div>
                    <button className={styles.mobileSearchButton} onClick={handleSearch}>
                      <img src="/images/common/search-icon.svg" alt="검색" />
                    </button>
                  </div>
                </div>

                {/* Results Summary */}
                <div className={styles.mobileResultsSummary}>
                  <p className={styles.mobileResultsCount}>
                    총 <span className={styles.mobileCountHighlight}>{consultationTotal}</span>건
                  </p>
                  <p className={styles.mobileResultsDate}>
                    {startDate || '2025. 05. 19'} - {endDate || '2025.05.26'}
                  </p>
                </div>

                {consultationLoading ? (
                  <div className={styles.loading}>로딩 중...</div>
                ) : consultationApplications.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>상담 신청 내역이 없습니다.</p>
                  </div>
                ) : (
                  <div className={styles.mobileMemberList}>
                    {consultationApplications.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <div
                          className={styles.mobileMemberCard}
                          onClick={() => handleConsultationClick(item)}
                        >
                          <div className={styles.mobileMemberCardHeader}>
                            <span className={styles.mobileMemberCardField}>{item.field}</span>
                            <span className={`${styles.mobileMemberCardStatus} ${item.status === ConsultationStatus.COMPLETED
                                ? styles.mobileMemberCardStatusCompleted
                                : styles.mobileMemberCardStatusWaiting
                              }`}>
                              {getStatusLabel(item.status)}
                            </span>
                          </div>
                          <p className={styles.mobileMemberCardContent}>{item.content}</p>
                          <div className={styles.mobileMemberCardTags}>
                            <span className={styles.mobileMemberCardTag}>담당 세무사</span>
                            <span className={styles.mobileMemberCardTagDivider}>|</span>
                            <span className={styles.mobileMemberCardTagValue}>{item.consultant}</span>
                          </div>
                          <div className={styles.mobileMemberCardFooter}>
                            <span className={styles.mobileMemberCardNo}>NO.{index + 1}</span>
                            <span className={styles.mobileMemberCardDivider}>|</span>
                            <span className={styles.mobileMemberCardDate}>{item.date}</span>
                          </div>
                        </div>
                        <div className={styles.mobileMemberCardSeparator} />
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.container}>
        <div className={styles.pageHeaderWrapper}>
          <PageHeader
            title="마이페이지"
            breadcrumbs={[{ label: '마이페이지' }]}
          />
        </div>

        {/* 사용자 프로필 카드 및 신청 내역 요약 */}
        <div className={styles.profileSection}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>
                <img src="/images/my/icons/profile-avatar.png" alt="프로필" className={styles.avatarImage} />
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.profileGreeting}>
                  <p className={styles.profileName}>{displayProfile.name}님,</p>
                  <p className={styles.profileWelcome}>방문을 환영합니다</p>
                </div>
              </div>
            </div>
            <div className={styles.profileDivider} />
            <div className={styles.memberTypeCard}>
              <div className={styles.memberTypeLabel}>
                <img
                  src="/images/common/user-icon.svg"
                  alt="회원 유형"
                  className={styles.memberTypeIcon}
                />
                <p>회원 유형</p>
              </div>
              <div className={styles.memberTypeBadge}>
                {displayProfile.memberType == MemberType.GENERAL
                  ? "일반"
                  : displayProfile.memberType == MemberType.OTHER
                    ? "기타"
                    : displayProfile.isApproved
                      ? "세무사"
                      : "세무사 (승인 대기 중)"}
              </div>
            </div>
          </div>

          <div className={styles.applicationSummary}>
            <p className={styles.summaryTitle}>신청 내역</p>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryCards}>
              <div
                className={styles.summaryCard}
                onClick={() => handleSummaryCardClick('training')}
                style={{ cursor: 'pointer' }}
              >
                <p className={styles.summaryCardTitle}>교육/세미나 신청</p>
                <div className={styles.summaryCardContent}>
                  <div className={styles.summaryCount}>
                    <p>{applicationSummary.seminarTotal}건</p>
                  </div>
                  <div className={styles.summaryLink}>
                    <p>자세히보기</p>
                    <img
                      src="/images/common/arrow-right-gray.svg"
                      alt="자세히보기"
                      className={styles.arrowIcon}
                    />
                  </div>
                </div>
              </div>
              <div
                className={styles.summaryCard}
                onClick={() => handleSummaryCardClick('member')}
                style={{ cursor: 'pointer' }}
              >
                <p className={styles.summaryCardTitle}>구성원 신청</p>
                <div className={styles.summaryCardContent}>
                  <div className={styles.summaryCount}>
                    <p>{applicationSummary.consultationTotal}건</p>
                  </div>
                  <div className={styles.summaryLink}>
                    <p>자세히보기</p>
                    <img
                      src="/images/common/arrow-right-gray.svg"
                      alt="자세히보기"
                      className={styles.arrowIcon}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className={styles.tabSection}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarTabs}>
              <button
                className={`${styles.sidebarTab} ${activeTab === 'profile' ? styles.sidebarTabActive : ''}`}
                onClick={() => handleTabChange('profile')}
              >
                {activeTab === 'profile' && <span className={styles.tabDot} />}
                <span>회원 정보 관리</span>
              </button>
              <button
                className={`${styles.sidebarTab} ${activeTab === 'applications' ? styles.sidebarTabActive : ''}`}
                onClick={() => handleTabChange('applications')}
              >
                {activeTab === 'applications' && <span className={styles.tabDot} />}
                <span>신청 내역</span>
              </button>
            </div>
            <div className={styles.sidebarFooter}>
              <button className={styles.logoutButton} onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          </div>

          <div className={styles.content}>
            {activeTab === 'profile' && (
              <div className={styles.profileContent}>
                {!showPasswordVerify && !isPasswordVerified && !showChangePasswordForm && (
                  <>
                    <h2 className={styles.contentTitle}>회원 정보 관리</h2>
                    <div className={styles.profileForm}>
                      <div className={styles.profileFormContent}>
                        <div className={styles.formRow}>
                          <p className={styles.formLabel}>아이디</p>
                          <p className={styles.formValue}>{displayProfile.loginId}</p>
                        </div>
                        <div className={styles.formRow}>
                          <p className={styles.formLabel}>비밀번호</p>
                          <p className={styles.formValue}>**********</p>
                        </div>
                        <div className={styles.formDivider} />
                        <div className={styles.formRow}>
                          <p className={styles.formLabel}>이름</p>
                          <p className={styles.formValue}>{displayProfile.name}</p>
                        </div>
                        <div className={styles.formRow}>
                          <p className={styles.formLabel}>휴대폰 번호</p>
                          <p className={styles.formValue}>{displayProfile.phoneNumber || '-'}</p>
                        </div>
                        <div className={styles.formRow}>
                          <p className={styles.formLabel}>이메일</p>
                          <p className={styles.formValue}>{displayProfile.email || '-'}</p>
                        </div>
                        <div className={styles.formRow}>
                          <p className={styles.formLabel}>간편 로그인</p>
                          <p className={styles.formValue}>
                            {displayProfile.provider ?
                              (displayProfile.provider === 'google' ? '구글(Google)' :
                                displayProfile.provider === 'kakao' ? '카카오(Kakao)' :
                                  displayProfile.provider === 'naver' ? '네이버(Naver)' : displayProfile.provider)
                              : '-'}
                          </p>
                        </div>
                        <div className={styles.newsletterRow}>
                          <p className={styles.formLabel}>뉴스레터 구독</p>
                          <div className={styles.newsletterBadge}>
                            <p>{newsletterLoading ? '로딩 중...' : (newsletterSubscribed ? '구독' : '미구독')}</p>
                          </div>
                          {newsletterSubscribed && !newsletterLoading && (
                            <button
                              className={styles.unsubscribeButton}
                              onClick={handleNewsletterUnsubscribe}
                              disabled={isUnsubscribing}
                            >
                              {isUnsubscribing ? '처리 중...' : '구독 해제'}
                            </button>
                          )}
                        </div>
                        <button className={styles.withdrawButton} onClick={handleWithdrawClick}>탈퇴하기</button>
                        <div className={styles.formDivider} />
                      </div>
                      <button className={styles.editButton} onClick={() => {
                        setShowPasswordVerify(true);
                        setPasswordVerify('');
                        setPasswordVerifyError('');
                      }}>회원 정보 수정</button>
                    </div>
                  </>
                )}

                {showPasswordVerify && !isPasswordVerified && !showChangePasswordForm && !showChangePhoneForm && (
                  <>
                    <h2 className={styles.contentTitle}>회원 정보 수정</h2>
                    <div className={styles.passwordVerifySection}>
                      <div className={styles.passwordVerifyForm}>
                        <p className={styles.passwordVerifyDescription}>
                          개인정보 보호를 위해<br />
                          비밀번호를 입력해 주세요
                        </p>
                        <div className={styles.passwordVerifyField}>
                          <TextField
                            variant="line"
                            label="비밀번호"
                            required
                            type="password"
                            placeholder="비밀번호를 입력해주세요"
                            value={passwordVerify}
                            onChange={setPasswordVerify}
                            error={!!passwordVerifyError}
                            errorMessage={passwordVerifyError}
                            disabled={isVerifying}
                            fullWidth
                            showPasswordToggle
                          />
                        </div>
                        <button
                          className={`${styles.passwordVerifyButton} ${passwordVerify ? styles.passwordVerifyButtonActive : ''}`}
                          onClick={handlePasswordVerify}
                          disabled={!passwordVerify || isVerifying}
                        >
                          {isVerifying ? '확인 중...' : '확인'}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {isPasswordVerified && !showChangePasswordForm && !showChangePhoneForm && (
                  <>
                    <h2 className={styles.contentTitle}>회원 정보 수정</h2>
                    <div className={styles.editProfileForm}>
                      {/* 아이디 */}
                      <div className={styles.editFormField}>
                        <TextField
                          variant="line"
                          label="아이디"
                          required
                          value={displayProfile.loginId}
                          readOnly
                          disabled
                          fullWidth
                        />
                      </div>

                      {/* 비밀번호 */}
                      <div className={styles.editFormField}>
                        <div className={styles.editFormFieldRow}>
                          <TextField
                            variant="line"
                            label="비밀번호"
                            required
                            type="password"
                            value="**********"
                            readOnly
                            disabled
                            fullWidth
                          />
                          <button
                            className={styles.changePasswordButton}
                            onClick={() => {
                              setShowChangePasswordForm(true);
                            }}
                          >
                            비밀번호 변경
                          </button>
                        </div>
                      </div>

                      {/* 이름 */}
                      <div className={styles.editFormField}>
                        <TextField
                          variant="line"
                          label="이름"
                          required
                          placeholder="이름을 입력해주세요"
                          value={editForm.name}
                          onChange={(value) => setEditForm({ ...editForm, name: value })}
                          fullWidth
                        />
                      </div>

                      {/* 이메일 */}
                      <div className={styles.editFormField}>
                        <div className={styles.emailFieldRow}>
                          <TextField
                            variant="line"
                            label="이메일"
                            required
                            type="email"
                            placeholder="이메일을 입력해주세요"
                            value={editForm.email}
                            onChange={(value) => setEditForm({ ...editForm, email: value })}
                            className={styles.emailInput}
                            showClear={false}
                          />
                          <span className={styles.emailAt}>@</span>
                          <TextField
                            variant="line"
                            type="email"
                            placeholder="이메일 도메인"
                            value={editForm.emailDomain}
                            onChange={(value) => setEditForm({ ...editForm, emailDomain: value })}
                            className={styles.emailDomainInput}
                            showClear={false}
                          />
                          <div className={styles.emailDomainSelectWrapper}>
                            <button
                              className={styles.emailDomainSelect}
                              onClick={() => setEmailDomainSelect(!emailDomainSelect)}
                            >
                              {editForm.emailDomain || '이메일 선택'}
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${styles.selectArrow} ${emailDomainSelect ? styles.selectArrowOpen : ''}`}>
                                <path d="M7.5 5L12.5 10L7.5 15" stroke="#F0F0F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                            {emailDomainSelect && (
                              <div className={styles.emailDomainDropdown}>
                                {['naver.com', 'gmail.com', 'daum.net', 'kakao.com'].map((domain) => (
                                  <button
                                    key={domain}
                                    className={styles.emailDomainOption}
                                    onClick={() => {
                                      setEditForm({ ...editForm, emailDomain: domain });
                                      setEmailDomainSelect(false);
                                    }}
                                  >
                                    {domain}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 휴대폰 번호 */}
                      <div className={styles.editFormField}>
                        <div className={styles.editFormFieldLabel}>
                          <p className={styles.formLabel}>휴대폰 번호</p>
                          <p className={styles.formRequired}>*</p>
                        </div>
                        <div className={styles.phoneFieldRow}>
                          <TextField
                            variant="line"
                            type="tel"
                            placeholder="010-0000-0000"
                            value={editForm.phoneNumber}
                            onChange={(value) => setEditForm({ ...editForm, phoneNumber: value })}
                            className={styles.phoneNumberInput}
                            fullWidth
                          />
                          <button
                            className={styles.changePhoneButton}
                            onClick={() => {
                              setShowChangePhoneForm(true);
                              setPhoneChangeForm({
                                phoneNumber: editForm.phoneNumber,
                              });
                              setPhoneChangeError('');
                              setIsVerificationRequested(false);
                              setVerificationCode('');
                              setIsCodeVerified(false);
                              setIsTimerActive(false);
                              setTimeLeft(0);
                            }}
                          >
                            휴대폰 번호 변경
                          </button>
                        </div>
                      </div>

                      <button
                        className={styles.saveProfileButton}
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? '저장 중...' : '확인'}
                      </button>
                    </div>
                  </>
                )}

                {showChangePhoneForm && (
                  <>
                    <h2 className={styles.contentTitle}>휴대폰 번호 변경</h2>
                    <div className={styles.changePhoneSection}>
                      <div className={styles.changePhoneForm}>
                        {/* 휴대폰 번호 입력 */}
                        <div className={styles.phoneChangeField}>
                          <div className={styles.editFormFieldLabel}>
                            <p className={styles.formLabel}>휴대폰 번호</p>
                            <p className={styles.formRequired}>*</p>
                          </div>
                          <div className={styles.phoneChangeInputRow}>
                            <TextField
                              variant="line"
                              type="tel"
                              placeholder="010-1234-5678"
                              value={phoneChangeForm.phoneNumber}
                              onChange={(value) => {
                                const formatted = formatPhoneNumber(value);
                                setPhoneChangeForm({ ...phoneChangeForm, phoneNumber: formatted });
                                setPhoneChangeError('');
                              }}
                              className={styles.phoneNumberInput}
                              fullWidth
                              disabled={isVerificationRequested}
                              error={!!phoneChangeError}
                            />
                            {!isVerificationRequested ? (
                              <button
                                className={`${styles.requestVerificationButton} ${phoneChangeForm.phoneNumber && !phoneChangeError ? styles.requestVerificationButtonActive : ''}`}
                                onClick={handleRequestPhoneVerification}
                                disabled={!phoneChangeForm.phoneNumber || !!phoneChangeError || isRequestingVerification}
                              >
                                {isRequestingVerification ? '요청 중...' : '인증 요청'}
                              </button>
                            ) : (
                              <button
                                className={styles.requestVerificationButton}
                                onClick={handleRequestPhoneVerificationAgain}
                                disabled={isRequestingVerification}
                              >
                                인증 재요청
                              </button>
                            )}
                          </div>
                          {phoneChangeError && (
                            <div className={styles.phoneChangeError}>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#F35064" strokeMiterlimit="10" />
                                <path d="M8 5V8.5" stroke="#F35064" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 11.5C8.41421 11.5 8.75 11.1642 8.75 10.75C8.75 10.3358 8.41421 10 8 10C7.58579 10 7.25 10.3358 7.25 10.75C7.25 11.1642 7.58579 11.5 8 11.5Z" fill="#F35064" />
                              </svg>
                              {phoneChangeError}
                            </div>
                          )}
                        </div>

                        {/* 인증번호 입력 */}
                        {isVerificationRequested && (
                          <div className={styles.phoneChangeField}>
                            <div className={styles.editFormFieldLabel}>
                              <p className={styles.formLabel}>인증번호</p>
                              <p className={styles.formRequired}>*</p>
                            </div>
                            <div className={styles.verificationCodeRow}>
                              <TextField
                                variant="line"
                                type="text"
                                placeholder="인증번호 입력"
                                value={verificationCode}
                                onChange={(value) => {
                                  setVerificationCode(value);
                                  setVerificationError('');
                                }}
                                className={styles.verificationCodeInput}
                                error={!!verificationError}
                                disabled={isCodeVerified}
                                fullWidth
                              />
                              {isTimerActive && (
                                <span className={styles.timer}>{formatTime(timeLeft)}</span>
                              )}
                              <button
                                className={`${styles.verifyCodeButton} ${verificationCode && !isCodeVerified ? styles.verifyCodeButtonActive : ''}`}
                                onClick={handleVerifyPhoneCode}
                                disabled={!verificationCode || isCodeVerified || isVerifyingCode || !isTimerActive}
                              >
                                {isVerifyingCode ? '확인 중...' : '인증 확인'}
                              </button>
                            </div>
                            {verificationError && (
                              <div className={styles.phoneChangeError}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#F35064" strokeMiterlimit="10" />
                                  <path d="M8 5V8.5" stroke="#F35064" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M8 11.5C8.41421 11.5 8.75 11.1642 8.75 10.75C8.75 10.3358 8.41421 10 8 10C7.58579 10 7.25 10.3358 7.25 10.75C7.25 11.1642 7.58579 11.5 8 11.5Z" fill="#F35064" />
                                </svg>
                                {verificationError}
                              </div>
                            )}
                          </div>
                        )}

                        <button
                          className={`${styles.changePhoneSubmitButton} ${isCodeVerified ? styles.changePhoneSubmitButtonActive : ''}`}
                          onClick={handleChangePhoneNumber}
                          disabled={!isCodeVerified || isChangingPhone}
                        >
                          {isChangingPhone ? '변경 중...' : '휴대폰 번호 변경'}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {showChangePasswordForm && (
                  <>
                    <h2 className={styles.contentTitle}>비밀번호 변경</h2>
                    <div className={styles.changePasswordSection}>
                      <div className={styles.changePasswordForm}>
                        <div className={styles.passwordField}>
                          <TextField
                            variant="line"
                            label="현재 비밀번호"
                            required
                            type="password"
                            placeholder="현재 비밀번호를 입력해주세요"
                            value={passwordForm.currentPassword}
                            onChange={(value) => {
                              setPasswordForm({ ...passwordForm, currentPassword: value });
                              setPasswordErrors({ ...passwordErrors, currentPassword: '' });
                            }}
                            error={!!passwordErrors.currentPassword}
                            errorMessage={passwordErrors.currentPassword}
                            disabled={isChangingPassword}
                            fullWidth
                            showPasswordToggle
                          />
                        </div>
                        <div className={styles.passwordField}>
                          <TextField
                            variant="line"
                            label="새 비밀번호"
                            required
                            type="password"
                            placeholder="새로운 비밀번호를 입력해주세요"
                            value={passwordForm.newPassword}
                            onChange={(value) => {
                              setPasswordForm({ ...passwordForm, newPassword: value });
                              setPasswordErrors({ ...passwordErrors, newPassword: '' });
                            }}
                            error={!!passwordErrors.newPassword}
                            errorMessage={passwordErrors.newPassword}
                            disabled={isChangingPassword}
                            fullWidth
                            showPasswordToggle
                          />
                        </div>
                        <div className={styles.passwordField}>
                          <TextField
                            variant="line"
                            label="새 비밀번호 확인"
                            required
                            type="password"
                            placeholder="새로운 비밀번호를 다시 입력해주세요"
                            value={passwordForm.confirmPassword}
                            onChange={(value) => {
                              setPasswordForm({ ...passwordForm, confirmPassword: value });
                              setPasswordErrors({ ...passwordErrors, confirmPassword: '' });
                            }}
                            error={!!passwordErrors.confirmPassword}
                            errorMessage={passwordErrors.confirmPassword}
                            disabled={isChangingPassword}
                            fullWidth
                            showPasswordToggle
                          />
                        </div>
                        <button
                          className={`${styles.changePasswordSubmitButton} ${passwordForm.currentPassword && passwordForm.newPassword && passwordForm.confirmPassword ? styles.changePasswordSubmitButtonActive : ''}`}
                          onClick={handleChangePassword}
                          disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || isChangingPassword}
                        >
                          {isChangingPassword ? '변경 중...' : '비밀번호 변경'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div className={styles.applicationsContent}>
                <h2 className={styles.contentTitle}>신청 내역</h2>
                <div className={styles.subTabSection}>
                  <div className={styles.subTabs}>
                    <button
                      className={`${styles.subTab} ${activeSubTab === 'training' ? styles.subTabActive : ''}`}
                      onClick={() => setActiveSubTab('training')}
                    >
                      {activeSubTab === 'training' && <span className={styles.tabDot} />}
                      <span>교육/세미나</span>
                    </button>
                    <button
                      className={`${styles.subTab} ${activeSubTab === 'member' ? styles.subTabActive : ''}`}
                      onClick={() => setActiveSubTab('member')}
                    >
                      {activeSubTab === 'member' && <span className={styles.tabDot} />}
                      <span>구성원</span>
                    </button>
                  </div>
                  <div className={styles.subTabContent}>
                    {activeSubTab === 'training' && (
                      <div className={styles.trainingContent}>
                        <div className={styles.filterSection}>
                          <div className={styles.filterRow}>
                            <div className={styles.filterLeft}>
                              <p className={styles.filterLabel}>조회기간</p>
                              <div className={styles.periodButtons}>
                                {(['today', '7days', '15days', '1month', '6months'] as const).map((period) => (
                                  <button
                                    key={period}
                                    className={`${styles.periodButton} ${dateFilter === period ? styles.periodButtonActive : ''}`}
                                    onClick={() => setDateFilter(period)}
                                  >
                                    {period === 'today' ? '오늘' :
                                      period === '7days' ? '7일' :
                                        period === '15days' ? '15일' :
                                          period === '1month' ? '1개월' : '6개월'}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className={styles.filterRight}>
                              <div
                                className={styles.dateInput}
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setDatePickerPosition({
                                    top: rect.bottom + 8,
                                    left: rect.left,
                                  });
                                  setDatePickerType('start');
                                  setIsDatePickerOpen(true);
                                }}
                              >
                                <p>{startDate || '2025. 05. 19'}</p>
                                <img
                                  src="/images/common/calendar-icon.svg"
                                  alt="달력"
                                  className={styles.calendarIcon}
                                />
                              </div>
                              <p className={styles.dateSeparator}>~</p>
                              <div
                                className={styles.dateInput}
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setDatePickerPosition({
                                    top: rect.bottom + 8,
                                    left: rect.left,
                                  });
                                  setDatePickerType('end');
                                  setIsDatePickerOpen(true);
                                }}
                              >
                                <p>{endDate || '2025. 05. 26'}</p>
                                <img
                                  src="/images/common/calendar-icon.svg"
                                  alt="달력"
                                  className={styles.calendarIcon}
                                />
                              </div>
                              <button className={styles.searchButton} onClick={handleSearch}>
                                <img
                                  src="/images/common/search-icon.svg"
                                  alt="검색"
                                  className={styles.searchIcon}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className={styles.trainingList}>
                          <div className={styles.listHeader}>
                            <div className={styles.listHeaderLeft}>
                              <p>총 <span className={styles.countHighlight}>{trainingTotal}</span>건</p>
                            </div>
                            <div className={styles.listHeaderRight}>
                              <p>{startDate} - {endDate}</p>
                            </div>
                          </div>
                          {trainingLoading ? (
                            <div className={styles.loading}>로딩 중...</div>
                          ) : trainingApplications.length === 0 ? (
                            <div className={styles.emptyState}>
                              <p>신청 내역이 없습니다.</p>
                            </div>
                          ) : (
                            <div className={styles.trainingGrid}>
                              {trainingApplications.map((item) => (
                                <div
                                  key={item.id}
                                  className={styles.educationCard}
                                  onClick={() => router.push(`/education/${item.seminarId}`)}
                                >
                                  <div className={styles.cardImage}>
                                    <img src={item.image?.url || '/images/common/default-thumbnail.jpg'} alt={item.name} />
                                  </div>
                                  <div className={styles.cardContent}>
                                    <div className={styles.cardLabels}>
                                      {(() => {
                                        const daysLeft = getDaysUntilDeadline(item.recruitmentEndDate || "");
                                        if (daysLeft <= 0) {
                                          return <span className={styles.labelGray}>신청마감</span>;
                                        }
                                        else {
                                          return <span className={styles.labelRed}>신청마감 D-{daysLeft}</span>;
                                        }
                                      })()}
                                      <span className={styles.labelType}>{item.typeLabel}</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{item.name}</h3>
                                    <div className={styles.cardInfo}>
                                      <p className={styles.cardLocation}>{item.location || '-'}</p>
                                      <div className={styles.cardDateWrapper}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.cardDateIcon}>
                                          <path d="M3 2V4M13 2V4M2 6H14M3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2Z" stroke="#d8d8d8" strokeWidth="1" strokeLinecap="round" />
                                        </svg>
                                        <p className={styles.cardDate}>
                                          {item.participationDate} {item.participationTime}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {trainingTotal > 0 && (
                            <div className={styles.paginationWrapper}>
                              <Pagination
                                currentPage={trainingPage}
                                totalPages={Math.ceil(trainingTotal / 9)}
                                onPageChange={(page) => setTrainingPage(page)}
                                visiblePages={4}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {activeSubTab === 'member' && (
                      <div className={styles.memberContent}>
                        <div className={styles.filterSection}>
                          <div className={styles.filterRow}>
                            <div className={styles.filterLeft}>
                              <p className={styles.filterLabel}>조회기간</p>
                              <div className={styles.periodButtons}>
                                {(['today', '7days', '15days', '1month', '6months'] as const).map((period) => (
                                  <button
                                    key={period}
                                    className={`${styles.periodButton} ${dateFilter === period ? styles.periodButtonActive : ''}`}
                                    onClick={() => setDateFilter(period)}
                                  >
                                    {period === 'today' ? '오늘' :
                                      period === '7days' ? '7일' :
                                        period === '15days' ? '15일' :
                                          period === '1month' ? '1개월' : '6개월'}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className={styles.filterRight}>
                              <div
                                className={styles.dateInput}
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setDatePickerPosition({
                                    top: rect.bottom + 8,
                                    left: rect.left,
                                  });
                                  setDatePickerType('start');
                                  setIsDatePickerOpen(true);
                                }}
                              >
                                <p>{startDate || '2025. 05. 19'}</p>
                                <img
                                  src="/images/common/calendar-icon.svg"
                                  alt="달력"
                                  className={styles.calendarIcon}
                                />
                              </div>
                              <p className={styles.dateSeparator}>~</p>
                              <div
                                className={styles.dateInput}
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setDatePickerPosition({
                                    top: rect.bottom + 8,
                                    left: rect.left,
                                  });
                                  setDatePickerType('end');
                                  setIsDatePickerOpen(true);
                                }}
                              >
                                <p>{endDate || '2025. 05. 26'}</p>
                                <img
                                  src="/images/common/calendar-icon.svg"
                                  alt="달력"
                                  className={styles.calendarIcon}
                                />
                              </div>
                              <button className={styles.searchButton} onClick={handleSearch}>
                                <img
                                  src="/images/common/search-icon.svg"
                                  alt="검색"
                                  className={styles.searchIcon}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className={styles.listHeader}>
                          <div className={styles.listHeaderLeft}>
                            <p>총 <span className={styles.countHighlight}>{consultationTotal}</span>건</p>
                          </div>
                          <div className={styles.listHeaderRight}>
                            <p>{startDate || '2025. 05. 19'} - {endDate || '2025. 05. 26'}</p>
                          </div>
                        </div>
                        <div className={styles.consultationTable}>
                          <div className={styles.tableHeader}>
                            <div className={styles.tableRow}>
                              <p className={styles.tableCell} style={{ width: '80px' }}>No.</p>
                              <p className={styles.tableCell} style={{ width: '100px' }}>날짜</p>
                              <p className={styles.tableCell} style={{ flex: 1 }}>내용</p>
                              <p className={styles.tableCell} style={{ width: '80px' }}>분야</p>
                              <p className={styles.tableCell} style={{ width: '80px' }}>담당 세무사</p>
                              <p className={styles.tableCell} style={{ width: '80px' }}>진행상태</p>
                            </div>
                          </div>
                          <div className={styles.tableBody}>
                            {consultationLoading ? (
                              <div className={styles.loading}>로딩 중...</div>
                            ) : consultationApplications.length === 0 ? (
                              <div className={styles.emptyState}>
                                <p>상담 신청 내역이 없습니다.</p>
                              </div>
                            ) : (
                              consultationApplications.map((item, index) => (
                                <React.Fragment key={item.id}>
                                  <div
                                    className={styles.tableRow}
                                    onClick={() => handleConsultationClick(item)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <p className={styles.tableCell} style={{ width: '80px' }}>
                                      {String(index + 1).padStart(2, '0')}
                                    </p>
                                    <p className={styles.tableCell} style={{ width: '100px' }}>{item.date}</p>
                                    <p className={styles.tableCell} style={{ flex: 1 }}>{item.content}</p>
                                    <p className={styles.tableCell} style={{ width: '80px' }}>{item.field}</p>
                                    <p className={styles.tableCell} style={{ width: '80px' }}>{item.consultant}</p>
                                    <div className={styles.tableCell} style={{ width: '80px' }}>
                                      <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                                        {getStatusLabel(item.status)}
                                      </span>
                                    </div>
                                  </div>
                                  {index < consultationApplications.length - 1 && (
                                    <div className={styles.tableDivider} />
                                  )}
                                </React.Fragment>
                              ))
                            )}
                          </div>
                        </div>
                        {consultationTotal > 0 && (
                          <div className={styles.pagination}>
                            <button className={styles.paginationButton} disabled={consultationPage === 1}>
                              ««
                            </button>
                            <button className={styles.paginationButton} disabled={consultationPage === 1}>
                              «
                            </button>
                            <button className={`${styles.paginationButton} ${styles.paginationButtonActive}`}>
                              {consultationPage}
                            </button>
                            <button className={styles.paginationButton} disabled={consultationTotal <= consultationPage * 10}>
                              »
                            </button>
                            <button className={styles.paginationButton} disabled={consultationTotal <= consultationPage * 10}>
                              »»
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* 상담 상세보기 모달 */}
      {isDetailModalOpen && selectedConsultation && (
        <div className={styles.modalOverlay} onClick={() => setIsDetailModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <button className={styles.modalClose} onClick={() => setIsDetailModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalStatusRow}>
                <span className={`${styles.statusBadge} ${getStatusClass(selectedConsultation.status)}`}>
                  {getStatusLabel(selectedConsultation.status)}
                </span>
                <p className={styles.modalDate}>{selectedConsultation.date}</p>
              </div>
              <div className={styles.modalMainContent}>
                <div className={styles.modalField}>
                  <p className={styles.modalFieldLabel}>{selectedConsultation.field}</p>
                </div>
                <h2 className={styles.modalTitle}>{selectedConsultation.date} 상담 신청 내용</h2>
                <div className={styles.modalDivider} />
                <p className={styles.modalDescription}>{selectedConsultation.content}</p>
              </div>
              <div className={styles.modalConsultantCard}>
                <div className={styles.consultantInfo}>
                  <img
                    src="/images/common/user-icon-white.svg"
                    alt=""
                    className={styles.consultantIcon}
                  />
                  <p className={styles.consultantLabel}>담당 세무사</p>
                </div>
                <p className={styles.consultantName}>{selectedConsultation.consultant}</p>
              </div>
              {selectedConsultation.reply && (
                <div className={styles.modalReplySection}>
                  <div className={styles.modalReplyHeader}>
                    <h3 className={styles.modalReplyTitle}>답변</h3>
                    <div className={styles.modalReplyDivider} />
                  </div>
                  <p className={styles.modalReplyContent}>{selectedConsultation.reply}</p>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalConfirmButton} onClick={() => setIsDetailModalOpen(false)}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회원 탈퇴 비밀번호 확인 모달 */}
      {showDeletePasswordModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeletePasswordModal(false)}>
          <div className={styles.deleteModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteModalHeader}>
              <h3>회원 탈퇴</h3>
              <button
                className={styles.modalClose}
                onClick={() => setShowDeletePasswordModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.deleteModalBody}>
              <p className={styles.deleteModalDescription}>
                계정 삭제를 위해 비밀번호를 입력해 주세요.
              </p>
              <div className={styles.deleteModalField}>
                <TextField
                  variant="line"
                  label="비밀번호"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  value={deletePassword}
                  onChange={setDeletePassword}
                  error={!!deletePasswordError}
                  errorMessage={deletePasswordError}
                  disabled={isDeleting}
                  fullWidth
                  showPasswordToggle
                />
              </div>
            </div>
            <div className={styles.deleteModalFooter}>
              <button
                className={styles.deleteModalCancelButton}
                onClick={() => setShowDeletePasswordModal(false)}
                disabled={isDeleting}
              >
                취소
              </button>
              <button
                className={styles.deleteModalConfirmButton}
                onClick={handleDeleteAccount}
                disabled={!deletePassword || isDeleting}
              >
                {isDeleting ? '처리 중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      <DateRangePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onConfirm={(start, end) => {
          if (datePickerType === 'start') {
            setStartDate(start);
          } else {
            setEndDate(end);
          }
          setIsDatePickerOpen(false);
        }}
        initialStartDate={startDate}
        initialEndDate={endDate}
        position={datePickerPosition}
        datePickerType={datePickerType}
      />

    </div>
  );
};

export default MyPage;


import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import PageHeader from '@/components/common/PageHeader';
import Checkbox from '@/components/common/Checkbox';
import Button from '@/components/common/Button';
import { get, post } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import styles from './apply.module.scss';

interface ConsultationFormData {
  consultationField: string;
  taxAccountant: string;
  name: string;
  phone: string;
  additionalRequest: string;
  privacyAgreement: boolean;
  termsAgreement: boolean;
}

interface ConsultationApiRequest {
  name: string;
  phoneNumber: string;
  consultingField: string;
  assignedTaxAccountant: string;
  content: string;
  privacyAgreed: boolean;
  termsAgreed: boolean;
  memberFlag: 'MEMBER' | 'NON_MEMBER';
}

// API 응답 타입
interface CategoryItem {
  id: number;
  name: string;
  isExposed: boolean;
  majorCategoryId: number;
  majorCategoryName: string;
}

interface MemberItem {
  id: number;
  name: string;
  isExposed: boolean;
}

interface MembersResponse {
  items: MemberItem[];
  total: number;
  page: number;
  limit: number;
}

interface SelectOption {
  value: string;
  label: string;
}

interface UserProfile {
  id: number;
  loginId: string;
  name: string;
  phoneNumber?: string;
  email?: string;
}

const ConsultationApplyPage: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState(false);
  const [isAccountantDropdownOpen, setIsAccountantDropdownOpen] = useState(false);
  const [searchFieldQuery, setSearchFieldQuery] = useState('');
  const [searchAccountantQuery, setSearchAccountantQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // API에서 가져온 데이터
  const [consultationFields, setConsultationFields] = useState<SelectOption[]>([
    { value: '', label: '선택안함' }
  ]);
  const [taxAccountants, setTaxAccountants] = useState<SelectOption[]>([
    { value: '', label: '선택안함' }
  ]);

  // 로그인 상태 확인 및 API 데이터 가져오기
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);

    // 로그인 상태일 때 사용자 정보 자동 입력
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const response = await get<UserProfile>(API_ENDPOINTS.AUTH.ME);
        if (response.data) {
          setFormData(prev => ({
            ...prev,
            name: response.data!.name || '',
            phone: response.data!.phoneNumber || '',
          }));
        }
      } catch (e) {
        console.error('Failed to fetch user profile:', e);
      }
    };

    if (token) {
      fetchUserProfile();
    }

    // 상담 분야 (카테고리) 가져오기
    const fetchCategories = async () => {
      try {
        const response = await get<CategoryItem[]>(API_ENDPOINTS.BUSINESS_AREAS_CATEGORIES);
        if (response.data) {
          const options: SelectOption[] = [
            { value: '', label: '선택안함' },
            ...response.data
              .filter(item => item.isExposed)
              .map(item => ({
                value: item.id.toString(),
                label: item.name
              }))
          ];
          setConsultationFields(options);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const [formData, setFormData] = useState<ConsultationFormData>({
    consultationField: '',
    taxAccountant: '',
    name: '',
    phone: '',
    additionalRequest: '',
    privacyAgreement: false,
    termsAgreement: false,
  });

  const fieldDropdownRef = useRef<HTMLDivElement>(null);
  const accountantDropdownRef = useRef<HTMLDivElement>(null);

  // 필터링된 옵션
  const filteredFields = consultationFields.filter(field =>
    field.label.toLowerCase().includes(searchFieldQuery.toLowerCase())
  );

  const filteredAccountants = taxAccountants.filter(accountant =>
    accountant.label.toLowerCase().includes(searchAccountantQuery.toLowerCase())
  );

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fieldDropdownRef.current && !fieldDropdownRef.current.contains(event.target as Node)) {
        setIsFieldDropdownOpen(false);
      }
      if (accountantDropdownRef.current && !accountantDropdownRef.current.contains(event.target as Node)) {
        setIsAccountantDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFieldChange = async (value: string) => {
    // formData 업데이트 + 세무사 선택 초기화
    setFormData(prev => ({
      ...prev,
      consultationField: value,
      taxAccountant: ''
    }));
    setIsFieldDropdownOpen(false);

    // 분야가 선택된 경우 해당 분야의 세무사 목록 조회
    if (value) {
      try {
        const response = await get<MembersResponse>(
          `${API_ENDPOINTS.MEMBERS}?page=1&limit=100&workArea=${value}`
        );
        if (response.data?.items) {
          const options: SelectOption[] = [
            { value: '', label: '선택안함' },
            ...response.data.items
              .filter(item => item.isExposed)
              .map(item => ({
                value: item.id.toString(),
                label: item.name
              }))
          ];
          setTaxAccountants(options);
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    } else {
      // 선택안함인 경우 세무사 목록 초기화
      setTaxAccountants([{ value: '', label: '선택안함' }]);
    }
  };

  const handleAccountantChange = (value: string) => {
    setFormData(prev => ({ ...prev, taxAccountant: value }));
    setIsAccountantDropdownOpen(false);
  };

  const handleInputChange = (field: keyof ConsultationFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 필드 값 변경 시 해당 필드의 API 오류 초기화
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (field: 'privacyAgreement' | 'termsAgreement') => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: keyof ConsultationFormData): string | null => {
    // API에서 반환한 필드별 오류 우선 표시
    if (fieldErrors[field]) return fieldErrors[field];

    const shouldShow = touched[field] || isSubmitAttempted;
    if (!shouldShow) return null;

    switch (field) {
      case 'consultationField':
        return !formData.consultationField ? '상담 분야를 선택해주세요' : null;
      case 'taxAccountant':
        return !formData.taxAccountant ? '담당 세무사를 선택해주세요' : null;
      case 'name':
        return !formData.name ? '이름을 입력해주세요' : null;
      case 'phone':
        return !formData.phone ? '휴대폰 번호를 입력해주세요' : null;
      case 'additionalRequest':
        return !formData.additionalRequest ? '추가 요청사항을 입력해주세요' : null;
      case 'privacyAgreement':
        return !formData.privacyAgreement ? '개인정보 처리 방침에 동의해주세요' : null;
      case 'termsAgreement':
        return !formData.termsAgreement ? '이용약관에 동의해주세요' : null;
      default:
        return null;
    }
  };

  const parseApiError = (errorMessage: string): Record<string, string> => {
    const errors: Record<string, string> = {};

    // 이름 관련 오류
    if (errorMessage.includes('이름')) {
      errors.name = errorMessage;
    }
    // 휴대폰 번호 관련 오류
    else if (errorMessage.includes('휴대폰') || errorMessage.includes('전화')) {
      errors.phone = errorMessage;
    }
    // 상담 분야 관련 오류
    else if (errorMessage.includes('상담 분야') || errorMessage.includes('분야')) {
      errors.consultationField = errorMessage;
    }
    // 세무사 관련 오류
    else if (errorMessage.includes('세무사')) {
      errors.taxAccountant = errorMessage;
    }
    // 내용 관련 오류
    else if (errorMessage.includes('내용') || errorMessage.includes('요청사항')) {
      errors.additionalRequest = errorMessage;
    }

    return errors;
  };

  const isFormValid = () => {
    return (
      formData.consultationField &&
      formData.taxAccountant &&
      formData.name &&
      formData.phone &&
      formData.additionalRequest &&
      formData.privacyAgreement &&
      formData.termsAgreement
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitAttempted(true);
    if (!isFormValid() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});

    try {
      // 폼 데이터를 API 요청 형식으로 변환
      const selectedField = consultationFields.find(f => f.value === formData.consultationField);
      const selectedAccountant = taxAccountants.find(a => a.value === formData.taxAccountant);

      const apiRequestBody: ConsultationApiRequest = {
        name: formData.name,
        phoneNumber: formData.phone.replace(/-/g, ''), // 하이픈 제거
        consultingField: selectedField?.label || formData.consultationField,
        assignedTaxAccountant: selectedAccountant?.label || formData.taxAccountant,
        content: formData.additionalRequest,
        privacyAgreed: formData.privacyAgreement,
        termsAgreed: formData.termsAgreement,
        memberFlag: isLoggedIn ? 'MEMBER' : 'NON_MEMBER', // 로그인 상태에 따라 설정
      };

      // post 함수 사용 (인증 토큰 자동 포함)
      const response = await post(API_ENDPOINTS.CONSULTATIONS, apiRequestBody);

      if (response.error) {
        throw new Error(response.error || '상담 신청에 실패했습니다. 다시 시도해주세요.');
      }

      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Consultation submission error:', error);
      const errorMessage = error instanceof Error ? error.message : '상담 신청에 실패했습니다. 다시 시도해주세요.';

      // API 오류를 필드별로 분류
      const parsedErrors = parseApiError(errorMessage);
      if (Object.keys(parsedErrors).length > 0) {
        setFieldErrors(parsedErrors);
      } else {
        // 분류되지 않은 오류는 일반 오류로 표시
        setSubmitError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    router.push('/');
  };

  const selectedFieldLabel = consultationFields.find(f => f.value === formData.consultationField)?.label || '상담 분야를 선택해주세요';
  const selectedAccountantLabel = !formData.consultationField
    ? '상담 분야를 먼저 선택해주세요'
    : taxAccountants.find(a => a.value === formData.taxAccountant)?.label || '담당 세무사를 선택해주세요';

  return (
    <div className={styles.consultationPage}>
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
            title="상담 신청"
            breadcrumbs={[
              { label: '상담 신청' }
            ]}
            size="web"
          />
        </div>

        {/* Form Section */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <div className={styles.formTitleBackground}>
                <p className={styles.formTitleText}>
                  CONTACT <span className={styles.formTitleItalic}>US</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formFields}>
                {/* 상담 분야 & 담당 세무사 */}
                <div className={styles.formRow}>
                  <div className={styles.formField} ref={fieldDropdownRef}>
                    <label className={styles.fieldLabel}>
                      상담 분야
                      <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.selectWrapper}>
                      <div
                        className={`${styles.selectTrigger} ${isFieldDropdownOpen ? styles.selectTriggerOpen : ''}`}
                        onClick={() => setIsFieldDropdownOpen(!isFieldDropdownOpen)}
                      >
                        <span className={formData.consultationField ? styles.selectValue : styles.selectPlaceholder}>
                          {selectedFieldLabel}
                        </span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          className={`${styles.selectArrow} ${isFieldDropdownOpen ? styles.selectArrowOpen : ''}`}
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="#717171"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      {isFieldDropdownOpen && (
                        <div className={styles.selectDropdown}>
                          <div className={styles.selectSearch}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                                stroke="#717171"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M21 21L16.65 16.65"
                                stroke="#717171"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                            <input
                              type="text"
                              placeholder="검색해보세요"
                              value={searchFieldQuery}
                              onChange={(e) => setSearchFieldQuery(e.target.value)}
                              className={styles.selectSearchInput}
                            />
                          </div>
                          <div className={styles.selectOptions}>
                            {filteredFields.map((field) => (
                              <div
                                key={field.value}
                                className={`${styles.selectOption} ${formData.consultationField === field.value ? styles.selectOptionActive : ''}`}
                                onClick={() => handleFieldChange(field.value)}
                              >
                                {field.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {getFieldError('consultationField') && (
                      <p className={styles.fieldError}>{getFieldError('consultationField')}</p>
                    )}
                  </div>

                  <div className={styles.formField} ref={accountantDropdownRef}>
                    <label className={styles.fieldLabel}>
                      담당 세무사
                      <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.selectWrapper}>
                      <div
                        className={`${styles.selectTrigger} ${isAccountantDropdownOpen ? styles.selectTriggerOpen : ''} ${!formData.consultationField ? styles.selectTriggerDisabled : ''}`}
                        onClick={() => {
                          if (!formData.consultationField) return;
                          setIsAccountantDropdownOpen(!isAccountantDropdownOpen);
                        }}
                      >
                        <span className={formData.taxAccountant ? styles.selectValue : styles.selectPlaceholder}>
                          {selectedAccountantLabel}
                        </span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          className={`${styles.selectArrow} ${isAccountantDropdownOpen ? styles.selectArrowOpen : ''}`}
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="#717171"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      {isAccountantDropdownOpen && (
                        <div className={styles.selectDropdown}>
                          <div className={styles.selectSearch}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                                stroke="#717171"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M21 21L16.65 16.65"
                                stroke="#717171"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                            <input
                              type="text"
                              placeholder="검색해보세요"
                              value={searchAccountantQuery}
                              onChange={(e) => setSearchAccountantQuery(e.target.value)}
                              className={styles.selectSearchInput}
                            />
                          </div>
                          <div className={styles.selectOptions}>
                            {filteredAccountants.map((accountant) => (
                              <div
                                key={accountant.value}
                                className={`${styles.selectOption} ${formData.taxAccountant === accountant.value ? styles.selectOptionActive : ''}`}
                                onClick={() => handleAccountantChange(accountant.value)}
                              >
                                {accountant.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {getFieldError('taxAccountant') && (
                      <p className={styles.fieldError}>{getFieldError('taxAccountant')}</p>
                    )}
                  </div>
                </div>

                {/* 이름 & 휴대폰 번호 */}
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>
                      이름
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      className={`${styles.textInput} ${getFieldError('name') ? styles.textInputError : ''}`}
                      placeholder="이름을 입력해주세요"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name')(e.target.value)}
                      onBlur={() => handleBlur('name')}
                    />
                    {getFieldError('name') && (
                      <p className={styles.fieldError}>{getFieldError('name')}</p>
                    )}
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>
                      휴대폰 번호
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="tel"
                      className={`${styles.textInput} ${getFieldError('phone') ? styles.textInputError : ''}`}
                      placeholder="휴대폰 번호를 입력해주세요"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone')(e.target.value)}
                      onBlur={() => handleBlur('phone')}
                    />
                    {getFieldError('phone') && (
                      <p className={styles.fieldError}>{getFieldError('phone')}</p>
                    )}
                  </div>
                </div>

                {/* 추가 요청사항 */}
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>
                    추가 요청사항
                    <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    className={`${styles.textarea} ${getFieldError('additionalRequest') ? styles.textareaError : ''}`}
                    placeholder="상담 내용을 입력해주세요"
                    value={formData.additionalRequest}
                    onChange={(e) => handleInputChange('additionalRequest')(e.target.value)}
                    onBlur={() => handleBlur('additionalRequest')}
                    rows={8}
                  />
                  {getFieldError('additionalRequest') && (
                    <p className={styles.fieldError}>{getFieldError('additionalRequest')}</p>
                  )}
                </div>

                {/* 동의 체크박스 */}
                <div className={styles.agreements}>
                  <div className={styles.agreementItemWrapper}>
                    <div className={styles.agreementItem}>
                      <Checkbox
                        variant="square"
                        checked={formData.privacyAgreement}
                        onChange={handleCheckboxChange('privacyAgreement')}
                        label="[필수] 개인정보 처리 방침 이용 동의"
                      />
                      <button type="button" className={styles.viewLink}>
                        보기
                      </button>
                    </div>
                    {getFieldError('privacyAgreement') && (
                      <p className={styles.fieldError}>{getFieldError('privacyAgreement')}</p>
                    )}
                  </div>
                  <div className={styles.agreementItemWrapper}>
                    <div className={styles.agreementItem}>
                      <Checkbox
                        variant="square"
                        checked={formData.termsAgreement}
                        onChange={handleCheckboxChange('termsAgreement')}
                        label="[필수] OO OOOOO 이용 동의"
                      />
                      <button type="button" className={styles.viewLink}>
                        보기
                      </button>
                    </div>
                    {getFieldError('termsAgreement') && (
                      <p className={styles.fieldError}>{getFieldError('termsAgreement')}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.submitButtonWrapper}>
                {submitError && (
                  <p className={styles.errorMessage}>{submitError}</p>
                )}
                <Button
                  type="primary"
                  size="large"
                  disabled={!isFormValid() || isSubmitting}
                  htmlType="submit"
                  className={styles.submitButton}
                >
                  {isSubmitting ? '신청 중...' : '신청하기'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className={styles.modalOverlay} onClick={handleSuccessModalClose}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <button
                type="button"
                className={styles.modalCloseButton}
                onClick={handleSuccessModalClose}
                aria-label="닫기"
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M10 10L30 30M30 10L10 30"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.successIcon}>
                <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
                  <path
                    d="M2.5 17.5L12.5 27.5L32.5 7.5"
                    stroke="#94B9E3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className={styles.successMessage}>
                <h2 className={styles.successTitle}>
                  상담 신청이<br />
                  정상적으로 접수되었습니다.
                </h2>
                <p className={styles.successDescription}>
                  접수 내용을 확인한 후, 순차적으로 연락드리겠습니다.<br />
                  신뢰할 수 있는 파트너, 세무법인 함께를 찾아주셔서 감사합니다.
                </p>
              </div>
              <Button
                type="primary"
                size="large"
                onClick={handleSuccessModalClose}
                className={styles.modalButton}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationApplyPage;


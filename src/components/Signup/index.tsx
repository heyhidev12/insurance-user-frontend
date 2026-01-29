import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import { TextField } from '@/components/common/TextField';
import Select from '@/components/common/Select';
import Checkbox from '@/components/common/Checkbox';
import StepIndicator from '@/components/common/StepIndicator';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import { get, post } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';

type StepType = 1 | 2 | 3;
type MemberType = 'general' | 'taxAccountant' | 'other';

const CARRIER_OPTIONS = [
  { value: '', label: '통신사 선택' },
  { value: 'skt', label: 'SKT' },
  { value: 'kt', label: 'KT' },
  { value: 'lgu', label: 'LG U+' },
  { value: 'mvno', label: '알뜰폰' },
];

const DOMAIN_OPTIONS = [
  { value: 'naver.com', label: 'naver.com' },
  { value: 'google.com', label: 'google.com' },
  { value: 'daum.net', label: 'daum.net' },
  { value: 'nate.com', label: 'nate.com' },
  { value: '', label: '직접 입력' },
];

interface TermsState {
  all: boolean;
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
}

const STEP_ITEMS = [
  { number: 'STEP 01', label: '약관동의' },
  { number: 'STEP 02', label: '정보입력' },
  { number: 'STEP 03', label: '가입완료' },
];

const Signup: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [step, setStep] = useState<StepType>(1);
  const [terms, setTerms] = useState<TermsState>({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });
  const [memberType, setMemberType] = useState<MemberType>('general');
  const [userId, setUserId] = useState('');
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  const [isUserIdAvailable, setIsUserIdAvailable] = useState(false);
  const [name, setName] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [selectedDomainOption, setSelectedDomainOption] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [carrier, setCarrier] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [error, setError] = useState('');
  // Field-specific error states
  const [userIdError, setUserIdError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      setError('인증 시간이 만료되었습니다.');
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // 비밀번호 확인 검증 (입력 중에는 오류를 표시하지 않음)
  useEffect(() => {
    if (!passwordConfirm) {
      setPasswordConfirmError('');
      return;
    }
    // 비밀번호가 입력되어 있고, 확인 비밀번호가 비밀번호와 같은 길이이거나 더 길 때만 검증
    if (password && passwordConfirm) {
      // 비밀번호와 확인 비밀번호의 길이가 같을 때만 검증 (입력 중이 아닐 때)
      if (passwordConfirm.length === password.length) {
        if (password !== passwordConfirm) {
          setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
        } else {
          setPasswordConfirmError('');
        }
      } else {
        // 입력 중에는 오류를 표시하지 않음
        setPasswordConfirmError('');
      }
    } else {
      setPasswordConfirmError('');
    }
  }, [password, passwordConfirm]);

  const handleAllAgree = () => {
    const newValue = !terms.all;
    setTerms({ all: newValue, terms: newValue, privacy: newValue, marketing: newValue });
  };

  const handleTermChange = (key: keyof Omit<TermsState, 'all'>) => {
    const newTerms = { ...terms, [key]: !terms[key] };
    newTerms.all = newTerms.terms && newTerms.privacy && newTerms.marketing;
    setTerms(newTerms);
  };

  const isRequiredTermsAgreed = terms.terms && terms.privacy;

  const handleStep1Submit = () => {
    if (!isRequiredTermsAgreed) {
      setError('필수 약관에 동의해주세요.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleCheckUserId = useCallback(async () => {
    console.log('[DEBUG] handleCheckUserId 호출됨, userId:', userId);

    if (!userId) {
      setUserIdError('아이디를 입력해주세요.');
      setIsUserIdChecked(false);
      return;
    }

    // 아이디 형식 검증 (6-20자 영문/숫자)
    const userIdRegex = /^[a-zA-Z0-9]{6,20}$/;
    if (!userIdRegex.test(userId)) {
      setUserIdError('아이디는 6~20자의 영문/숫자만 사용 가능합니다.');
      setIsUserIdChecked(false);
      return;
    }

    setIsLoading(true);
    setUserIdError('');

    try {
      const apiUrl = `${API_ENDPOINTS.AUTH.CHECK_ID}?loginId=${encodeURIComponent(userId)}`;
      console.log('[DEBUG] API 호출 URL:', apiUrl);

      // 아이디 중복 확인 API 호출 (응답: { exists: boolean })
      const response = await get<{ exists: boolean }>(apiUrl);
      console.log('[DEBUG] API 응답:', response);

      setIsUserIdChecked(true);

      if (response.error) {
        // API 에러 처리
        if (response.status === 409 || response.error.includes('이미') || response.error.includes('중복')) {
          setIsUserIdAvailable(false);
          setUserIdError('이미 사용중인 아이디 입니다');
        } else {
          setIsUserIdAvailable(false);
          setUserIdError(response.error);
        }
      } else if (response.data !== undefined) {
        // API 응답에 따라 처리 (exists: false면 사용 가능, true면 이미 존재)
        if (response.data.exists === false) {
          setIsUserIdAvailable(true);
          setUserIdError('');
        } else {
          setIsUserIdAvailable(false);
          setUserIdError('이미 사용중인 아이디 입니다');
        }
      } else {
        // 응답이 없는 경우
        setIsUserIdAvailable(false);
        setUserIdError('아이디 확인에 실패했습니다.');
      }
    } catch {
      setIsUserIdChecked(false);
      setIsUserIdAvailable(false);
      setUserIdError('아이디 확인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const handleRequestVerification = useCallback(async () => {
    if (!carrier || !phone) {
      setPhoneError('휴대폰번호를 입력해주세요');
      return;
    }

    // 휴대폰 번호 형식 정리 (숫자만 추출)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      setPhoneError('올바른 휴대폰 번호를 입력해주세요');
      return;
    }

    setPhoneError('');

    try {
      const response = await post(API_ENDPOINTS.AUTH.PHONE_SEND, {
        phone: cleanPhone
      });

      if (response.error) {
        setPhoneError(response.error);
        return;
      }

      setTimeLeft(300);
      setIsTimerActive(true);
      setError('');
    } catch (err) {
      setPhoneError('인증번호 발송에 실패했습니다.');
    }
  }, [phone, carrier]);

  const handleVerifyCode = useCallback(async () => {
    if (!verificationCode) {
      setVerificationCodeError('인증번호를 입력해주세요.');
      return;
    }

    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const response = await post(API_ENDPOINTS.AUTH.PHONE_VERIFY, {
        phone: cleanPhone,
        code: verificationCode
      });

      if (response.error) {
        setVerificationCodeError(response.error);
        return;
      }

      setIsPhoneVerified(true);
      setIsTimerActive(false);
      setVerificationCodeError('');
    } catch (err) {
      setVerificationCodeError('인증번호가 일치하지 않습니다.');
    }
  }, [verificationCode, phone]);

  const handleDomainSelect = (value: string) => {
    setSelectedDomainOption(value);
    if (value === '') {
      setEmailDomain('');
    } else {
      setEmailDomain(value);
    }
  };

  const validateEmail = useCallback((showError: boolean = false) => {
    // 입력 중에는 오류를 표시하지 않음
    if (!showError) {
      // 둘 다 입력되어 있을 때만 검증
      if (emailLocal && emailDomain) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const fullEmail = `${emailLocal}@${emailDomain}`;
        if (!emailRegex.test(fullEmail)) {
          setEmailError('올바르지 않은 이메일 형식입니다');
        } else {
          setEmailError('');
        }
      } else {
        setEmailError('');
      }
      return;
    }
    
    // 검증 모드: 오류 표시
    if (!emailLocal || !emailDomain) {
      setEmailError('이메일을 작성해주세요');
      return;
    }
    // 이메일 형식 검증 (간단한 검증)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fullEmail = `${emailLocal}@${emailDomain}`;
    if (!emailRegex.test(fullEmail)) {
      setEmailError('올바르지 않은 이메일 형식입니다');
      return;
    }
    setEmailError('');
  }, [emailLocal, emailDomain]);

  const validatePassword = useCallback((pwd: string, showError: boolean = false) => {
    if (!pwd) {
      setPasswordError('');
      return;
    }
    // 입력 중에는 오류를 표시하지 않음 (6자 이상 입력 후에만 검증)
    if (!showError && pwd.length < 6) {
      setPasswordError('');
      return;
    }
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const typeCount = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (pwd.length < 6 || pwd.length > 12) {
      setPasswordError('영문자, 숫자, 특수문자 중 2가지 이상 조합, 6~12자');
    } else if (typeCount < 2) {
      setPasswordError('영문자, 숫자, 특수문자 중 2가지 이상 조합, 6~12자');
    } else {
      setPasswordError('');
    }
  }, []);

  const validatePasswordConfirm = useCallback((pwd: string, confirm: string, showError: boolean = false) => {
    if (!confirm) {
      setPasswordConfirmError('');
      return;
    }
    // 입력 중에는 오류를 표시하지 않음 (비밀번호가 입력된 후에만 검증)
    if (!showError && !pwd) {
      setPasswordConfirmError('');
      return;
    }
    if (pwd !== confirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordConfirmError('');
    }
  }, []);

  // 비밀번호 유효성 검사 (6-12자, 영문자/숫자/특수문자 중 2가지 이상)
  const isPasswordValid = useMemo(() => {
    if (!password || password.length < 6 || password.length > 12) {
      return false;
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const typeCount = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
    return typeCount >= 2;
  }, [password]);

  const isPasswordMatch = password === passwordConfirm && passwordConfirm !== '';
  const fullEmail = emailLocal && emailDomain ? `${emailLocal}@${emailDomain}` : '';

  const isStep2Valid = isUserIdChecked && isUserIdAvailable && name && fullEmail && isPhoneVerified && isPasswordValid && isPasswordMatch;

  const validateAllFields = useCallback(() => {
    let hasError = false;
    
    // 이름 검증
    if (!name) {
      setNameError('이름을 작성해주세요');
      hasError = true;
    }
    
    // 이메일 검증
    validateEmail(true);
    if (!emailLocal || !emailDomain) {
      hasError = true;
    }
    
    // 휴대폰 번호 검증
    if (!carrier || !phone) {
      setPhoneError('휴대폰번호를 입력해주세요');
      hasError = true;
    }
    
    // 비밀번호 검증
    if (password) {
      validatePassword(password, true);
    }
    
    // 비밀번호 확인 검증
    if (passwordConfirm) {
      validatePasswordConfirm(password, passwordConfirm, true);
    }
    
    return !hasError;
  }, [name, emailLocal, emailDomain, carrier, phone, password, passwordConfirm, validateEmail, validatePassword, validatePasswordConfirm]);

  const handleStep2Submit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // 모든 필드 검증
    if (!validateAllFields()) {
      return;
    }

    if (!isStep2Valid) {
      setError('모든 필드를 올바르게 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // memberType 변환 (general -> GENERAL, taxAccountant -> OTHER, other -> INSURANCE)
      const memberTypeMap: Record<MemberType, string> = {
        general: 'GENERAL',
        taxAccountant: 'OTHER',
        other: 'INSURANCE',
      };

      const cleanPhone = phone.replace(/[^0-9]/g, '');

      const response = await post(API_ENDPOINTS.AUTH.SIGN_UP, {
        loginId: userId,
        password: password,
        passwordConfirm: passwordConfirm,
        name: name,
        email: fullEmail,
        phoneNumber: cleanPhone,
        memberType: memberTypeMap[memberType],
        newsletters: newsletter,
        termsAgreed: terms.terms && terms.privacy,
      });

      if (response.error) {
        // 에러 메시지 처리
        if (response.status === 500) {
          setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else if (response.status === 400) {
          if (response.error.includes('ID') || response.error.includes('아이디')) {
            setUserIdError(response.error);
          } else if (response.error.includes('이메일')) {
            setEmailError(response.error);
          } else if (response.error.includes('전화번호') || response.error.includes('휴대폰')) {
            setPhoneError(response.error);
          } else {
            setError(response.error);
          }
        } else {
          setError(response.error);
        }
        return;
      }

      setStep(3);
    } catch {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <div className="auth-form-container">
        <div className="signup-terms-container">
          <div className={`signup-all-agree-wrapper ${terms.all ? 'is-checked' : ''}`}>
            <Checkbox
              variant="square"
              checked={terms.all}
              label="모두 동의 (선택 정보 포함)"
              onChange={handleAllAgree}
              className="signup-all-agree-checkbox"
            />
          </div>
          <div className="signup-terms-list">
            <div className="signup-term-item-wrapper">
              <Checkbox
                variant="square"
                checked={terms.privacy}
                label="[필수] 개인정보 처리 방침 이용 동의"
                onChange={() => handleTermChange('privacy')}
              />
              <button type="button" className="signup-view-link">보기</button>
            </div>
            <div className="signup-term-item-wrapper">
              <Checkbox
                variant="square"
                checked={terms.terms}
                label="[필수] OO OOOOO 이용 동의"
                onChange={() => handleTermChange('terms')}
              />
              <button type="button" className="signup-view-link">보기</button>
            </div>
            <div className="signup-term-item-wrapper">
              <Checkbox
                variant="square"
                checked={terms.marketing}
                label="[선택] OO OOOOO 이용 동의"
                onChange={() => handleTermChange('marketing')}
              />
              <button type="button" className="signup-view-link">보기</button>
            </div>
          </div>
          {error && <p className="auth-error-message">{error}</p>}
        </div>
      </div>

      <div className="signup-step1-button-wrapper">
        <Button
          type={isRequiredTermsAgreed ? "primary" : "secondary"}
          size="large"
          disabled={!isRequiredTermsAgreed}
          onClick={handleStep1Submit}
          rightIcon="arrow-right2-gray"
        >
          다음
        </Button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleStep2Submit}>
          <div className="auth-input-group">
            <label className="auth-input-label">회원 유형 <span className="auth-required-mark">*</span></label>
            <div className="signup-member-type-group">
              {(['general', 'taxAccountant', 'other'] as MemberType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`signup-member-type-button ${memberType === type ? 'is-selected' : ''}`}
                  onClick={() => setMemberType(type)}
                >
                  <span className={`signup-member-type-radio ${memberType === type ? 'is-selected' : ''}`}>
                    {memberType === type && (
                      <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="3.5" cy="3.5" r="3.5" fill="#94B9E3"/>
                      </svg>
                    )}
                  </span>
                  {type === 'general' ? '일반 회원' : type === 'taxAccountant' ? '세무사' : '기타'}
                </button>
              ))}
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">아이디 <span className="auth-required-mark">*</span></label>
            <div className="signup-id-input-group">
              <TextField
                variant="line"
                placeholder="아이디를 입력해주세요"
                value={userId}
                onChange={(val) => { setUserId(val); setIsUserIdChecked(false); }}
                className="signup-id-input"
              />
              <Button
                type="line-white"
                size="medium"
                disabled={!userId || isLoading}
                onClick={handleCheckUserId}
                className="signup-check-duplicate-button"
              >
                {isLoading ? '확인 중...' : '중복 확인'}
              </Button>
            </div>
            {isUserIdChecked && isUserIdAvailable && (
              <p className="auth-success-message">
                <Icon type="info-gray" size={16} />
                사용 가능한 아이디입니다.
              </p>
            )}
            {userIdError && (
              <p className="auth-error-message">
                <Icon type="error" size={16} />
                {userIdError}
              </p>
            )}
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">이름 <span className="auth-required-mark">*</span></label>
            <TextField
              variant="line"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(val) => {
                setName(val);
                if (val) {
                  setNameError('');
                }
              }}
              error={!!nameError}
              fullWidth
            />
            {nameError && (
              <p className="auth-error-message">
                <Icon type="error" size={16} />
                {nameError}
              </p>
            )}
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">이메일<span className="auth-required-mark">*</span></label>
            <div className="signup-email-input-group">
              <div className="signup-email-input-wrapper">
                <TextField
                  variant="line"
                  placeholder="이메일"
                  value={emailLocal}
                  onChange={(val) => {
                    setEmailLocal(val);
                    // 입력 중에는 오류를 표시하지 않음
                    if (val && emailDomain) {
                      validateEmail(false);
                    } else {
                      setEmailError('');
                    }
                  }}
                  error={!!emailError && !emailLocal}
                />
              </div>
              <span className="signup-at-sign">@</span>
              <div className="signup-email-domain-wrapper">
                {selectedDomainOption === '' ? (
                  <TextField
                    variant="line"
                    placeholder="직접 입력"
                    value={emailDomain}
                    onChange={(val) => {
                      setEmailDomain(val);
                      // 입력 중에는 오류를 표시하지 않음
                      if (val && emailLocal) {
                        validateEmail(false);
                      } else {
                        setEmailError('');
                      }
                    }}
                    error={!!emailError && !emailDomain}
                  />
                ) : (
                  <span className="signup-email-domain-text">{emailDomain}</span>
                )}
              </div>
              <Select
                options={DOMAIN_OPTIONS}
                value={selectedDomainOption}
                onChange={(val) => {
                  handleDomainSelect(val);
                  // 도메인 선택 시 이메일 검증
                  if (val && emailLocal) {
                    validateEmail(false);
                  } else {
                    setEmailError('');
                  }
                }}
                placeholder="이메일 선택"
                className="signup-domain-select"
              />
            </div>
            {emailError && (
              <p className="auth-error-message">
                <Icon type="error" size={16} />
                {emailError}
              </p>
            )}
            <div className="signup-newsletter-wrapper">
              <Checkbox
                variant="square"
                checked={newsletter}
                label="뉴스레터 신청"
                onChange={setNewsletter}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">휴대폰 번호<span className="auth-required-mark">*</span></label>
            <div className="signup-phone-input-group">
              <Select
                options={CARRIER_OPTIONS}
                value={carrier}
                onChange={(val) => {
                  setCarrier(val);
                  if (val && phone) {
                    setPhoneError('');
                  }
                }}
                placeholder="통신사 선택"
                className="signup-carrier-select"
              />
              <TextField
                variant="line"
                type="tel"
                placeholder="휴대폰 번호를 입력해주세요"
                value={phone}
                onChange={(val) => {
                  setPhone(val);
                  if (val && carrier) {
                    setPhoneError('');
                  }
                }}
                readOnly={isPhoneVerified}
                className="signup-phone-input"
                error={!!phoneError}
              />
              <Button
                type="line-white"
                size="medium"
                disabled={!carrier || !phone || isPhoneVerified || isLoading}
                onClick={handleRequestVerification}
                className="signup-request-verification-button"
              >
                {isLoading ? '발송 중...' : '인증 요청'}
              </Button>
            </div>
            {phoneError && (
              <p className="auth-error-message">
                <Icon type="error" size={16} />
                {phoneError}
              </p>
            )}
          </div>

          {isTimerActive && !isPhoneVerified && (
            <div className="auth-input-group">
              <label className="auth-input-label">인증번호 <span className="auth-required-mark">*</span></label>
              <div className="signup-verification-code-group">
                <TextField
                  variant="line"
                  placeholder="인증번호를 입력해주세요"
                  value={verificationCode}
                  onChange={(val) => {
                    setVerificationCode(val);
                    if (val) {
                      setVerificationCodeError('');
                    }
                  }}
                  maxLength={6}
                  timer={isTimerActive ? timeLeft : undefined}
                  className="signup-verification-code-input"
                  error={!!verificationCodeError}
                />
                <Button
                  type="line-white"
                  size="medium"
                  disabled={!verificationCode || isLoading}
                  onClick={handleVerifyCode}
                  className="signup-verify-code-button"
                >
                  {isLoading ? '확인 중...' : '확인'}
                </Button>
              </div>
              {verificationCodeError && (
                <p className="auth-error-message">
                  <Icon type="error" size={16} />
                  {verificationCodeError}
                </p>
              )}
            </div>
          )}
          {isPhoneVerified && (
            <p className="auth-success-message">
              <Icon type="info-gray" size={16} />
              휴대폰 인증이 완료되었습니다.
            </p>
          )}

          <div className="auth-input-group">
            <label className="auth-input-label">비밀번호 <span className="auth-required-mark">*</span></label>
            <TextField
              variant="line"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(val) => {
                setPassword(val);
                // 입력 중에는 오류를 표시하지 않음 (6자 이상 입력 후에만 검증)
                if (val.length >= 6) {
                  validatePassword(val, true);
                } else {
                  setPasswordError('');
                }
                // 비밀번호가 변경되면 비밀번호 확인도 다시 검증
                if (passwordConfirm) {
                  validatePasswordConfirm(val, passwordConfirm, true);
                }
              }}
              showPasswordToggle
              error={!!passwordError}
              fullWidth
            />
            {passwordError && (
              <p className="auth-error-message">
                <Icon type="error" size={16} />
                {passwordError}
              </p>
            )}
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">비밀번호 확인 <span className="auth-required-mark">*</span></label>
            <TextField
              variant="line"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              value={passwordConfirm}
              onChange={(val) => {
                setPasswordConfirm(val);
              }}
              showPasswordToggle
              error={!!passwordConfirmError}
              fullWidth
            />
            {passwordConfirmError && (
              <p className="auth-error-message">
                <Icon type="error" size={16} />
                {passwordConfirmError}
              </p>
            )}
          </div>

          {error && <p className="auth-error-message">{error}</p>}
        </form>
      </div>

      <div className="signup-step2-button-group">
        <Button
          type="line-white"
          size="large"
          leftIcon="arrow-left2-gray"
          onClick={() => setStep(1)}
        >
          이전
        </Button>
        <Button
          type={isStep2Valid ? "primary" : "secondary"}
          size="large"
          rightIcon="arrow-right2-gray"
          disabled={!isStep2Valid || isLoading}
          onClick={handleStep2Submit}
        >
          {isLoading ? '가입 중...' : '다음'}
        </Button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="auth-form-container">
        <div className="signup-completion-section">
          <div className="signup-completion-icon-wrapper">
            <Icon type="check-blue" size={20} className="signup-completion-icon" />
          </div>
          <h2 className="signup-completion-title">회원가입이 완료되었습니다</h2>
          <p className="signup-completion-message">회원이 되신 것을 진심으로 환영합니다</p>
        </div>
      </div>
      <div className="signup-completion-button-wrapper">
        <Button type="primary" size="large" onClick={() => router.push('/login')}>
          로그인
        </Button>
      </div>
    </>
  );

  return (
    <div className="auth-page-container">
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <section className="auth-content-section">
        <h1 className="auth-page-title">SIGN UP</h1>
        <StepIndicator steps={STEP_ITEMS} currentStep={step} />
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </section>
      <Footer />
    </div>
  );
};

export default Signup;

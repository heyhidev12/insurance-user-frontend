import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import { TextField } from '@/components/common/TextField';
import Tab from '@/components/common/Tab';
import Button from '@/components/common/Button';
import { post } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { formatPhoneInput, normalizePhone, validatePhone } from '@/lib/phoneValidation';
// styles는 _app.tsx에서 import됨 (FindUsername과 동일한 스타일 사용)

type TabType = 'sms' | 'email';
type StepType = 'input' | 'verification';

const tabItems = [
  { id: 'sms', label: '문자 / 카카오 인증' },
  { id: 'email', label: '이메일 인증' },
];

const FindPassword: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('sms');
  const [step, setStep] = useState<StepType>('input');
  const [userId, setUserId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      setError('인증 시간이 만료되었습니다. 다시 인증번호를 요청해주세요.');
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const handleRequestVerification = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setIsLoading(true);

    if (!userId) {
      setError('아이디를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      if (activeTab === 'sms') {
        if (!phone) {
          setError('휴대폰 번호를 입력해주세요.');
          setIsLoading(false);
          return;
        }

        const cleanPhone = normalizePhone(phone);
        const validation = validatePhone(phone);
        if (!validation.valid) {
          setError(validation.error ?? '올바른 휴대폰 번호를 입력해주세요.');
          setIsLoading(false);
          return;
        }

        const response = await post(API_ENDPOINTS.AUTH.FIND_PASSWORD_PHONE_SEND, {
          loginId: userId,
          phoneNumber: cleanPhone,
        });

        if (response.error) {
          if (response.status === 404) {
            setError('해당 정보로 가입된 회원이 없습니다.');
          } else {
            setError(response.error || '인증번호 발송에 실패했습니다.');
          }
          return;
        }

        setTimeLeft(300);
        setIsTimerActive(true);
        setStep('verification');
      } else {
        if (!email) {
          setError('이메일을 입력해주세요.');
          setIsLoading(false);
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError('올바른 이메일 형식을 입력해주세요.');
          setIsLoading(false);
          return;
        }

        const response = await post(API_ENDPOINTS.AUTH.FIND_PASSWORD_EMAIL_SEND, {
          loginId: userId,
          email: email,
        });

        if (response.error) {
          if (response.status === 404) {
            setError('해당 정보로 가입된 회원이 없습니다.');
          } else {
            setError(response.error || '인증번호 발송에 실패했습니다.');
          }
          return;
        }

        setTimeLeft(300);
        setIsTimerActive(true);
        setStep('verification');
      }
    } catch {
      setError('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, userId, phone, email]);

  const handleVerifyCode = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setIsLoading(true);

    if (!verificationCode) {
      setError('인증번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      let response;
      if (activeTab === 'sms') {
        const cleanPhone = normalizePhone(phone);
        response = await post<{ resetToken: string }>(API_ENDPOINTS.AUTH.FIND_PASSWORD_PHONE_VERIFY, {
          loginId: userId,
          phoneNumber: cleanPhone,
          verificationCode: verificationCode,
        });
      } else {
        response = await post<{ resetToken: string }>(API_ENDPOINTS.AUTH.FIND_PASSWORD_EMAIL_VERIFY, {
          loginId: userId,
          email: email,
          verificationCode: verificationCode,
        });
      }

      if (response.error) {
        if (response.status === 400) {
          setError('인증번호가 올바르지 않거나 만료되었습니다.');
        } else if (response.status === 404) {
          setError('해당 정보로 가입된 회원이 없습니다.');
        } else {
          setError(response.error || '인증에 실패했습니다.');
        }
        return;
      }

      if (response.data?.resetToken) {
        setResetToken(response.data.resetToken);
        setIsTimerActive(false);
        router.push(`/reset-password?token=${encodeURIComponent(response.data.resetToken)}`);
      } else {
        setError('비밀번호 재설정 토큰을 받지 못했습니다.');
      }
    } catch {
      setError('인증에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [verificationCode, activeTab, userId, phone, email, router]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabType);
    setStep('input');
    setUserId('');
    setPhone('');
    setEmail('');
    setVerificationCode('');
    setError('');
    setIsTimerActive(false);
    setTimeLeft(0);
  };

  const handleFindUsername = () => router.push('/find-username');

  const renderInputForm = () => (
    <>
      <div className="find-username-form-container">
        <form id="find-password-input-form" className="find-username-form" onSubmit={handleRequestVerification}>
          <div className="find-username-form-fields">
            <TextField
              variant="line"
              label="아이디"
              placeholder="아이디를 입력해주세요"
              value={userId}
              onChange={setUserId}
              fullWidth
            />

            {activeTab === 'sms' ? (
              <div className="find-username-field-with-button">
                <TextField
                  variant="line"
                  label="휴대폰 번호"
                  type="tel"
                  placeholder="01012345678 (숫자만 입력)"
                  value={phone}
                  onChange={(val) => setPhone(formatPhoneInput(val))}
                  fullWidth
                />
                <Button
                  type="line-white"
                  size="medium"
                  disabled={!userId || !phone || isLoading}
                  htmlType="submit"
                >
                  {isLoading ? '발송 중...' : '인증 요청'}
                </Button>
              </div>
            ) : (
              <TextField
                variant="line"
                label="이메일"
                type="email"
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={setEmail}
                fullWidth
              />
            )}

            {error && (
              <p className="auth-error-message">
                <img src="/images/common/error-icon.svg" alt="" width={16} height={16} />
                {error}
              </p>
            )}
          </div>
        </form>
      </div>

      <div className="find-username-button-wrapper">
        <Button
          type="primary"
          size="large"
          disabled={!userId || (activeTab === 'sms' ? !phone : !email) || isLoading}
          htmlType="submit"
          form="find-password-input-form"
        >
          {isLoading ? '확인 중...' : '확인'}
        </Button>
      </div>

      <div className="find-username-bottom-links">
        <Button type="text-link-gray" size="small" onClick={handleFindUsername}>
          아이디 찾기
        </Button>
        <span className="find-username-link-divider">|</span>
        <Button type="text-link-gray" size="small" onClick={() => router.push('/signup')}>
          회원가입
        </Button>
      </div>
    </>
  );

  const renderVerificationForm = () => (
    <>
      {activeTab === 'email' && (
        <p className="auth-verification-subtitle">
          "{email}"(으)로 전달된<br />
          인증번호를 입력해주세요.
        </p>
      )}
      <div className="find-username-form-container">
        <form id="find-password-verify-form" className="find-username-form" onSubmit={handleVerifyCode}>
          <div className="find-username-form-fields">
            {activeTab === 'sms' ? (
              <>
                <TextField
                  variant="line"
                  label="아이디"
                  value={userId}
                  readOnly
                  fullWidth
                />
                <div className="find-username-field-with-button">
                  <TextField
                    variant="line"
                    label="휴대폰 번호"
                    type="tel"
                    value={phone}
                    readOnly
                    fullWidth
                  />
                  <Button
                    type="line-white"
                    size="medium"
                    onClick={handleRequestVerification}
                    disabled={!isTimerActive || isLoading}
                  >
                    {isLoading ? '발송 중...' : '인증 재요청'}
                  </Button>
                </div>
              </>
            ) : null}

            <div className="find-username-verification-code-wrapper">
              <TextField
                variant="line"
                placeholder="인증번호를 입력해주세요"
                value={verificationCode}
                onChange={setVerificationCode}
                maxLength={6}
                timer={isTimerActive ? timeLeft : undefined}
                fullWidth
                error={!!error}
              />
              {activeTab === 'email' && (
                <button
                  type="button"
                  className="find-username-resend-link"
                  onClick={handleRequestVerification}
                  disabled={!isTimerActive || isLoading}
                >
                  {isLoading ? '발송 중...' : '인증번호 재요청'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="find-username-error-wrapper">
          <p className="auth-error-message">
            <img src="/images/common/error-icon.svg" alt="" width={16} height={16} />
            {error}
          </p>
        </div>
      )}

      <div className="find-username-button-wrapper">
        <Button
          type={verificationCode && isTimerActive && !error ? "primary" : "secondary"}
          size="large"
          disabled={!verificationCode || !isTimerActive || !!error || isLoading}
          htmlType="submit"
          form="find-password-verify-form"
        >
          {isLoading ? '확인 중...' : '확인'}
        </Button>
      </div>
    </>
  );

  return (
    <div className="auth-page-container">
     <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true}/>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <section className="auth-content-section">
        <h1 className="auth-page-title">FORGOT PASSWORD</h1>
        {(step === 'input' || step === 'verification') && (
          <>
            <p className="auth-page-subtitle">사용중인 아이디를 인증 완료 시<br />비밀번호를 재설정할 수 있습니다.</p>
            <div className="find-username-tab-wrapper">
              <Tab
                items={tabItems}
                activeId={activeTab}
                onChange={handleTabChange}
                style="box"
                size="medium"
                showActiveDot={true}
                fullWidth
              />
            </div>
          </>
        )}
        {step === 'input' && renderInputForm()}
        {step === 'verification' && renderVerificationForm()}
      </section>
      <Footer />
    </div>
  );
};

export default FindPassword;

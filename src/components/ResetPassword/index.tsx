import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import { TextField } from '@/components/common/TextField';
import Button from '@/components/common/Button';
import { post } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // URL에서 토큰 추출
  useEffect(() => {
    if (router.isReady) {
      const tokenFromQuery = router.query.token as string;
      if (tokenFromQuery) {
        setToken(tokenFromQuery);
      } else {
        // 토큰이 없으면 비밀번호 찾기 페이지로 리다이렉트
        setError('유효하지 않은 접근입니다. 비밀번호 찾기를 다시 진행해주세요.');
      }
    }
  }, [router.isReady, router.query.token]);

  // 비밀번호 유효성 검사 (8-16자, 영문/숫자/특수문자 중 2가지 이상)
  const isPasswordValid = useMemo(() => {
    if (!newPassword || newPassword.length < 8 || newPassword.length > 16) {
      return false;
    }
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const typeCount = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
    return typeCount >= 2;
  }, [newPassword]);

  const handlePasswordChange = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');

    if (!token) {
      setError('유효하지 않은 접근입니다. 비밀번호 찾기를 다시 진행해주세요.');
      return;
    }

    if (!newPassword) {
      setError('새로운 비밀번호를 입력해주세요.');
      return;
    }

    if (!isPasswordValid) {
      setError('비밀번호는 8~16자, 영문/숫자/특수문자 중 2가지 이상 조합이어야 합니다.');
      return;
    }

    if (!confirmPassword) {
      setError('새로운 비밀번호 확인을 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    setIsLoading(true);

    try {
      const response = await post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token: token,
        newPassword: newPassword,
        newPasswordConfirm: confirmPassword,
      });

      if (response.error) {
        if (response.status === 500) {
          setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else if (response.status === 400) {
          setError('토큰이 유효하지 않거나 만료되었습니다. 비밀번호 찾기를 다시 진행해주세요.');
        } else {
          setError(response.error);
        }
        return;
      }

      // 성공 시 로그인 페이지로 이동
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch {
      setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
     <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true}/>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <section className="auth-content-section">
        <h1 className="auth-page-title">RESET PASSWORD</h1>

        {isSuccess ? (
          <div className="find-username-form-container">
            <div className="find-result-message-container">
              <p className="find-result-message">
                비밀번호가 성공적으로 변경되었습니다.<br />
                로그인 페이지로 이동합니다.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="find-username-form-container">
              <form className="find-username-form" onSubmit={handlePasswordChange}>
                <div className="find-username-form-fields">
                  <TextField
                    variant="line"
                    label="새로운 비밀번호"
                    type="password"
                    placeholder="비밀번호를 입력해주세요 (8~16자)"
                    value={newPassword}
                    onChange={setNewPassword}
                    showPasswordToggle
                    fullWidth
                  />

                  <div className="find-username-password-confirm-wrapper">
                    <TextField
                      variant="line"
                      label="새로운 비밀번호 확인"
                      type="password"
                      placeholder="새로운 비밀번호를 다시 입력해주세요"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      showPasswordToggle
                      error={error ? true : false}
                      fullWidth
                    />
                    {error && <p className="auth-error-message">{error}</p>}
                  </div>
                </div>
              </form>
            </div>

            <div className="find-username-button-wrapper">
              <Button
                type="primary"
                size="large"
                disabled={!newPassword || !confirmPassword || isLoading || !token}
                onClick={handlePasswordChange}
              >
                {isLoading ? '변경 중...' : '비밀번호 변경'}
              </Button>
            </div>
          </>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default ResetPassword;


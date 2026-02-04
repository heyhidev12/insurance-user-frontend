import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import { TextField } from '@/components/common/TextField';
import Checkbox from '@/components/common/Checkbox';
import Button from '@/components/common/Button';
import { post } from '@/lib/api';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

interface LoginResponse {
  accessToken: string;
  member?: {
    id: number;
    loginId: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    memberType?: string;
    isApproved?: boolean;
    status?: string;
    newsletterSubscribed?: boolean;
    affiliation?: string | null;
    provider?: string | null;
    providerId?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
}

const Login: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: apiError, status } = await post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          loginId: userId,
          password: password,
          autoLogin: rememberMe,
        }
      );

      if (apiError || !data) {
        if (status === 401) {
          setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        } else {
          setError(apiError || '로그인에 실패했습니다. 다시 시도해주세요.');
        }
        return;
      }

      // 토큰 저장
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);

        // 자동 로그인 설정 시 토큰을 더 오래 유지
        if (rememberMe) {
          localStorage.setItem('autoLogin', 'true');
        } else {
          localStorage.removeItem('autoLogin');
        }

        // 사용자 정보 저장 (member 객체)
        if (data.member) {
          localStorage.setItem('user', JSON.stringify(data.member));
        }
      }

      // 로그인 성공 후 메인 페이지로 이동
      router.push('/');
    } catch (err) {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'kakao' | 'naver') => {
    const socialEndpoints = {
      google: API_ENDPOINTS.AUTH.GOOGLE,
      kakao: API_ENDPOINTS.AUTH.KAKAO,
      naver: API_ENDPOINTS.AUTH.NAVER,
    };

    // 소셜 로그인 페이지로 리다이렉트
    window.location.href = `${API_BASE_URL}${socialEndpoints[provider]}`;
  };

  return (
    <div className="auth-page-container">
     <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true}/>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <section className="login-section">
        <h1 className="login-title">LOGIN</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <TextField
            variant="line"
            label="아이디"
            placeholder="아이디를 입력해주세요"
            value={userId}
            onChange={setUserId}
            disabled={isLoading}
            fullWidth
          />

          <TextField
            variant="line"
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={setPassword}
            showPasswordToggle
            disabled={isLoading}
            fullWidth
          />

          <div className="login-options-row">
            <Checkbox
              variant="square"
              label="로그인 유지"
              checked={rememberMe}
              onChange={setRememberMe}
              disabled={isLoading}
            />
            <div className="login-links-wrapper">
              <Button
                type="text-link-gray"
                size="small"
                onClick={() => router.push('/find-username')}
              >
                아이디 찾기
              </Button>
              <span className="login-link-divider">|</span>
              <Button
                type="text-link-gray"
                size="small"
                onClick={() => router.push('/find-password')}
              >
                비밀번호 찾기
              </Button>
            </div>
          </div>

          {error && (
            <p className="auth-error-message">
              <img src="/images/common/error-icon.svg" alt="" width={16} height={16} />
              {error}
            </p>
          )}

          <Button
            type="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            htmlType="submit"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <p className="login-signup-link">
          아직 회원이 아니신가요? <Link href="/signup" className="login-signup-link-text">회원가입</Link>
        </p>

        <div className="social-login-section">
          <div className="social-divider" />
          <span className="social-divider-text">SNS 계정으로 로그인하기</span>
          <div className="social-buttons">
            <button
              type="button"
              className="social-button kakao"
              onClick={() => handleSocialLogin('kakao')}
              disabled={isLoading}
            >
              <span className="kakao-icon" />
            </button>
            <button
              type="button"
              className="social-button naver"
              onClick={() => handleSocialLogin('naver')}
              disabled={isLoading}
            >
              <span className="naver-icon">N</span>
            </button>
            <button
              type="button"
              className="social-button google"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <span className="google-icon" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;

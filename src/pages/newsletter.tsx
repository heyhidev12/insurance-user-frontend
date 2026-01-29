import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import { TextField } from '@/components/common/TextField';
import Button from '@/components/common/Button';
import { get, post } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import styles from './newsletter.module.scss';

interface NewsletterPageResponse {
  isExposed: boolean;
}

const NewsletterPage: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 페이지 노출 여부 확인
  useEffect(() => {
    const checkPageVisibility = async () => {
      try {
        const response = await get<NewsletterPageResponse>(API_ENDPOINTS.NEWSLETTER.PAGE);
        if (response.data) {
          setIsPageVisible(response.data.isExposed);
        } else {
          setIsPageVisible(false);
        }
      } catch {
        setIsPageVisible(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPageVisibility();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name) {
      setError('이름을 입력해주세요.');
      return;
    }

    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await post(API_ENDPOINTS.NEWSLETTER.SUBSCRIBE, {
        name,
        email,
      });

      if (response.error) {
        if (response.status === 409) {
          setError('이미 구독 중인 이메일입니다.');
        } else {
          setError(response.error || '구독 신청에 실패했습니다.');
        }
        return;
      }

      setIsSuccess(true);
    } catch {
      setError('구독 신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className={styles.newsletterPage}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.loadingContainer}>
          <p>로딩 중...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // 페이지 비노출 상태
  if (!isPageVisible) {
    return (
      <div className={styles.newsletterPage}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.notAvailableContainer}>
          <h1 className={styles.title}>NEWSLETTER</h1>
          <p className={styles.message}>현재 뉴스레터 구독 서비스가 준비 중입니다.</p>
          <Button type="primary" size="large" onClick={() => router.push('/')}>
            홈으로 돌아가기
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.newsletterPage}>
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={styles.contentSection}>
        <h1 className={styles.title}>NEWSLETTER</h1>
        <p className={styles.subtitle}>
          세무법인 함께의 최신 소식과 유용한 세무 정보를<br />
          이메일로 받아보세요.
        </p>

        {isSuccess ? (
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#94B9E3" fillOpacity="0.2" />
                <path
                  d="M14 24L21 31L34 18"
                  stroke="#94B9E3"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className={styles.successTitle}>구독 신청이 완료되었습니다!</h2>
            <p className={styles.successMessage}>
              입력하신 이메일로 뉴스레터를 보내드리겠습니다.<br />
              감사합니다.
            </p>
            <Button type="primary" size="large" onClick={() => router.push('/')}>
              홈으로 돌아가기
            </Button>
          </div>
        ) : (
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <TextField
                variant="line"
                label="이름"
                placeholder="이름을 입력해주세요"
                value={name}
                onChange={setName}
                fullWidth
              />

              <TextField
                variant="line"
                label="이메일"
                type="email"
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={setEmail}
                fullWidth
              />

              {error && (
                <p className={styles.errorMessage}>
                  <img src="/images/common/error-icon.svg" alt="" width={16} height={16} />
                  {error}
                </p>
              )}

              <div className={styles.buttonWrapper}>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  disabled={!name || !email || isSubmitting}
                >
                  {isSubmitting ? '신청 중...' : '구독 신청'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default NewsletterPage;

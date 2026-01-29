import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * OAuth 콜백 페이지
 *
 * 소셜 로그인(Google, Kakao, Naver) 후 리다이렉트되는 페이지입니다.
 * URL 쿼리에서 토큰을 추출하여 localStorage에 저장하고 메인 페이지로 이동합니다.
 */
const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const { token, error, accessToken } = router.query;

    // 토큰이 있으면 저장
    const tokenValue = (token || accessToken) as string | undefined;

    if (tokenValue) {
      localStorage.setItem('accessToken', tokenValue);
      router.replace('/');
    } else if (error) {
      // 에러가 있으면 로그인 페이지로 이동
      router.replace(`/login?error=${encodeURIComponent(error as string)}`);
    } else if (router.isReady) {
      // 쿼리 파라미터가 없으면 로그인 페이지로
      router.replace('/login');
    }
  }, [router.query, router.isReady, router]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#151515',
        color: '#fff',
      }}
    >
      <p>로그인 처리 중...</p>
    </div>
  );
};

export default AuthCallback;

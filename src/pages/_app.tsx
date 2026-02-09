import '@/styles/global.scss';
// Component styles (Next.js requires global CSS imports in _app)
import '@/components/Header/styles.scss';
import '@/components/Footer/styles.scss';
import '@/components/Menu/styles.scss';
import '@/components/Login/styles.scss';
import '@/components/Signup/styles.scss';
import '@/components/FindUsername/styles.scss';
import '@/components/FindPassword/styles.scss';
import '@/components/ResetPassword/styles.scss';
import '@/components/Home/styles.scss';
import '@/components/TestMotion/styles.scss';
// Design System Component styles
import '@/components/common/Button/styles.scss';
import '@/components/common/TextField/styles.scss';
import '@/components/common/Checkbox/styles.scss';
import '@/components/common/Select/styles.scss';
import '@/components/common/StepIndicator/styles.scss';
// Header는 CSS Modules로 변경되어 _app.tsx에서 import 불필요
import '@/components/common/Tab/styles.scss';
import '@/components/common/Footer/styles.scss';
import '@/components/common/PageHeader/styles.scss';
import '@/components/common/Card/styles.scss';
// FloatingButton은 CSS Modules로 변경되어 _app.tsx에서 import 불필요
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import SEO from '@/components/SEO';
import ScrollToTop from '@/components/common/ScrollToTop';
import { FooterProvider } from '@/context/FooterContext';
import Head from 'next/head';
import Script from 'next/script';

const pagesWithFloatingButton = [
    '/insights',
    '/insights/[id]',
    '/experts',
    '/experts/[id]',
    '/history',
    '/business-areas/hierarchical',
    '/business-areas/[id]',
    '/education',
  ];

  export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const showScrollToTop = pagesWithFloatingButton.includes(router.pathname);
  
    return (
      <FooterProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        </Head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
  
        <Script id="ga-init" strategy="afterInteractive">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
        page_path: window.location.pathname,
        debug_mode: true,
      });
    `}
        </Script>
  
        <Component {...pageProps} />
        {showScrollToTop && <ScrollToTop />}
      </FooterProvider>
    );
  }

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modoo-consulting.com';

  return (
    <Html lang="ko">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon/favicon.ico" />
        <link rel="manifest" href="/favicon/site.webmanifest" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@300;400;500&family=Noto+Serif+KR:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
          rel="stylesheet"
        />

        {/* Default Meta Tags */}
        {/* NOTE: viewport must be set in _app or per-page Head to avoid Next.js warning */}
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />

        {/* Naver Map Script */}
        <script
          type="text/javascript"
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || ''}&callback=initNaverMap`}
          defer
        />

        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: '모두컨설팅',
              alternateName: 'MODOO Consulting',
              url: baseUrl,
              logo: `${baseUrl}/images/logo/logo-hd.png`,
              address: {
                '@type': 'PostalAddress',
                addressLocality: '서울',
                addressRegion: '서초구',
                addressCountry: 'KR',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+82-2-522-5333',
                contactType: 'customer service',
                areaServed: 'KR',
                availableLanguage: ['Korean'],
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00',
              },
              description:
                '모두컨설팅은 전략 컨설팅, 경영자문, 조직 운영 개선을 통해 기업의 지속 가능한 성장을 지원하는 전문 컨설팅 회사입니다.',
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  menuName?: string;
  pageTitle?: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  menuName,
  pageTitle,
  canonical,
  ogImage = '/favicon/og.png',
  noindex = false,
}) => {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://modoo-consulting.com');

  // Default values
  const defaultTitle = '모두컨설팅 | 경영컨설팅·전략자문·기업성장 솔루션';
  const defaultDescription =
    '모두컨설팅은 전략 컨설팅, 경영자문, 조직 운영 개선을 통해 기업의 지속 가능한 성장을 지원하는 전문 컨설팅 회사입니다.';

  // Build dynamic title
  let finalTitle = defaultTitle;
  if (title) {
    finalTitle = title;
  } else if (pageTitle && menuName) {
    // Content/Flexible pages: [Page Title] | [Menu Name] | 모두컨설팅
    finalTitle = `${pageTitle} | ${menuName} | 모두컨설팅`;
  } else if (menuName) {
    // Menu pages: [Menu Name] | 모두컨설팅
    finalTitle = `${menuName} | 모두컨설팅`;
  }

  const finalDescription = description || defaultDescription;
  const canonicalUrl = canonical || `${baseUrl}${router.asPath}`;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="모두컨설팅" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Keywords */}
      <meta
        name="keywords"
        content="경영컨설팅, 기업컨설팅, 전략컨설팅, 경영자문, 비즈니스 컨설팅, 기업 성장 컨설팅, 조직 운영 개선, 프로세스 개선, 사업 전략, 기업 혁신, 경영 전략, 스타트업 컨설팅, 중소기업 컨설팅"
      />
    </Head>
  );
};

export default SEO;

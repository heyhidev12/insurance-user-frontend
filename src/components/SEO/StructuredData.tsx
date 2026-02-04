import Head from 'next/head';

interface StructuredDataProps {
  type?: 'Organization' | 'Article' | 'BreadcrumbList';
  data?: Record<string, any>;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type = 'Organization', data }) => {
  const getOrganizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '모두컨설팅',
    alternateName: 'MODOO Consulting',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    logo: typeof window !== 'undefined' ? `${window.location.origin}/images/logo/logo-hd.png` : '',
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
    ...data,
  });

  const getSchema = () => {
    switch (type) {
      case 'Organization':
        return getOrganizationSchema();
      default:
        return data || {};
    }
  };

  const schema = getSchema();

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

export default StructuredData;

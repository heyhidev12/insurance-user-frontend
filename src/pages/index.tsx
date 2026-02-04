import dynamic from 'next/dynamic';
import SEO from '@/components/SEO';

const Home = dynamic(() => import('@/components/Home'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontSize: '1.5rem',
      scrollbarWidth: 'none',
      
    }}>
      Loading...
    </div>
  ),
});

export default function HomePage() {
  return (
    <>
      <SEO
        title="모두컨설팅 | 경영컨설팅·전략자문·기업성장 솔루션"
        description="모두컨설팅은 전략 컨설팅, 경영자문, 조직 운영 개선을 통해 기업의 지속 가능한 성장을 지원하는 전문 컨설팅 회사입니다."
      />
      <Home />
    </>
  );
}

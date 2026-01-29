import dynamic from 'next/dynamic';

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
    }}>
      Loading...
    </div>
  ),
});

export default function HomePage() {
  return <Home />;
}

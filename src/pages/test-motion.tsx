import dynamic from 'next/dynamic';

const TestMotion = dynamic(() => import('@/components/TestMotion'), {
  ssr: false,
});

export default function TestMotionPage() {
  return <TestMotion />;
}

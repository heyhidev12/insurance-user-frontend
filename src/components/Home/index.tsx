import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';

// GSAP ScrollTrigger 플러그인 등록
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 동영상 경로 (public 폴더)
const visionVideo = '/videos/vision.mp4';
const growthVideo = '/videos/growth.mp4';
const crewVideo = '/videos/crew.mp4';
const yachtVideo = '/videos/yacht.mp4';
const financeVideo = '/videos/finance.mp4';
const card1Video = '/videos/card1.mp4';
const card2Video = '/videos/card2.mp4';
const card3Video = '/videos/card3.mp4';
const card4Video = '/videos/card4.mp4';
const card5Video = '/videos/card5.mp4';
const card6Video = '/videos/card6.mp4';
const systemVideo = '/videos/system.mp4';
const systemCard1Video = '/videos/system-card1.mp4';
const systemCard2Video = '/videos/system-card2.mp4';
const systemCard3Video = '/videos/system-card3.mp4';
const champagneVideo = '/videos/champagne.mp4';

// 이미지 경로 (public 폴더)
const binocularsImg = '/images/main/sections/binoculars.jpg';
const compassImg = '/images/main/sections/compass.png';
const btnLeftActive = '/images/main/buttons/btn-left-active.png';
const btnLeftInactive = '/images/main/buttons/btn-left-inactive.png';
const btnRightActive = '/images/main/buttons/btn-right-active.png';
const btnRightInactive = '/images/main/buttons/btn-right-inactive.png';

// 배경 이미지 경로 추가
const teamworkImg = '/images/main/sections/teamwork.jpg';
const cruiseImg = '/images/main/sections/cruise.png';

// 전문가 카드 데이터 타입
interface ExpertCard {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
}

// 타임라인 데이터 (Solution 02)
const TIMELINE_STEPS = [
  { step: '01', title: '통합적 관점', tags: ['One-Stop Learning'], cols: 1 },
  { step: '02', title: '실무 중심 커리큘럼', tags: ['Work-ready', '커리큘럼명'], cols: 2 },
  { step: '03', title: '크로스펑셔널 멘토링', tags: ['전문가 네트워크'], cols: 3 },
  { step: '04', title: '프로세스 기반 교육', tags: ['문제 해결 프레임워크', '커리큘럼명'], cols: 3 },
  { step: '05', title: '평가-성과 연계', tags: ['학습 → 실적 전환'], cols: 4 },
  { step: '06', title: '유연한 전달 방식', tags: ['On-Off Line', '하이브리드'], cols: 5, highlight: true },
];

// Solution 카드 데이터
const SOLUTION_ROW1 = [
  { title: '법인 전환', items: ['일반양수도', '포괄양수도', '현물출자', '중소기업통합'] },
  { title: '정관 정비', items: ['경영체도', '임원보수설계', '재규정설계'] },
  { title: '명의신탁', items: ['차명주식환원', '신탁확인소송'] },
  { title: '자기주식', items: ['이익금환원', '경영권보장'] },
  { title: '증여/상속\n컨설팅', items: ['주가관리', '배당(증권,정기,현물)', '감액배당'] },
  { title: '세무조사 대응', items: ['모의세무조사', '협업조사', '인력관리'] },
  { title: '성실신고', items: ['세액시뮬레이션'] },
];

const SOLUTION_ROW2 = [
  { title: '자금조달', items: ['증진공', '보증기관', '정책자금'] },
  { title: '벤처기업/\n이노비즈', items: ['창업기업', '세액감면', '정책자금'] },
  { title: '기업부설연구소/\n전담부서', items: ['세액공제', '병역특례', '세액감면'] },
  { title: '산업재산권', items: ['자본구조개선', '이익금 환원', '특허'] },
  { title: 'ISO', items: ['정부과제', '경영효율화'] },
  { title: 'ESG컨설팅', items: ['지속가능경영보고서', '공급망관리'] },
  { title: '기업신용평가', items: ['재무제표분석', '결산전략', '대손전략'] },
];

const SOLUTION_ROW3 = [
  { title: '경리지원\n(아웃소싱)', items: ['통합경영지원시스템', '인력지원'] },
  { title: '외부감사', items: ['감사대응전략', '외감회피', '분할'] },
  { title: '임금 설계', items: ['임직원보상설계', '스톡옵션'] },
  { title: 'KPI', items: ['성과관리지표', '정량·정성분석시스템'] },
  { title: '사내근로\n복지기금', items: ['직원보상관리', '세무관리'] },
  { title: '경정청구', items: ['고용관련세액공제', '지방세', '양도소득세'] },
  { title: '고용지원금', items: ['청년고용지원금', '고용유지지원금', '프리랜서'] },
];

const SOLUTION_ROW4 = [
  { title: 'M&A', items: ['전략수립', '가치극대화', '파이낸싱'] },
  { title: 'IPO', items: ['TIPS', 'VC', 'AC', '기술특례'] },
  { title: '가업승계', items: ['가업상속', '가족법인', '사업무관자산'] },
  { title: '부동산세무', items: ['주택과세', '임대사업자등록세율편'] },
  { title: '부동산개발', items: ['프로젝트리츠', '중소기업통합', 'PFV'] },
  { title: '금융자산관리', items: ['예적금', '채권', '주식', '보험'] },
  { title: '신탁', items: ['사전증여', '차등상속', '경영권승계', '공익신탁'] },
];

// 서비스 카드 데이터
const SERVICE_CARDS = [
  { title: '고객 360° 진단 시스템', subtitle: '전방위적 분석 및 경영진단', video: card1Video },
  { title: '전담 파트너제 운영', subtitle: '상시 관리 즉각 대응', video: card2Video },
  { title: '사전 리스크 진단 & 사후 모니터링 루틴', subtitle: '리스크 점검 후 개선사항 피드백', video: card3Video },
  { title: '실시간 커뮤니케이션', subtitle: '즉각적인 대응이 가능한 시스템', video: card4Video },
  { title: '맞춤형 경영데이터 리포트', subtitle: '업종·규모별로 My Report', video: card5Video },
  { title: '전문가 협업 프로토콜', subtitle: '빈틈없는 통합솔루션 제공', video: card6Video },
];

const TestMotion: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [headerVariant, setHeaderVariant] = React.useState<'white' | 'transparent'>('white');
  const [isMobile, setIsMobile] = React.useState(false);

  // Vision 하이라이트 진행률 (0~100)
  const [highlightProgress, setHighlightProgress] = React.useState(0);

  // 카드 슬라이더 상태
  const [cardIndex, setCardIndex] = React.useState(0);
  const [cardSlideWidth, setCardSlideWidth] = React.useState(695);
  const [expertsCardIndex, setExpertsCardIndex] = React.useState(0);
  const [expertsCardSlideWidth, setExpertsCardSlideWidth] = React.useState(352); // 330px + 22px gap

  // 전문가 데이터 (API에서 가져옴)
  const [expertsCards, setExpertsCards] = React.useState<ExpertCard[]>([]);

  // Solution 02 타임라인 - 보이는 스텝 개수 (0~6)
  const [visibleSteps, setVisibleSteps] = React.useState(0);

  // System 섹션 하이라이트 진행률 (0~100)
  const [systemHighlightProgress, setSystemHighlightProgress] = React.useState(0);
  const systemAnimationPlayedRef = useRef(false);

  // 섹션 Refs
  const heroRef = useRef<HTMLDivElement>(null);
  const financeRef = useRef<HTMLDivElement>(null);
  const yachtRef = useRef<HTMLDivElement>(null);
  const visionTextRef = useRef<HTMLDivElement>(null);
  const growthSectionRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<HTMLDivElement>(null);
  const solution01Ref = useRef<HTMLDivElement>(null);
  const solution02Ref = useRef<HTMLDivElement>(null);
  const systemRef = useRef<HTMLDivElement>(null);
  const systemVideoRef = useRef<HTMLDivElement>(null);
  const teamworkRef = useRef<HTMLDivElement>(null);
  const expertsRef = useRef<HTMLDivElement>(null);
  const champagneRef = useRef<HTMLDivElement>(null);
  const cruiseRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);

  // 반응형 슬라이드 너비 업데이트 및 모바일 감지
  React.useEffect(() => {
    const updateSlideWidth = () => {
      const vw = window.innerWidth;
      setIsMobile(vw <= 768);
      if (vw <= 768) {
        setCardSlideWidth(vw - 40 + 16); // 카드 너비(vw-40px) + gap(16px)
        setExpertsCardSlideWidth(252); // 240px + 12px gap (모바일)
      } else if (vw <= 1024) {
        setCardSlideWidth(432);
        setExpertsCardSlideWidth(352); // 330px + 22px gap
      } else {
        setCardSlideWidth(695);
        setExpertsCardSlideWidth(352); // 330px + 22px gap
      }
    };

    updateSlideWidth();
    window.addEventListener('resize', updateSlideWidth);
    return () => window.removeEventListener('resize', updateSlideWidth);
  }, []);

  // 전문가 데이터 API에서 가져오기
  React.useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members?page=1&limit=20`);
        const data = await response.json();

        if (data.items && Array.isArray(data.items)) {
          const formattedExperts: ExpertCard[] = data.items.map((item: {
            id: number;
            name: string;
            mainPhoto?: { url: string };
            workAreas?: { value: string }[];
            oneLineIntro?: string;
          }) => ({
            id: item.id,
            name: item.name,
            role: item.workAreas && item.workAreas.length > 0 ? item.workAreas[0].value : '전문가',
            quote: item.oneLineIntro || '',
            image: item.mainPhoto?.url || '/images/main/experts/expert1.png',
          }));
          setExpertsCards(formattedExperts);
        }
      } catch (error) {
        console.error('Failed to fetch experts:', error);
      }
    };

    fetchExperts();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section 1: Hero - Pills fade out, CREW expands, then text appears
      if (heroRef.current) {
        const visionRow = heroRef.current.querySelector('.vision-row');
        const growthRow = heroRef.current.querySelector('.growth-row');
        const crewPill = heroRef.current.querySelector('.crew-pill');
        const crewText = heroRef.current.querySelector('.crew-text');
        const crewOverlay = heroRef.current.querySelector('.crew-overlay');
        const expandText1 = heroRef.current.querySelector('.expand-text-1');
        const expandText2 = heroRef.current.querySelector('.expand-text-2');

        // 초기 상태 설정
        gsap.set([expandText1, expandText2], { opacity: 0, y: 30 });
        gsap.set(crewOverlay, { opacity: 0 });

        // 화면 크기
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // crew pill의 현재 위치 계산
        const crewPillRect = (crewPill as HTMLElement).getBoundingClientRect();
        const centerX = viewportWidth / 2 - crewPillRect.left - crewPillRect.width / 2;
        const centerY = viewportHeight / 2 - crewPillRect.top - crewPillRect.height / 2;

        // 텍스트 애니메이션 상태
        let textAnimationPlayed = false;

        gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=350%',
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            snap: {
              snapTo: (progress) => {
                if (progress < 0.08) return 0;     // 아주 조금만 스크롤하면 시작으로
                if (progress < 0.9) return 0.55;   // 조금만 스크롤해도 확장 상태로
                return 1;
              },
              duration: { min: 0.3, max: 0.6 },
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              // 헤더 variant 설정
              const isMobileView = window.innerWidth <= 768;
              if (isMobileView) {
                // 모바일: 첫 페이지는 흰색 배경 → 빨간 로고 + 검정 햄버거
                if (self.progress > 0.1) {
                  setHeaderVariant('transparent');
                } else {
                  setHeaderVariant('white'); // 모바일 첫 페이지: 빨간 로고 + 검정 햄버거
                }
              } else {
                // 데스크탑: 기존 로직
                if (self.progress > 0.35) {
                  setHeaderVariant('transparent');
                } else {
                  setHeaderVariant('white');
                }
              }

              // 텍스트 애니메이션 (55% 이상일 때 - 영상이 꽉 찬 후 바로)
              if (self.progress > 0.55 && !textAnimationPlayed) {
                textAnimationPlayed = true;
                gsap.to(expandText1, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: 'power2.out',
                });
                gsap.to(expandText2, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  delay: 0.15,
                  ease: 'power2.out',
                });
              }
              // 스크롤을 다시 위로 올리면 텍스트 숨기기
              if (self.progress < 0.5 && textAnimationPlayed) {
                textAnimationPlayed = false;
                gsap.to([expandText1, expandText2], {
                  opacity: 0,
                  y: 30,
                  duration: 0.3,
                });
              }
            },
          },
        })
          // Phase 1: Crew pill moves to center (0 - 0.2)
          .to(visionRow, { opacity: 0, y: -50, duration: 0.15 }, 0)
          .to(growthRow, { opacity: 0, y: -50, duration: 0.15 }, 0)
          .to(crewText, { opacity: 0, duration: 0.1 }, 0)
          .to(crewPill, {
            x: centerX,
            y: centerY,
            duration: 0.2,
            ease: 'power2.out',
          }, 0)
          // Phase 2: Crew pill expands (0.2 - 0.5)
          .to(crewPill, {
            width: viewportWidth,
            height: viewportHeight,
            duration: 0.3,
            ease: 'power2.inOut',
          }, 0.2)
          // borderRadius는 더 빠르게 (0.2 - 0.4)
          .to(crewPill, {
            borderRadius: '0px',
            duration: 0.2,
            ease: 'power2.out',
          }, 0.2)
          // Overlay appears after full expansion (0.5 - 0.55)
          .to(crewOverlay, { opacity: 1, duration: 0.05 }, 0.5);
      }

      // Section 2: Finance - 시간 기반 텍스트 등장
      if (financeRef.current) {
        const financeOverlay = financeRef.current.querySelector('.finance-overlay');
        const text1 = financeRef.current.querySelector('.finance-text-1');
        const text2 = financeRef.current.querySelector('.finance-text-2');
        const text3 = financeRef.current.querySelector('.finance-text-3');
        const text4 = financeRef.current.querySelector('.finance-text-4');
        const text5 = financeRef.current.querySelector('.finance-text-5');
        const text6 = financeRef.current.querySelector('.finance-text-6');

        gsap.set([text1, text2, text3], { opacity: 0, y: 30 });
        gsap.set([text4, text5, text6], { opacity: 0, x: 30 });
        gsap.set(financeOverlay, { opacity: 0 });

        let financeTextPlayed = false;

        gsap.timeline({
          scrollTrigger: {
            trigger: financeRef.current,
            start: 'top top',
            end: '+=350%',
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            snap: {
              snapTo: (progress) => {
                if (progress < 0.08) return 0;
                if (progress < 0.9) return 0.55;  // Hero와 동일
                return 1;
              },
              duration: { min: 0.3, max: 0.6 },
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              // 텍스트 애니메이션 (55% 이상일 때) - 부드러운 전환
              if (self.progress > 0.55 && !financeTextPlayed) {
                financeTextPlayed = true;
                // 왼쪽 텍스트
                gsap.to(text1, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                gsap.to(text2, { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: 'power2.out' });
                gsap.to(text3, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });
                // 오른쪽 텍스트
                gsap.to(text4, { opacity: 1, x: 0, duration: 0.8, delay: 0.45, ease: 'power2.out' });
                gsap.to(text5, { opacity: 1, x: 0, duration: 0.8, delay: 0.6, ease: 'power2.out' });
                gsap.to(text6, { opacity: 1, x: 0, duration: 0.8, delay: 0.75, ease: 'power2.out' });
              }
              // 스크롤을 다시 위로 올리면 텍스트 숨기기 (Hero와 동일: 0.5)
              if (self.progress < 0.5 && financeTextPlayed) {
                financeTextPlayed = false;
                gsap.to([text1, text2, text3], { opacity: 0, y: 30, duration: 0.3 });
                gsap.to([text4, text5, text6], { opacity: 0, x: 30, duration: 0.3 });
              }
            },
          },
        })
          // 오버레이 등장 (0.2 - 0.5)
          .to(financeOverlay, { opacity: 1, duration: 0.3 }, 0.2);
      }

      // Section 3: Yacht - 시간 기반 텍스트 등장
      if (yachtRef.current) {
        const yachtOverlay = yachtRef.current.querySelector('.yacht-overlay');
        const yachtText1 = yachtRef.current.querySelector('.yacht-text-1');
        const yachtText2 = yachtRef.current.querySelector('.yacht-text-2');

        gsap.set([yachtText1, yachtText2], { opacity: 0, y: 30 });
        gsap.set(yachtOverlay, { opacity: 0 });

        let yachtTextPlayed = false;

        gsap.timeline({
          scrollTrigger: {
            trigger: yachtRef.current,
            start: 'top top',
            end: '+=350%',
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            snap: {
              snapTo: (progress) => {
                if (progress < 0.08) return 0;
                if (progress < 0.9) return 0.55;  // Hero와 동일
                return 1;
              },
              duration: { min: 0.3, max: 0.6 },
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              // 텍스트 애니메이션 (55% 이상일 때 - Hero와 동일)
              if (self.progress > 0.55 && !yachtTextPlayed) {
                yachtTextPlayed = true;
                gsap.to(yachtText1, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
                gsap.to(yachtText2, { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: 'power2.out' });
              }
              // 스크롤을 다시 위로 올리면 텍스트 숨기기 (Hero와 동일: 0.5)
              if (self.progress < 0.5 && yachtTextPlayed) {
                yachtTextPlayed = false;
                gsap.to([yachtText1, yachtText2], { opacity: 0, y: 30, duration: 0.3 });
              }
            },
          },
        })
          // 오버레이 등장 (0.2 - 0.5)
          .to(yachtOverlay, { opacity: 1, duration: 0.3 }, 0.2);
      }

      // Section 4: Vision Text - 검은 배경에 텍스트 + highlight 효과
      // [모션] 제목 + 본문 동시 등장 → 스크롤에 따라 본문 highlight
      if (visionTextRef.current) {
        const visionTitle = visionTextRef.current.querySelector('.vision-title');
        const visionDescription = visionTextRef.current.querySelector('.vision-description');

        // 초기 상태: 제목과 본문 모두 숨김
        gsap.set(visionTitle, { opacity: 0, y: 30 });
        gsap.set(visionDescription, { opacity: 0, y: 20 });

        let contentPlayed = false;

        gsap.timeline({
          scrollTrigger: {
            trigger: visionTextRef.current,
            start: 'top top',
            end: '+=350%',
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            // snap 제거
            onUpdate: (self) => {
              // 제목 + 본문 동시 등장 (20% 이상)
              if (self.progress > 0.2 && !contentPlayed) {
                contentPlayed = true;
                // 제목 fade-up
                gsap.to(visionTitle, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
                // 본문 fade-up (동시에)
                gsap.to(visionDescription, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
              }

              // 되돌리기 (15% 이하)
              if (self.progress < 0.15 && contentPlayed) {
                contentPlayed = false;
                gsap.to(visionTitle, { opacity: 0, y: 30, duration: 0.3 });
                gsap.to(visionDescription, { opacity: 0, y: 20, duration: 0.3 });
                setHighlightProgress(0);
              }

              // 본문 highlight - 스크롤 기반 (30% ~ 55% 구간)
              if (self.progress >= 0.3 && self.progress <= 0.55) {
                const highlightPercent = ((self.progress - 0.3) / 0.25) * 100;
                setHighlightProgress(Math.min(highlightPercent, 100));
              } else if (self.progress < 0.3) {
                setHighlightProgress(0);
              } else if (self.progress > 0.55) {
                setHighlightProgress(100);
              }
            },
          },
        });
      }

      // Section 5: Growth - 망원경 배경 + VISION 텍스트 → 본문
      // [순서] 1. 배경 → 2. VISION 텍스트 (snap으로 오래 머물기) → 3. 오버레이 + 본문
      if (growthSectionRef.current) {
        const growthVisionText = growthSectionRef.current.querySelector('.growth-vision-text');
        const growthOverlay = growthSectionRef.current.querySelector('.growth-overlay');
        const growthLeftContent = growthSectionRef.current.querySelector('.growth-left-content');
        const growthDescription = growthSectionRef.current.querySelector('.growth-description');
        const cardsContainer = growthSectionRef.current.querySelector('.cards-container');

        gsap.set(growthVisionText, { opacity: 0 });
        gsap.set(growthOverlay, { opacity: 0 });
        gsap.set(growthLeftContent, { opacity: 0, y: 30 });
        gsap.set(growthDescription, { opacity: 0, y: 30 });
        gsap.set(cardsContainer, { opacity: 0, x: 50 });

        let contentPlayed = false;

        gsap.timeline({
          scrollTrigger: {
            trigger: growthSectionRef.current,
            start: 'top top',
            end: '+=400%', // 스크롤 거리 단축
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            // 타임라인:
            // 0%: 망원경 배경만
            // 8%: VISION 텍스트 등장
            // 10%~35%: snap (VISION 오래 머물기)
            // 35%~42%: VISION 페이드아웃 + 오버레이 (매우 빠르게)
            // 45%: 본문 + 카드 등장
            // 50%~90%: 카드 자동 넘기기 (자유 스크롤)
            // 90% 이상: 다음 섹션으로
            snap: {
              snapTo: (progress) => {
                if (progress < 0.06) return 0;        // 시작
                if (progress < 0.40) return 0.20;     // VISION 텍스트 상태에서 오래 머물기
                if (progress >= 0.90) return 1;       // 다음 섹션으로
                // 카드 넘기기 구간에서는 snap 없이 자유 스크롤
                return progress;
              },
              duration: { min: 0.3, max: 0.6 },
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              // 1. VISION 텍스트 점진적 등장 (0% ~ 12%)
              if (self.progress >= 0 && self.progress <= 0.12) {
                const fadeInProgress = self.progress / 0.12;
                gsap.set(growthVisionText, { opacity: fadeInProgress });
              }
              // VISION 텍스트 유지 (12% ~ 35%) - 더 오래 머물기
              else if (self.progress > 0.12 && self.progress <= 0.35) {
                gsap.set(growthVisionText, { opacity: 1 });
              }
              // 2. VISION 텍스트 점진적 페이드아웃 + 오버레이 점진적 등장 (35% ~ 42%)
              else if (self.progress > 0.35 && self.progress <= 0.42) {
                const fadeProgress = (self.progress - 0.35) / 0.07;
                const visionOpacity = Math.max(0, 1 - fadeProgress);
                const overlayOpacity = Math.min(1, fadeProgress);
                gsap.set(growthVisionText, { opacity: visionOpacity });
                gsap.set(growthOverlay, { opacity: overlayOpacity });
              } else if (self.progress > 0.42) {
                gsap.set(growthVisionText, { opacity: 0 });
                gsap.set(growthOverlay, { opacity: 1 });
              }

              // 3. 본문 등장 (45% 이상) - 부드러운 전환
              if (self.progress > 0.45 && !contentPlayed) {
                contentPlayed = true;

                // 좌측 텍스트 fade-up
                gsap.to(growthLeftContent, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: 'power2.out'
                });

                // 카드 컨테이너 fade-in
                gsap.to(cardsContainer, {
                  opacity: 1,
                  x: 0,
                  duration: 0.8,
                  delay: 0.3,
                  ease: 'power2.out'
                });

                // 하단 설명 텍스트 fade-up (카드와 함께)
                gsap.to(growthDescription, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  delay: 0.5,
                  ease: 'power2.out'
                });
              }

              // 본문 되돌리기 (42% 이하)
              if (self.progress < 0.42 && contentPlayed) {
                contentPlayed = false;
                gsap.to(growthLeftContent, { opacity: 0, y: 30, duration: 0.3 });
                gsap.to(growthDescription, { opacity: 0, y: 30, duration: 0.3 });
                gsap.to(cardsContainer, { opacity: 0, x: 50, duration: 0.3 });
              }

              // 카드는 버튼 클릭으로만 넘김 (스크롤 자동 넘기기 제거)
            },
          },
        });
        // 오버레이는 onUpdate에서 직접 제어
      }

      // Section 6: Direction - 나침반 배경 + DIRECTION 텍스트
      // [순서] 1. 배경 → 2. DIRECTION 텍스트 등장 → 3. DIRECTION 오래 머물기
      if (directionRef.current) {
        const directionText = directionRef.current.querySelector('.direction-text');
        const isMobile = window.innerWidth <= 768;

        gsap.set(directionText, { opacity: 0 });

        // 모바일에서는 스크롤 거리를 줄임
        const scrollDistance = isMobile ? '+=150%' : '+=300%';
        const fadeInEnd = isMobile ? 0.08 : 0.12; // 모바일: 더 빠르게 등장
        const snapPoint = isMobile ? 0.15 : 0.20; // 모바일: 더 빠르게 다음 섹션으로

        gsap.timeline({
          scrollTrigger: {
            trigger: directionRef.current,
            start: 'top top',
            end: scrollDistance,
            pin: true,
            pinSpacing: true,
            scrub: 1.5,
            snap: {
              snapTo: (progress) => {
                if (progress < 0.08) return 0;
                if (progress < 0.9) return snapPoint;  // DIRECTION 텍스트 상태에서 머물기
                return 1;
              },
              duration: { min: 0.3, max: 0.6 },
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              // 1. DIRECTION 텍스트 점진적 등장
              if (self.progress >= 0 && self.progress <= fadeInEnd) {
                const fadeInProgress = self.progress / fadeInEnd;
                gsap.set(directionText, { opacity: fadeInProgress });
              }
              // DIRECTION 텍스트 유지
              else if (self.progress > fadeInEnd && self.progress <= 0.90) {
                gsap.set(directionText, { opacity: 1 });
              }
              // 되돌리기
              else if (self.progress < fadeInEnd) {
                gsap.set(directionText, { opacity: 0 });
              }
            },
          },
        });
      }

      // Section 7: Solution 01 - 오버레이 + 텍스트 순차 → 마키 카드
      // [순서] 1. 오버레이 → 2. 텍스트 순차 등장 → 3. 마키 카드 한 줄씩
      if (solution01Ref.current) {
        const solutionOverlay = solution01Ref.current.querySelector('.solution-overlay');
        const solutionContent = solution01Ref.current.querySelector('.solution-content');
        const solutionHeader = solution01Ref.current.querySelector('.solution-header');
        const solutionLabel = solution01Ref.current.querySelector('.solution-label');
        const solutionTitle = solution01Ref.current.querySelector('.solution-title');
        const solutionDescription = solution01Ref.current.querySelector('.solution-description');
        const solutionGridsContainer = solution01Ref.current.querySelector('.solution-grids-container');
        const solutionGrids = solution01Ref.current.querySelectorAll('.solution-grid');
        const isMobile = window.innerWidth <= 768;

        gsap.set(solutionOverlay, { opacity: 0 });
        gsap.set(solutionContent, { opacity: 0 });
        gsap.set([solutionLabel, solutionTitle, solutionDescription], { opacity: 0, y: 30 });
        gsap.set(solutionGrids, { opacity: 0 });
        // 카드 영역 스크롤 위치 초기화
        if (solutionGridsContainer) {
          (solutionGridsContainer as HTMLElement).scrollTop = 0;
        }

        let textContentPlayed = false;

        // 모바일에서는 스크롤 거리를 줄임
        const scrollDistance = isMobile ? '+=400%' : '+=600%'; // 스크롤 거리 증가로 멈추는 시간 연장
        const overlayEnd = isMobile ? 0.06 : 0.10; // 모바일: 더 빠르게 오버레이 등장
        const textStart = isMobile ? 0.10 : 0.15; // 모바일: 더 빠르게 텍스트 등장
        const textPausePoint = isMobile ? 0.28 : 0.32; // 텍스트 완전 표시 후 멈추는 지점 (더 길게)
        const cardStart = isMobile ? 0.30 : 0.35; // 카드 등장 시작 지점도 늦춤

        gsap.timeline({
          scrollTrigger: {
            trigger: solution01Ref.current,
            start: 'top top',
            end: scrollDistance,
            pin: true,
            pinSpacing: true,
            scrub: 1.5,
            snap: {
              snapTo: (progress) => {
                if (progress < 0.04) return 0;
                // 텍스트가 모두 표시된 후 잠시 멈추기 (범위를 넓혀서 더 오래 머물도록)
                if (progress >= textStart && progress < cardStart) {
                  return textPausePoint; // 텍스트 완전 표시 후 멈춤
                }
                if (progress >= 0.90) return 1;
                return progress;
              },
              duration: { min: 0.4, max: 0.8 }, // snap 지속 시간 증가
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              // 1. 오버레이 등장
              if (self.progress >= 0 && self.progress <= overlayEnd) {
                const overlayProgress = self.progress / overlayEnd;
                gsap.set(solutionOverlay, { opacity: overlayProgress });
              } else if (self.progress > overlayEnd) {
                gsap.set(solutionOverlay, { opacity: 1 });
              }

              // 2. 텍스트 순차 등장 - 부드러운 전환
              if (self.progress > textStart && !textContentPlayed) {
                textContentPlayed = true;
                // 카드 영역 스크롤 위치를 맨 위로 초기화
                if (solutionGridsContainer) {
                  (solutionGridsContainer as HTMLElement).scrollTop = 0;
                }
                gsap.to(solutionContent, { opacity: 1, duration: 0.5, ease: 'power2.out' });
                // 라벨 → 제목 → 설명 순차 (시간 기반, 더 부드럽게)
                gsap.to(solutionLabel, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                gsap.to(solutionTitle, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });
                gsap.to(solutionDescription, { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power2.out' });
              }

              // 텍스트 되돌리기
              const textRevertPoint = isMobile ? 0.08 : 0.12;
              if (self.progress < textRevertPoint && textContentPlayed) {
                textContentPlayed = false;
                // 카드 영역 스크롤 위치 초기화
                if (solutionGridsContainer) {
                  (solutionGridsContainer as HTMLElement).scrollTop = 0;
                }
                gsap.to(solutionContent, { opacity: 0, y: 0, duration: 0.3 });
                gsap.to([solutionLabel, solutionTitle, solutionDescription], { opacity: 0, y: 30, duration: 0.3 });
                gsap.to(solutionGrids, { opacity: 0, duration: 0.3 });
              }

              // 3. 마키 카드 한 줄씩 등장 (스크롤 기반)
              // 모바일: 20%, 30%, 40%, 50% / 데스크탑: 25%, 35%, 45%, 55%
              const cardEnd = isMobile ? 0.60 : 0.65;
              if (self.progress >= cardStart && self.progress <= cardEnd) {
                // 각 행 등장 시점
                const row1Visible = self.progress >= cardStart;
                const row2Visible = self.progress >= (cardStart + 0.10);
                const row3Visible = self.progress >= (cardStart + 0.20);
                const row4Visible = self.progress >= (cardStart + 0.30);
                const visibleGrids = [row1Visible, row2Visible, row3Visible, row4Visible].filter(Boolean).length;

                // 헤더 opacity: 2행~3행 사이에서 fade out
                const headerFadeStart = cardStart + 0.10;
                const headerFadeEnd = cardStart + 0.20;
                let headerOpacity = 1;
                if (self.progress >= headerFadeStart && self.progress < headerFadeEnd) {
                  headerOpacity = 1 - ((self.progress - headerFadeStart) / 0.10); // 1 → 0
                } else if (self.progress >= headerFadeEnd) {
                  headerOpacity = 0;
                }

                // 헤더 opacity + height collapse + 위로 이동 모션
                const headerMaxHeight = headerOpacity > 0 ? 300 : 0;
                const headerY = headerOpacity > 0 ? 0 : -50; // 위로 올라가는 모션
                gsap.to(solutionHeader, {
                  opacity: headerOpacity,
                  y: headerY,
                  maxHeight: headerMaxHeight,
                  overflow: 'hidden',
                  duration: 0.6, // 더 부드러운 전환
                  ease: 'power1.out' // 더 부드러운 easing
                });
                // grids는 헤더 collapse에 따라 자연스럽게 위로 올라감 (y 애니메이션 불필요)

                // 4줄째 카드가 나타나면 전체 스크롤 가능
                if (visibleGrids >= 4 && solutionContent) {
                  (solutionContent as HTMLElement).classList.add('full-scroll');
                } else {
                  if (solutionContent) {
                    (solutionContent as HTMLElement).classList.remove('full-scroll');
                  }
                  if (solutionGridsContainer) {
                    (solutionGridsContainer as HTMLElement).scrollTop = 0;
                  }
                }

                // 카드는 fade in만
                solutionGrids.forEach((grid, index) => {
                  if (index < visibleGrids) {
                    gsap.to(grid, { opacity: 1, duration: 0.8, ease: 'power1.out' }); // 더 부드러운 카드 등장
                  } else {
                    gsap.set(grid, { opacity: 0 });
                  }
                });
              } else if (self.progress > cardEnd) {
                // 모든 그리드 표시 + 헤더 collapsed + 위로 이동
                gsap.set(solutionHeader, { opacity: 0, y: -50, maxHeight: 0, overflow: 'hidden' });
                solutionGrids.forEach((grid) => {
                  gsap.set(grid, { opacity: 1 });
                });
              } else if (self.progress < cardStart) {
                // 모든 그리드 숨김 + 헤더 원위치
                gsap.set(solutionHeader, { opacity: 1, y: 0, maxHeight: 300, overflow: 'visible' });
                solutionGrids.forEach((grid) => {
                  gsap.set(grid, { opacity: 0 });
                });
              }

            },
          },
        });
      }

      // Section 8: Solution 02 - 타임라인 그리드
      // [모션] 트리거 시 시간 기반으로 스텝과 헤더가 순차 등장
      if (solution02Ref.current) {
        const solution02Content = solution02Ref.current.querySelector('.solution02-content');
        const solution02Label = solution02Ref.current.querySelector('.solution02-label');
        const solution02Title = solution02Ref.current.querySelector('.solution02-title');
        const solution02Description = solution02Ref.current.querySelector('.solution02-description');
        const timelineContainer = solution02Ref.current.querySelector('.timeline-container');

        gsap.set(solution02Content, { opacity: 0 });
        gsap.set([solution02Label, solution02Title, solution02Description], { opacity: 0, y: 30 });
        gsap.set(timelineContainer, { opacity: 0 });

        let solution02ContentPlayed = false;

        // Solution 02: 자연스러운 스크롤 (pin 없음)
        ScrollTrigger.create({
          trigger: solution02Ref.current,
          start: 'top 80%', // 화면 80% 지점에서 시작
          end: 'bottom 20%',
          onEnter: () => {
            if (!solution02ContentPlayed) {
              solution02ContentPlayed = true;
              gsap.to(solution02Content, { opacity: 1, duration: 0.3, ease: 'power2.out' });
              // 라벨 → 제목 → 설명 순차 등장
              gsap.to(solution02Label, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
              gsap.to(solution02Title, { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: 'power2.out' });
              gsap.to(solution02Description, { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' });
              // 타임라인 컨테이너 등장
              gsap.to(timelineContainer, { opacity: 1, duration: 0.4, delay: 0.45, ease: 'power2.out' });

              // 스텝들 시간 기반 순차 등장
              for (let i = 1; i <= 6; i++) {
                gsap.delayedCall(0.6 + i * 0.4, () => {
                  setVisibleSteps(i);
                });
              }
            }
          },
          onLeaveBack: () => {
            if (solution02ContentPlayed) {
              solution02ContentPlayed = false;
              gsap.to(solution02Content, { opacity: 0, duration: 0.3 });
              gsap.to([solution02Label, solution02Title, solution02Description], { opacity: 0, y: 30, duration: 0.3 });
              gsap.to(timelineContainer, { opacity: 0, duration: 0.3 });
              setVisibleSteps(0);
            }
          },
        });
      }

      // Section 9: System text animation is handled via IntersectionObserver in a separate effect
      if (systemRef.current) {
        const systemText = systemRef.current.querySelector('.system-text') as HTMLElement;
        const systemMainContent = systemRef.current.querySelector('.system-main-content');
        const systemHeadline = systemRef.current.querySelector('.system-headline');
        const systemDescription = systemRef.current.querySelector('.system-description');

        // 대형 텍스트 초기 위치 계산 (화면 바닥에서 시작)
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const isMobile = viewportWidth <= 767;
        const textStartY = viewportHeight; // 화면 바닥에서 시작
        const textStopY = isMobile ? viewportHeight / 2 : 300;

        const systemTextYPercent = isMobile ? 0 : -50;



        // 대형 텍스트 → 라벨 변환을 위한 목표 위치/스케일 계산
        const textRect = systemText?.getBoundingClientRect();
        const textCenterY = viewportHeight / 2;
        const labelTargetY = 0; // 라벨 최종 Y 위치
        const labelTargetScale = isMobile ? 0.25 : 0.09; // 모바일: 더 큰 라벨 (약 25%), 데스크탑: 9%
        const labelYOffset = isMobile ? 0 : textCenterY - 150;
         
        const systemTextXConfig = isMobile ? { xPercent: 0, x: '-50%' } : { xPercent: -50, x: 0 };

        if (isMobile) {
          gsap.set(systemText, { clearProps: 'all' });
        }
        else {
          gsap.set(systemText, { opacity: 0, y: textStartY, scale: 1, ...systemTextXConfig, yPercent: -50 });

        }
        const mobileContentY = 0;
        gsap.set(systemMainContent, { opacity: 0, y: mobileContentY });
        gsap.set([systemHeadline, systemDescription], { opacity: 0, y: -50 }); // 위에서 시작
        // }

        // const mobileContentY = isMobile ? 100 : 0;

        let systemTextPlayed = false;
        let systemContentPlayed = false;

        // 모바일에서는 GSAP 타임라인 스킵 - CSS만으로 레이아웃 처리
        // if (!isMobile) {
        gsap.timeline({
          scrollTrigger: {
            trigger: systemRef.current,
            start: 'top top',
            end: '+=300%', // 텍스트 섹션만을 위한 스크롤 거리 (1.5배 더 길게)
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            snap: {
              snapTo: (progress) => {
                if (progress < 0.05) return 0;        // 시작
                if (progress < 0.15) return 0.08;    // SYSTEM 대형 텍스트 등장 후 머무르기
                if (progress < 0.70) return 0.65;    // 콘텐츠 + highlight 완료 후 오래 머무르기
                return 1;
              },
              duration: { min: 0.3, max: 0.6 },
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              // 1. SYSTEM 대형 텍스트 등장 (3%~8% 스크롤 연동) - 화면 바닥에서 멈춤 위치로
              if (self.progress >= 0.03 && self.progress <= 0.08) {
                const appearProgress = (self.progress - 0.03) / 0.05;
                const currentY = textStartY + (textStopY - textStartY) * appearProgress;
                gsap.set(systemText, {
                  opacity: appearProgress,
                  y: currentY,
                  scale: 1,
                  ...systemTextXConfig,
                  yPercent: systemTextYPercent
                });
              } else if (self.progress > 0.08 && self.progress < 0.12) {
                // 멈춤 위치에서 머무르기
                gsap.set(systemText, { opacity: 1, y: textStopY, scale: 1, ...systemTextXConfig, yPercent: -50 });
              }

              // 되돌리기 (3% 이하)
              if (self.progress < 0.03) {
                gsap.set(systemText, { opacity: 0, y: textStartY, scale: 1, ...systemTextXConfig, yPercent: -50 });
              }

              // 2. SYSTEM 텍스트 상단으로 이동 + 축소 (12%~39% 스크롤 연동) - 속도 느리게 (1.5배 더 길게)
              if (self.progress >= 0.12 && self.progress <= 0.39) {
                const moveProgress = (self.progress - 0.12) / 0.27;
                // 대형 텍스트: 멈춤 위치(textStopY) → 상단(y: -textCenterY + labelTargetY)으로 이동 + scale 축소
                const targetY = -textCenterY + labelTargetY + labelYOffset; // 상단으로 이동
                const currentY = textStopY + (targetY - textStopY) * moveProgress;
                const currentScale = 1 - (1 - labelTargetScale) * moveProgress;
                gsap.set(systemText, {
                  opacity: 1,
                  y: currentY,
                  scale: currentScale,
                  ...systemTextXConfig,
                  yPercent: -50
                });
              } else if (self.progress > 0.39 && self.progress < 0.50) {
                // 최종 라벨 상태 유지 (50% 전까지)
                const targetY = -textCenterY + labelTargetY + labelYOffset;
                gsap.set(systemText, { opacity: 1, y: targetY, scale: labelTargetScale, ...systemTextXConfig, yPercent: -50 });
              }

              // 3. 헤드라인 + 설명 등장 (40% 이상) - SYSTEM 텍스트가 완전히 자리잡은 후
              if (self.progress > 0.40 && !systemContentPlayed) {
                systemContentPlayed = true;
                gsap.to(systemMainContent, { opacity: 1, y: mobileContentY, duration: 0.5, ease: 'power2.out' });
                gsap.to(systemHeadline, { opacity: 1, y: 300, duration: 0.8, ease: 'power2.out' });
                gsap.to(systemDescription, { opacity: 1, y: 300, duration: 0.8, delay: 0.3, ease: 'power2.out' });
              }

              // 콘텐츠 되돌리기 (35% 이하) - 등장 시점보다 충분히 낮게 설정하여 자리를 잡기 전에 사라지지 않도록
              if (self.progress < 0.35 && systemContentPlayed) {
                systemContentPlayed = false;
                gsap.to(systemMainContent, { opacity: 0, y: mobileContentY, duration: 0.3 });
                gsap.to([systemHeadline, systemDescription], { opacity: 0, y: -50, duration: 0.3 }); // 위로 되돌리기
                setSystemHighlightProgress(0);
              }

              // 텍스트가 등장한 후에는 자리를 잡을 때까지 유지 (40% 이상에서 계속 표시)
              if (self.progress >= 0.40 && self.progress < 0.70) {
                // 모든 텍스트가 화면에 표시된 상태 유지
                if (systemContentPlayed) {
                  gsap.set(systemMainContent, { opacity: 1, y: mobileContentY });
                  gsap.set(systemHeadline, { opacity: 1, y: 300 });
                  gsap.set(systemDescription, { opacity: 1, y: 300 });
                }
              }

              // 4. 설명 텍스트 highlight (42% ~ 48% 구간) + 이후 쉬는 시간 (48%~70%)
              if (self.progress >= 0.42 && self.progress <= 0.48) {
                const highlightPercent = ((self.progress - 0.42) / 0.06) * 100;
                setSystemHighlightProgress(Math.min(highlightPercent, 100));
              } else if (self.progress < 0.42) {
                setSystemHighlightProgress(0);
              } else if (self.progress > 0.48 && self.progress < 0.70) {
                // highlight 완료 후 오래 머무르기 (48%~70%)
                setSystemHighlightProgress(100);
                // 모든 텍스트가 화면에 남아있는 상태 유지
                const targetY = -textCenterY + labelTargetY + labelYOffset;
                gsap.set(systemText, { opacity: 1, y: targetY, scale: labelTargetScale, ...systemTextXConfig, yPercent: -50 });
                gsap.set(systemMainContent, { opacity: 1 });
              } else if (self.progress >= 0.70) {
                setSystemHighlightProgress(100);
              }

              // 5. SYSTEM 라벨 + 헤드라인 + 설명 페이드아웃 (70%~75%)
              if (self.progress >= 0.70 && self.progress <= 0.75) {
                const fadeProgress = (self.progress - 0.70) / 0.05;
                const targetY = -textCenterY + labelTargetY + labelYOffset;
                gsap.set(systemText, { opacity: 1 - fadeProgress, y: targetY, scale: labelTargetScale, ...systemTextXConfig, yPercent: -50 });
                gsap.set(systemMainContent, { opacity: 1 - fadeProgress });
              } else if (self.progress > 0.75) {
                gsap.set(systemText, { opacity: 0, ...systemTextXConfig, yPercent: -50 });
                gsap.set(systemMainContent, { opacity: 0 });
              }
            },
          },
        });
        // } // end if (!isMobile)
      }
      // Section 10: System Video - 비디오 등장/확장/이동 + 카드 표시
      // [모션 순서]
      // 1단계: 비디오 화면 중앙에 큰 상태로 등장 (화면의 50% 크기, border-radius: 28.5px)
      // 2단계: 비디오 화면 꽉 채움 (풀스크린)
      // 3단계: 비디오 좌측으로 이동 + 좌우 축소
      // 4단계: 카드 등장
      if (systemVideoRef.current) {
        const systemVideoContainer = systemVideoRef.current.querySelector('.system-video-container') as HTMLElement;
        const systemVideoWrapper = systemVideoRef.current.querySelector('.system-video-wrapper') as HTMLElement;
        const systemCards = systemVideoRef.current.querySelector('.system-cards') as HTMLElement;

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const isMobile = viewportWidth <= 767;

        // 비디오 애니메이션 계산
        // 시작 크기: 작은 상태 (화면의 50%)
        const startVideoWidth = viewportWidth * 0.5;
        const startVideoHeight = viewportHeight * 0.5;
        const startBorderRadius = 24; // 항상 24px 유지
        // 중간 크기: 화면 꽉 채움 (높이는 상하 80px 여백)
        const fullVideoWidth = viewportWidth;
        const fullVideoHeight = viewportHeight - 160; // 상하 80px 여백
        const fullBorderRadius = 24; // 항상 24px 유지
        // 최종 비디오 크기 (좌측 배치, 카드와 64px 간격)
        const finalVideoWidth = viewportWidth * 0.65 - 96;
        const finalVideoHeight = fullVideoHeight; // 높이는 동일하게 유지
        const finalBorderRadius = 24; // 항상 24px 유지
        // 최종 위치 (좌측 64px)
        const finalVideoLeft = 64;

        // 비디오 이동을 위한 계산
        const finalVideoX = finalVideoLeft + finalVideoWidth / 2 - viewportWidth / 2;

        // 초기 상태 설정
        if (isMobile) {
          gsap.set(systemVideoContainer, {
            clearProps: 'all',
            width: '100vw',
            height: 'auto',
            borderRadius: 0,
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
            opacity: 1,
            marginBottom: 100
          });
          gsap.set(systemCards, { clearProps: 'all', opacity: 1 });
        } else {
          gsap.set(systemVideoContainer, {
            opacity: 0,
            width: startVideoWidth,
            height: startVideoHeight,
            borderRadius: startBorderRadius,
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: 0
          });
          // wrapper도 container와 동일한 크기로 설정
          if (systemVideoWrapper) {
            gsap.set(systemVideoWrapper, {
              width: startVideoWidth,
              height: startVideoHeight,
              borderRadius: startBorderRadius
            });
          }
          gsap.set(systemCards, { opacity: 0 });
        }

        // 카드 스크롤 위치 초기화
        if (systemCards) {
          systemCards.scrollTop = 0;
        }

        let systemVideoPlayed = false;
        let systemCardsPlayed = false;

        // 모바일에서는 GSAP 타임라인 스킵 - CSS만으로 레이아웃 처리
        if (!isMobile) {
          gsap.timeline({
            scrollTrigger: {
              trigger: systemVideoRef.current,
              start: 'top top',
              end: '+=400%', // 비디오 섹션을 위한 스크롤 거리
              pin: true,
              pinSpacing: true,
              scrub: 0.5,
              snap: {
                snapTo: (progress) => {
                  if (progress < 0.1) return 0;        // 시작
                  if (progress < 0.3) return 0.25;    // 비디오 등장 후 머무르기
                  if (progress < 0.5) return 0.4;     // 비디오 풀스크린 상태에서 머무르기
                  if (progress < 0.7) return 0.6;     // 비디오 좌측 이동 완료
                  if (progress < 0.9) return 0.85;    // 비디오/카드 완료 상태
                  return 1;
                },
                duration: { min: 0.3, max: 0.6 },
                ease: 'power2.out',
                inertia: false,
              },
              onUpdate: (self) => {
                // 1. 비디오 등장 (0%~10%) - opacity 0→1
                if (self.progress >= 0 && self.progress <= 0.10) {
                  const appearProgress = self.progress / 0.10;
                  gsap.set(systemVideoContainer, {
                    opacity: appearProgress,
                    width: startVideoWidth,
                    height: startVideoHeight,
                    borderRadius: startBorderRadius,
                    xPercent: -50,
                    yPercent: -50,
                    x: 0,
                    y: 0
                  });
                  if (systemVideoWrapper) {
                    gsap.set(systemVideoWrapper, {
                      width: startVideoWidth,
                      height: startVideoHeight,
                      borderRadius: startBorderRadius
                    });
                  }
                }

                // 2. 비디오 화면 꽉 채움 (10%~30%) - 작은 상태 → 풀스크린
                if (self.progress >= 0.10 && self.progress <= 0.30) {
                  const expandProgress = (self.progress - 0.10) / 0.20;
                  const currentWidth = startVideoWidth + (fullVideoWidth - startVideoWidth) * expandProgress;
                  const currentHeight = startVideoHeight + (fullVideoHeight - startVideoHeight) * expandProgress;
                  const currentBorderRadius = 24; // 항상 24px 유지
                  gsap.set(systemVideoContainer, {
                    opacity: 1,
                    width: currentWidth,
                    height: currentHeight,
                    borderRadius: currentBorderRadius,
                    xPercent: -50,
                    yPercent: -50,
                    x: 0,
                    y: 0
                  });
                  if (systemVideoWrapper) {
                    gsap.set(systemVideoWrapper, {
                      width: currentWidth,
                      height: currentHeight,
                      borderRadius: currentBorderRadius
                    });
                  }
                }

                // 3. 비디오 좌측으로 이동 + 좌우 크롭 (30%~60%) - 비디오 크기 유지, 컨테이너와 wrapper만 줄어서 크롭
                if (self.progress >= 0.30 && self.progress <= 0.60) {
                  const cropProgress = (self.progress - 0.30) / 0.30;
                  // 컨테이너와 wrapper 너비만 줄임 (비디오는 풀사이즈 유지, overflow:hidden으로 크롭)
                  const currentContainerWidth = fullVideoWidth - (fullVideoWidth - finalVideoWidth) * cropProgress;
                  const currentBorderRadius = 24; // 항상 24px 유지
                  const currentX = finalVideoX * cropProgress;

                  gsap.set(systemVideoContainer, {
                    opacity: 1,
                    width: currentContainerWidth,
                    height: fullVideoHeight, // 높이는 풀스크린 유지
                    borderRadius: currentBorderRadius,
                    xPercent: -50,
                    yPercent: -50,
                    x: currentX,
                    y: 0
                  });
                  if (systemVideoWrapper) {
                    gsap.set(systemVideoWrapper, {
                      width: currentContainerWidth,
                      height: fullVideoHeight,
                      borderRadius: currentBorderRadius
                    });
                  }
                } else if (self.progress > 0.60) {
                  // 최종 상태 유지 (좌우 크롭 완료, 좌측 배치)
                  gsap.set(systemVideoContainer, {
                    opacity: 1,
                    width: finalVideoWidth,
                    height: fullVideoHeight, // 높이는 풀스크린 유지
                    borderRadius: finalBorderRadius,
                    xPercent: -50,
                    yPercent: -50,
                    x: finalVideoX,
                    y: 0
                  });
                  if (systemVideoWrapper) {
                    gsap.set(systemVideoWrapper, {
                      width: finalVideoWidth,
                      height: fullVideoHeight,
                      borderRadius: finalBorderRadius
                    });
                  }
                }

                // 비디오 되돌리기 (0% 이하)
                if (self.progress < 0) {
                  gsap.set(systemVideoContainer, {
                    opacity: 0,
                    width: startVideoWidth,
                    height: startVideoHeight,
                    borderRadius: startBorderRadius,
                    xPercent: -50,
                    yPercent: -50,
                    x: 0,
                    y: 0
                  });
                  if (systemVideoWrapper) {
                    gsap.set(systemVideoWrapper, {
                      width: startVideoWidth,
                      height: startVideoHeight,
                      borderRadius: startBorderRadius
                    });
                  }
                }

                // 4. 카드 등장 (60% 이상) - 시간 기반
                if (self.progress > 0.60 && !systemCardsPlayed) {
                  systemCardsPlayed = true;
                  // 카드 스크롤 위치 초기화 (맨 위에서 시작)
                  if (systemCards) {
                    systemCards.scrollTop = 0;
                  }
                  gsap.to(systemCards, { opacity: 1, duration: 0.5, ease: 'power2.out' });
                }

                // 카드 되돌리기 (58% 이하)
                if (self.progress < 0.58 && systemCardsPlayed) {
                  systemCardsPlayed = false;
                  gsap.to(systemCards, { opacity: 0, duration: 0.3 });
                }
              }
            }
          });
        }
      }

      // Section 11: Teamwork - 헤드라인 → 배경 이미지 → TEAMWORK 텍스트
      // [모션 순서]
      // 1단계: 헤드라인 등장 (검은 배경)
      // 2단계: 헤드라인 페이드아웃 + 배경 이미지 페이드인
      // 3단계: TEAMWORK 대형 텍스트 등장
      if (teamworkRef.current) {
        const teamworkBackground = teamworkRef.current.querySelector('.teamwork-background') as HTMLElement;
        const teamworkHeadline = teamworkRef.current.querySelector('.teamwork-headline') as HTMLElement;
        const teamworkText = teamworkRef.current.querySelector('.teamwork-text') as HTMLElement;

        // 헤드라인 시작 위치 (화면 바닥)
        const viewportHeight = window.innerHeight;
        const headlineStartY = viewportHeight * 0.5; // 화면 중앙 아래에서 시작

        // 초기 상태 설정
        gsap.set(teamworkBackground, { opacity: 0 });
        gsap.set(teamworkHeadline, { opacity: 0, y: headlineStartY, xPercent: -50, yPercent: -50 });
        gsap.set(teamworkText, { opacity: 0 });

        gsap.timeline({
          scrollTrigger: {
            trigger: teamworkRef.current,
            start: 'top top',
            end: '+=400%',
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            snap: {
              snapTo: (progress) => {
                if (progress < 0.08) return 0;
                if (progress < 0.30) return 0.18;  // 헤드라인 머무르기
                if (progress < 0.9) return 0.65;   // TEAMWORK 텍스트 머무르기
                return 1;
              },
              duration: { min: 0.3, max: 0.6 },
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              // 1. 헤드라인 아래에서 올라오면서 fade-in (3% ~ 15%)
              if (self.progress >= 0.03 && self.progress <= 0.15) {
                const headlineProgress = (self.progress - 0.03) / 0.12;
                const currentY = headlineStartY * (1 - headlineProgress);
                gsap.set(teamworkHeadline, {
                  opacity: headlineProgress,
                  y: currentY,
                  xPercent: -50,
                  yPercent: -50
                });
              } else if (self.progress > 0.15 && self.progress < 0.30) {
                gsap.set(teamworkHeadline, { opacity: 1, y: 0, xPercent: -50, yPercent: -50 });
              } else if (self.progress < 0.03) {
                gsap.set(teamworkHeadline, { opacity: 0, y: headlineStartY, xPercent: -50, yPercent: -50 });
              }

              // 2. 헤드라인 페이드아웃 + 배경 페이드인 (30% ~ 45%)
              if (self.progress >= 0.30 && self.progress <= 0.45) {
                const transitionProgress = (self.progress - 0.30) / 0.15;
                gsap.set(teamworkHeadline, { opacity: 1 - transitionProgress, y: 0, xPercent: -50, yPercent: -50 });
                gsap.set(teamworkBackground, { opacity: transitionProgress });
              } else if (self.progress > 0.45) {
                gsap.set(teamworkHeadline, { opacity: 0, xPercent: -50, yPercent: -50 });
                gsap.set(teamworkBackground, { opacity: 1 });
              } else if (self.progress < 0.30) {
                gsap.set(teamworkBackground, { opacity: 0 });
              }

              // 3. TEAMWORK 텍스트 등장 (55% ~ 65%)
              if (self.progress >= 0.55 && self.progress <= 0.65) {
                const textProgress = (self.progress - 0.55) / 0.10;
                gsap.set(teamworkText, { opacity: textProgress });
              } else if (self.progress > 0.65) {
                gsap.set(teamworkText, { opacity: 1 });
              } else if (self.progress < 0.55) {
                gsap.set(teamworkText, { opacity: 0 });
              }
            },
          },
        });
      }

      // Section 12: Experts - 헤드라인 + 설명 + 슬라이더
      // [모션 순서]
      // 1단계: 헤드라인 등장
      // 2단계: 설명 등장
      // 3단계: 네비게이션 + 카드 등장
      if (expertsRef.current) {
        const expertsHeadline = expertsRef.current.querySelector('.experts-headline') as HTMLElement;
        const expertsDesc = expertsRef.current.querySelector('.experts-desc') as HTMLElement;
        const expertsNav = expertsRef.current.querySelector('.experts-nav') as HTMLElement;
        const expertsCards = expertsRef.current.querySelector('.experts-cards') as HTMLElement;

        // 초기 상태 설정
        gsap.set(expertsHeadline, { opacity: 0, y: 30 });
        gsap.set(expertsDesc, { opacity: 0, y: 30 });
        gsap.set(expertsNav, { opacity: 0 });
        gsap.set(expertsCards, { opacity: 0, y: 30 });

        let expertsContentPlayed = false;

        // 자연스러운 스크롤 (pin 없음)
        ScrollTrigger.create({
          trigger: expertsRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          onEnter: () => {
            if (!expertsContentPlayed) {
              expertsContentPlayed = true;
              // 헤드라인 fade-up
              gsap.to(expertsHeadline, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
              // 설명 fade-up (딜레이)
              gsap.to(expertsDesc, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });
              // 네비게이션 fade-in
              gsap.to(expertsNav, { opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' });
              // 카드 fade-up
              gsap.to(expertsCards, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
            }
          },
          onLeaveBack: () => {
            if (expertsContentPlayed) {
              expertsContentPlayed = false;
              gsap.to(expertsHeadline, { opacity: 0, y: 30, duration: 0.3 });
              gsap.to(expertsDesc, { opacity: 0, y: 30, duration: 0.3 });
              gsap.to(expertsNav, { opacity: 0, duration: 0.3 });
              gsap.to(expertsCards, { opacity: 0, y: 30, duration: 0.3 });
            }
          },
        });
      }

      // Section 13: Champagne - 비디오 배경 + 텍스트
      // [모션 순서] 텍스트 fade-up 등장
      if (champagneRef.current) {
        const champagneContent = champagneRef.current.querySelector('.champagne-content') as HTMLElement;

        // 초기 상태 설정
        gsap.set(champagneContent, { opacity: 0, y: 30 });

        let champagneContentPlayed = false;

        // 자연스러운 스크롤 (pin 없음)
        ScrollTrigger.create({
          trigger: champagneRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          onEnter: () => {
            if (!champagneContentPlayed) {
              champagneContentPlayed = true;
              gsap.to(champagneContent, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
            }
          },
          onLeaveBack: () => {
            if (champagneContentPlayed) {
              champagneContentPlayed = false;
              gsap.to(champagneContent, { opacity: 0, y: 30, duration: 0.3 });
            }
          },
        });
      }

      // Section 14: Cruise - 배경 이미지 + 좌/우 텍스트
      // [모션 순서] 좌측 텍스트 → 우측 텍스트 순차 등장
      if (cruiseRef.current) {
        const cruiseLeftText = cruiseRef.current.querySelector('.cruise-left-text') as HTMLElement;
        const cruiseRightText = cruiseRef.current.querySelector('.cruise-right-text') as HTMLElement;

        // 초기 상태 설정
        gsap.set(cruiseLeftText, { opacity: 0, y: 30 });
        gsap.set(cruiseRightText, { opacity: 0, y: 30 });

        let cruiseContentPlayed = false;

        // 자연스러운 스크롤 (pin 없음)
        ScrollTrigger.create({
          trigger: cruiseRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          onEnter: () => {
            if (!cruiseContentPlayed) {
              cruiseContentPlayed = true;
              // 좌측 텍스트 먼저 등장
              gsap.to(cruiseLeftText, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
              // 우측 텍스트 딜레이 후 등장
              gsap.to(cruiseRightText, { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' });
            }
          },
          onLeaveBack: () => {
            if (cruiseContentPlayed) {
              cruiseContentPlayed = false;
              gsap.to(cruiseLeftText, { opacity: 0, y: 30, duration: 0.3 });
              gsap.to(cruiseRightText, { opacity: 0, y: 30, duration: 0.3 });
            }
          },
        });
      }

      // Section 15: Final - 마지막 CTA 섹션
      // 스크롤 시 거의 바로 나타나도록 수정
      if (finalRef.current) {
        const finalTitle = finalRef.current.querySelector('.final-title') as HTMLElement;
        const finalSubtitle = finalRef.current.querySelector('.final-subtitle') as HTMLElement;
        const finalCta = finalRef.current.querySelector('.final-cta') as HTMLElement;

        // 초기 상태 설정
        gsap.set(finalTitle, { opacity: 0, y: 30 });
        gsap.set(finalSubtitle, { opacity: 0, y: 30 });
        gsap.set(finalCta, { opacity: 0, y: 30 });

        let finalContentPlayed = false;

        // 자연스러운 스크롤 (pin 없음) - 화면에 보이면 바로 나타남
        ScrollTrigger.create({
          trigger: finalRef.current,
          start: 'top 90%', // 화면 90% 지점에서 시작 (거의 바로 보임)
          end: 'bottom 20%',
          onEnter: () => {
            if (!finalContentPlayed) {
              finalContentPlayed = true;
              // 거의 동시에 빠르게 등장
              gsap.to(finalTitle, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
              gsap.to(finalSubtitle, { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'power2.out' });
              gsap.to(finalCta, { opacity: 1, y: 0, duration: 0.4, delay: 0.2, ease: 'power2.out' });
            }
          },
          onLeaveBack: () => {
            if (finalContentPlayed) {
              finalContentPlayed = false;
              gsap.to(finalTitle, { opacity: 0, y: 30, duration: 0.3 });
              gsap.to(finalSubtitle, { opacity: 0, y: 30, duration: 0.3 });
              gsap.to(finalCta, { opacity: 0, y: 30, duration: 0.3 });
            }
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);


  return (
    <div className="test-motion-container">
      <Header
        variant={headerVariant}
        onMenuClick={() => setIsMenuOpen(true)}
        isFixed={true}
      />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Section 1: Hero - VISION / GROWTH / CREW (expands with text) */}
      <section ref={heroRef} className="motion-section section-hero-initial">
        <div className="hero-pills-wrapper">
          <div className="pill-row vision-row">
            <div className="video-pill">
              <video autoPlay muted loop playsInline>
                <source src={visionVideo} type="video/mp4" />
              </video>
            </div>
            <span className="pill-text">VISION</span>
          </div>

          <div className="pill-row growth-row">
            <span className="pill-text">GROWTH</span>
            <div className="video-pill">
              <video autoPlay muted loop playsInline>
                <source src={growthVideo} type="video/mp4" />
              </video>
            </div>
          </div>

          <div className="pill-row crew-row">
            <div className="video-pill crew-pill">
              <video autoPlay muted loop playsInline>
                <source src={crewVideo} type="video/mp4" />
              </video>
            </div>
            <span className="pill-text crew-text">CREW</span>
          </div>
        </div>

        {/* Overlay and text that appear after expansion */}
        <div className="crew-overlay" />
        <div className="crew-content">
          <h1 className="expand-text-1">모두 컨설팅과 함께라면,</h1>
          <h2 className="expand-text-2">세무사의 항해는<br className="mobile-br" />1등의 여정이 됩니다.</h2>
        </div>
      </section>

      {/* Section 2: Finance */}
      <section ref={financeRef} className="motion-section section-finance">
        <video autoPlay muted loop playsInline className="finance-video">
          <source src={financeVideo} type="video/mp4" />
        </video>
        <div className="finance-overlay" />
        <div className="finance-content">
          <div className="finance-left">
            <h2 className="finance-text-1">복잡한 재무의 바다,</h2>
            <h2 className="finance-text-2">혼자라면</h2>
            <h2 className="finance-text-3">길을 잃기 쉽습니다.</h2>
          </div>
          <div className="finance-right">
            <p className="finance-text-4">하지만 함께라면,<br />그 길은 곧<br /><strong>수익의 항로</strong>로 이어집니다.</p>
            <p className="finance-text-5">보험·펀드·신탁·법인자산관리까지<br />세무사의 전문성을 확장시키는<br />종합 재무설계 트레이닝 플랫폼.<br />배움이 생산성을 만들고,<br />생산성이 곧 자연스러운 수익으로 이어집니다.</p>
            <p className="finance-text-6">당신의 첫 항해,<br />지금 함께 시작하세요.</p>
          </div>
        </div>
      </section>

      {/* Section 3: Yacht */}
      <section ref={yachtRef} className="motion-section section-yacht">
        <video autoPlay muted loop playsInline className="yacht-video">
          <source src={yachtVideo} type="video/mp4" />
        </video>
        <div className="yacht-overlay" />
        <div className="yacht-content">
          <h2 className="yacht-text-1">최고가 되는 공식,</h2>
          <h2 className="yacht-text-2">우리는 그 답을 알고 있습니다</h2>
        </div>
      </section>

      {/* Section 4: Vision Text - 검은 배경 텍스트 + highlight */}
      <section ref={visionTextRef} className="motion-section section-vision-text">
        <div className="vision-text-content">
          <h2 className="vision-title">
            우리는 단순히 <br className="mobile-br" />
            <span className="nowrap">멀리 보는 것이 아니라,</span><br />
            <span className="mobile-spacer" />
            정확히 &apos;어디로 <br className="mobile-br" />
            <span className="nowrap">향해야 하는지&apos; 를 봅니다</span>
          </h2>
          <div className="vision-description">
            {(() => {
              const lines = [
                "모두컨설팅의 비전은 세무사의 경쟁력을 현재의 지식이 아닌",
                "'미래의 설계 능력'으로 확장하는 것입니다."
              ];
              const text = lines.join('');
              const totalChars = text.length;
              const highlightedChars = Math.floor((highlightProgress / 100) * totalChars);

              let charIndex = 0;
              return lines.map((line, lineIndex) => (
                <span key={lineIndex} className="nowrap">
                  {line.split('').map((char) => {
                    const currentIndex = charIndex++;
                    return (
                      <span
                        key={currentIndex}
                        className={`highlight-char ${currentIndex < highlightedChars ? 'active' : ''}`}
                      >
                        {char}
                      </span>
                    );
                  })}
                  {lineIndex < lines.length - 1 && <br />}
                </span>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Section 5: Growth - 망원경 배경 + VISION 텍스트 → 본문 */}
      <section ref={growthSectionRef} className="motion-section section-growth">
        <div className="growth-background">
          <img src={binocularsImg} alt="Binoculars looking at the sea" />
        </div>
        <h2 className="growth-vision-text">VISION</h2>
        <div className="growth-overlay" />
        <div className="growth-content">
          <div className="growth-left-content">
            <div className="growth-main-title">
              <p>Thinking like</p>
              <p>your company.</p>
              <p>Acting as your partner.</p>
            </div>
          </div>
          <div className="growth-description">
            <p>고객의 성장은 우리의 성장입니다.</p>
            <p>고객의 어려움 앞에서 한발 더 다가가고,</p>
            <p>해결의 순간까지 함께 머무는 것 —</p>
            <p>그것이 우리가 &apos;내 회사처럼&apos; 일한다는 뜻입니다.</p>
          </div>
          <div className="cards-container">
            <div className="cards-navigation">
              <button
                className="nav-button"
                disabled={cardIndex === 0}
                onClick={() => setCardIndex(Math.max(0, cardIndex - 1))}
              >
                <img src={cardIndex === 0 ? btnLeftInactive : btnLeftActive} alt="Previous" />
              </button>
              <button
                className="nav-button"
                disabled={cardIndex >= SERVICE_CARDS.length - 1}
                onClick={() => setCardIndex(Math.min(SERVICE_CARDS.length - 1, cardIndex + 1))}
              >
                <img src={cardIndex >= SERVICE_CARDS.length - 1 ? btnRightInactive : btnRightActive} alt="Next" />
              </button>
            </div>
            <div
              className="cards-wrapper"
              style={{
                transform: isMobile
                  ? cardIndex === 0
                    ? `translateX(0)`
                    : `translateX(calc(${cardIndex} * (-100vw + 20px)))`
                  : `translateX(-${cardIndex * cardSlideWidth}px)`
              }}
            >
              {SERVICE_CARDS.map((card, index) => (
                <div className="service-card" key={index}>
                  <div className="card-header">
                    <h3 className="card-title">{card.title}</h3>
                    <ul className="card-subtitle">
                      <li>{card.subtitle}</li>
                    </ul>
                  </div>
                  <div className="card-image">
                    <video autoPlay muted loop playsInline>
                      <source src={card.video} type="video/mp4" />
                    </video>
                  </div>
                </div>
              ))}
            </div>
            <div className="cards-progress">
              <div className="cards-progress-bar" style={{ width: `${((cardIndex + 1) / SERVICE_CARDS.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Direction - 나침반 배경 + DIRECTION 텍스트 */}
      <section ref={directionRef} className="motion-section section-direction">
        <div className="direction-background">
          <img src={compassImg} alt="Compass" />
        </div>
        <h2 className="direction-text">DIRECTION</h2>
      </section>

      {/* Section 7: Solution 01 - 오버레이 + 텍스트 순차 → 마키 카드 */}
      <section ref={solution01Ref} className="motion-section section-solution01">
        <div className="solution-overlay" />
        <div className="solution-content">
          <div className="solution-header">
            <span className="solution-label">Solution 01</span>
            <h2 className="solution-title">End-to-End <br className="mobile-br" />Strategic Solution</h2>
            <p className="solution-description">
              세무사의 전문성을 기반으로,<br className="mobile-br" /> 보험·펀드·신탁·법인 재무까지 아우르는<br />
              통합형 실무 트레이닝 시스템을 제공합니다.<br />
              세무사의 판단력과 실행력을 동시에 강화합니다.
            </p>
          </div>
          <div className="solution-grids-container">
            <div className="solution-grid solution-grid-left">
              <div className="solution-marquee-wrapper">
                {[...SOLUTION_ROW1, ...SOLUTION_ROW1].map((card, index) => (
                  <div className="solution-card" key={index}>
                    <span className="solution-card-title" style={{ whiteSpace: 'pre-line' }}>{card.title}</span>
                    <div className="solution-card-divider" />
                    <ul className="solution-card-items">
                      {card.items.map((item, i) => (<li key={i}>{item}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="solution-grid solution-grid-right">
              <div className="solution-marquee-wrapper">
                {[...SOLUTION_ROW2, ...SOLUTION_ROW2].map((card, index) => (
                  <div className="solution-card" key={index}>
                    <span className="solution-card-title" style={{ whiteSpace: 'pre-line' }}>{card.title}</span>
                    <div className="solution-card-divider" />
                    <ul className="solution-card-items">
                      {card.items.map((item, i) => (<li key={i}>{item}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="solution-grid solution-grid-left">
              <div className="solution-marquee-wrapper">
                {[...SOLUTION_ROW3, ...SOLUTION_ROW3].map((card, index) => (
                  <div className="solution-card" key={index}>
                    <span className="solution-card-title" style={{ whiteSpace: 'pre-line' }}>{card.title}</span>
                    <div className="solution-card-divider" />
                    <ul className="solution-card-items">
                      {card.items.map((item, i) => (<li key={i}>{item}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="solution-grid solution-grid-right">
              <div className="solution-marquee-wrapper">
                {[...SOLUTION_ROW4, ...SOLUTION_ROW4].map((card, index) => (
                  <div className="solution-card" key={index}>
                    <span className="solution-card-title" style={{ whiteSpace: 'pre-line' }}>{card.title}</span>
                    <div className="solution-card-divider" />
                    <ul className="solution-card-items">
                      {card.items.map((item, i) => (<li key={i}>{item}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Solution 02 - 타임라인 그리드 */}
      <section ref={solution02Ref} className="motion-section section-solution02">
        <div className="solution02-background" />
        <div className="solution02-content">
          <span className="solution02-label">Solution 02</span>
          <h2 className="solution02-title">Integrated Strategic Solution</h2>
          <p className="solution02-description">
            고객의 여정을 처음부터 끝까지 함께하며, 완전한 수익 창출 솔루션을 제시합니다.
          </p>

          <div className="timeline-container">
            <div className="timeline-grid">
              {/* 컬럼 헤더 - visibleSteps에 따라 표시 */}
              <div className="timeline-header">
                {[1, 2, 3, 4, 5].map((num, colIndex) => {
                  // visibleSteps에 따른 visibleCols 계산
                  // STEP별 cols: [1, 2, 3, 3, 4, 5]
                  const colsMap = [0, 1, 2, 3, 3, 4, 5];
                  const visibleCols = colsMap[Math.min(visibleSteps, 6)];
                  const isVisible = colIndex < visibleCols;

                  return (
                    <div
                      key={colIndex}
                      className={`timeline-column-header ${isVisible ? 'visible' : ''}`}
                    >
                      DAY 0{num}
                    </div>
                  );
                })}
              </div>

              {/* 세로 구분선 - 헤더와 동기화 */}
              <div className={`timeline-edge-line timeline-edge-left ${visibleSteps > 0 ? 'visible' : ''}`} />
              <div className={`timeline-edge-line timeline-edge-right ${visibleSteps >= 6 ? 'visible' : ''}`} />
              <div className="timeline-columns">
                {[1, 2, 3, 4, 5].map((_, colIndex) => {
                  const colsMap = [0, 1, 2, 3, 3, 4, 5];
                  const visibleCols = colsMap[Math.min(visibleSteps, 6)];
                  const isVisible = colIndex < visibleCols;

                  return (
                    <div
                      key={colIndex}
                      className={`timeline-column-line ${isVisible ? 'visible' : ''}`}
                    />
                  );
                })}
              </div>

              {/* 타임라인 스텝들 - visibleSteps에 따라 표시 */}
              <div className="timeline-steps">
                {TIMELINE_STEPS.map((step, index) => {
                  const isVisible = index < visibleSteps;

                  return (
                    <div
                      key={index}
                      className={`timeline-step timeline-step-${index + 1} ${isVisible ? 'visible' : ''}`}
                      style={{ gridColumn: `1 / span ${step.cols}` }}
                    >
                      <div className="step-header">
                        <span className="step-number">STEP {step.step}</span>
                        <span className="step-line">
                          <span className="line-dot" />
                          <span className="line-bar" />
                          <span className="line-arrow" />
                        </span>
                        <span className="step-title">{step.title}</span>
                      </div>
                      <div className="step-tags">
                        {step.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`step-tag ${step.highlight && tag === '하이브리드' ? 'highlight' : ''}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: System - SYSTEM 대형 텍스트 → 라벨로 변환 → 헤드라인 + highlight 텍스트 */}
      <section ref={systemRef} className="motion-section section-system">
        <div className="system-background" />

        {/* SYSTEM 대형 텍스트 (화면 바닥에서 올라옴 → 상단으로 이동하며 축소) */}
        <h2 className="system-text">SYSTEM</h2>

        <div className="system-main-content">
          <h3 className="system-headline">
            가장 짧은 시간에<br className="mobile-br" /> 가장 빠른 속도로<br />
            본업의 성장과<br className="mobile-br" /> 소득 증대 시스템 구축
          </h3>

          <p className="system-description">
            {(() => {
              const line1 = "모두 컨설팅은 전문직 맞춤형 법인 ";
              const dbText = "DB";
              const line2 = "와 ";
              const line3 = "실전 케이스로 당신의 지식을 ";
              const line4 = "바로 실행으로 전환합니다.";
              const fullText = line1 + dbText + line2 + line3 + line4;
              const totalChars = fullText.length;
              const highlightedChars = Math.floor((systemHighlightProgress / 100) * totalChars);

              let charIndex = 0;
              const renderChars = (text: string, isDB = false) => {
                return text.split('').map((char) => {
                  const currentIndex = charIndex++;
                  return (
                    <span key={currentIndex} className={`system-highlight-char ${isDB ? 'db-char ' : ''}${currentIndex < highlightedChars ? 'active' : ''}`}>
                      {char}
                    </span>
                  );
                });
              };

              return (
                <>
                  {renderChars(line1)}
                  {renderChars(dbText, true)}
                  {renderChars(line2)}
                  <br className="mobile-br" />
                  {renderChars(line3)}
                  <br className="mobile-br" />
                  {renderChars(line4)}
                </>
              );
            })()}
          </p>
        </div>
      </section>

      {/* Section 10: System Video - 비디오 + 카드 */}
      <section ref={systemVideoRef} className="motion-section section-system-video">
        <div className="system-video-container">
          <div className="system-video-wrapper">
            <video autoPlay muted loop playsInline>
              <source src={systemVideo} type="video/mp4" />
            </video>
          </div>
          <div className="system-video-overlay">
            <p className="system-video-text">
              Income<br />
              Expansion System
            </p>
          </div>
        </div>

        <div className="system-cards">
          <div className="system-card">
            <div className="system-card-image">
              <video autoPlay muted loop playsInline>
                <source src={systemCard1Video} type="video/mp4" />
              </video>
            </div>
            <div className="system-card-content">
              <span className="system-card-label">Expert</span>
              <h4 className="system-card-title">전문가로부터 전문가에게</h4>
              <p className="system-card-desc">
                우리는 단순히 정보를 전달하지 않습니다.<br />
                컨설팅 현장에서 직접 문제를 해결한 전문가가, 복잡한 상황 속 핵심 포인트와 실무 전략을 지속적으로 나누어, 고객과 학습자가 <strong>스스로 문제를 해결할 수 있는 힘</strong>을 기르도록 돕습니다.
              </p>
            </div>
          </div>

          <div className="system-card">
            <div className="system-card-image">
              <video autoPlay muted loop playsInline>
                <source src={systemCard2Video} type="video/mp4" />
              </video>
            </div>
            <div className="system-card-content">
              <span className="system-card-label">Save Toolkit</span>
              <h4 className="system-card-title">컨설팅 실행 툴셋</h4>
              <p className="system-card-desc">
                실무에서 바로 쓰는 도구들을 한 곳에서 만나보세요.<br />
                세무, 기업 분석, 경리, 보고서, 영업, 교육까지 — <strong>taxbot-R, cretop, wecake, CEO클리닉, AP제안서, 파인즈</strong>가 필요한 업무를 손쉽게 지원합니다.
              </p>
            </div>
          </div>

          <div className="system-card">
            <div className="system-card-image">
              <video autoPlay muted loop playsInline>
                <source src={systemCard3Video} type="video/mp4" />
              </video>
            </div>
            <div className="system-card-content">
              <span className="system-card-label">Strategic Collaboration</span>
              <h4 className="system-card-title">함께 만드는 성과</h4>
              <p className="system-card-desc">
                법률, 노무, M&A, 부동산, IT 등 각 분야 전문가들과 함께,<br />
                단순 조언이 아닌 <strong>실제 실행 가능한 솔루션</strong>을 제공합니다.<br />
                협업을 통해 더 큰 시너지를 만들고, 고객의 목표 달성을 돕습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 11: Teamwork - 헤드라인 → 배경 이미지 → TEAMWORK 텍스트 */}
      <section ref={teamworkRef} className="motion-section section-teamwork">
        <div className="teamwork-background">
          <img src={teamworkImg} alt="Teamwork - People collaborating on ship" />
        </div>
        <div className="teamwork-headline">
          <p>이제는 전문가들과 함께</p>
          <p>협업하는 팀워크의 시대</p>
        </div>
        <h2 className="teamwork-text">
          <span className="teamwork-text-line">TEAM</span>
          <span className="teamwork-text-line">WORK</span>
        </h2>
      </section>

      {/* Section 12: Experts - 헤드라인 + 슬라이더 */}
      <section ref={expertsRef} className="motion-section section-experts">
        <div className="experts-headline">
          <h2>세무사·회계사·노무사·변호사 등</h2>
          <h2>각 분야의 전문가들과 협업하여</h2>
          <h2>입체적인 재무 설계 솔루션을</h2>
          <h2>제공합니다.</h2>
        </div>

        <div className="experts-desc">
          <p>
            VIP 고객은 이제 단편적 자문이 아니라<br />
            다각적 전략 컨설팅을 원합니다.<br />
            모두컨설팅은 이 시대의 요구에 맞는<br />
            &apos;팀 단위의 항해&apos; 플랫폼을 제공합니다.
          </p>
        </div>

        <div className="experts-nav">
          <button
            className="nav-button"
            disabled={expertsCardIndex === 0}
            onClick={() => setExpertsCardIndex(Math.max(0, expertsCardIndex - 1))}
          >
            <img src={expertsCardIndex === 0 ? btnLeftInactive : btnLeftActive} alt="Previous" />
          </button>
          <button
            className="nav-button"
            disabled={expertsCardIndex >= expertsCards.length - 1}
            onClick={() => setExpertsCardIndex(Math.min(expertsCards.length - 1, expertsCardIndex + 1))}
          >
            <img src={expertsCardIndex >= expertsCards.length - 1 ? btnRightInactive : btnRightActive} alt="Next" />
          </button>
        </div>

        <div className="experts-cards">
          <div
            className="experts-cards-wrapper"
            style={{ transform: `translateX(-${expertsCardIndex * expertsCardSlideWidth}px)` }}
          >
            {expertsCards.map((expert) => (
              <div className="expert-card" key={expert.id}>
                <div className="expert-image">
                  <img src={expert.image} alt={expert.name} />
                </div>
                <div className="expert-info">
                  <img className="expert-quote-icon" src="/images/main/icons/quote-icon.svg" alt="quote" />
                  <p className="expert-quote">{expert.quote}</p>
                  <div className="expert-name-row">
                    <span className="expert-name">{expert.name}</span>
                    <span className="expert-role">{expert.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="experts-progress">
          <div
            className="experts-progress-bar"
            style={{ width: `${((expertsCardIndex + 1) / expertsCards.length) * 100}%` }}
          />
        </div>
      </section>

      {/* Section 13: Champagne - 비디오 배경 + 텍스트 */}
      <section ref={champagneRef} className="motion-section section-champagne">
        <video
          className="champagne-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={champagneVideo} type="video/mp4" />
        </video>
        <div className="champagne-content">
          <h2>입증된 전문성,</h2>
          <h2>성과로 이어지는 수익 구조</h2>
        </div>
      </section>

      {/* Section 14: Cruise - 배경 이미지 + 좌/우 텍스트 */}
      <section ref={cruiseRef} className="motion-section section-cruise">
        <div className="cruise-background">
          <img src={cruiseImg} alt="Cruise ship at sunset" />
        </div>
        <div className="cruise-left-text">
          <p>모두컨설팅은</p>
          <p>누적된 실적, 데이터,</p>
          <p>네트워크를 기반으로</p>
        </div>
        <div className="cruise-right-text">
          <p>당신의 브랜드를</p>
          <p>&apos;1등 세무사&apos;로 완성합니다</p>
        </div>
      </section>

      {/* Section 15: Final - 마지막 CTA 섹션 */}
      <section ref={finalRef} className="motion-section section-final">
        <div className="final-content">
          <h2 className="final-title">모두가 함께하고 있습니다.</h2>
          <h2 className="final-subtitle">이제, 당신만 오시면 완성됩니다</h2>
          <button className="final-cta">모두컨설팅과 함께하기
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8.85156 5L16.0016 11.5L8.85156 18" stroke="#2D2D2D" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <Footer />
      </section>
    </div>
  );
};

export default TestMotion;


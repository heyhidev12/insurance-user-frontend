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

  // 섹션 Refs
  const heroRef = useRef<HTMLDivElement>(null);
  const financeRef = useRef<HTMLDivElement>(null);
  const yachtRef = useRef<HTMLDivElement>(null);
  const visionTextRef = useRef<HTMLDivElement>(null);
  const growthSectionRef = useRef<HTMLDivElement>(null);
  const solution01Ref = useRef<HTMLDivElement>(null);
  const solution02Ref = useRef<HTMLDivElement>(null);
  const systemIntroRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<HTMLDivElement>(null);
  const teamworkRef = useRef<HTMLDivElement>(null);
  const expertsRef = useRef<HTMLDivElement>(null);
  const champagneRef = useRef<HTMLDivElement>(null);
  const cruiseRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);

  // 반응형 슬라이드 너비 업데이트
  React.useEffect(() => {
    const updateSlideWidth = () => {
      const vw = window.innerWidth;
      if (vw <= 768) {
        // 모바일: 카드 실제 너비(300px) + gap(32px) = 332px 에 맞춰 슬라이드 폭 설정
        setCardSlideWidth(332);
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
        const response = await fetch('http://13.124.98.132:3000/members?page=1&limit=20');
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
    // 페이지 로드 시 Hero 섹션이 보이면 white variant로 설정
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      if (rect.top >= 0 && rect.top < window.innerHeight) {
        setHeaderVariant('white');
      }
    }

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

        // 화면 크기에 맞는 scale 계산
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const pillWidth = 180;
        const pillHeight = 80;
        const scaleX = viewportWidth / pillWidth;
        const scaleY = viewportHeight / pillHeight;
        const targetScale = Math.max(scaleX, scaleY) * 1.2; // 여유있게 1.2배

        // crew pill의 현재 위치에서 화면 중앙까지의 거리 계산
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
            refreshPriority: 1, // 높은 우선순위로 Hero 섹션이 먼저 처리되도록
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
            onEnter: () => {
              // Hero 섹션 진입 시 white variant 설정 (빨간색 로고 + 검정색 햄버거)
              setHeaderVariant('white');
            },
            onLeave: () => {
              // Hero 섹션을 벗어날 때 transparent로 변경
              setHeaderVariant('transparent');
            },
            onEnterBack: () => {
              // Hero 섹션으로 다시 돌아올 때 white variant 설정
              setHeaderVariant('white');
            },
            onRefresh: () => {
              // ScrollTrigger 새로고침 시 Hero 섹션이 보이면 white로 설정
              if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                if (rect.top >= 0 && rect.top < window.innerHeight) {
                  setHeaderVariant('white');
                }
              }
            },
            onUpdate: (self) => {
              // section-hero-initial에서는 항상 white variant 유지 (빨간색 로고 + 검정색 햄버거)
              setHeaderVariant('white');

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
          scale: targetScale,
          borderRadius: '0px',
          duration: 0.3,
          ease: 'power2.inOut',
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
            onEnter: () => {
              // Finance 섹션 진입 시 transparent로 변경
              setHeaderVariant('transparent');
            },
            onLeaveBack: () => {
              // Hero 섹션으로 돌아갈 때 white로 변경
              setHeaderVariant('white');
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

        // System 설명 문장 스크롤 시 점진적으로 bold + 컬러 변경 (단순 효과)
        // (systemDescriptionEl은 아래 모바일/데스크톱 공통 로직에서만 사용)
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
            end: '+=800%', // 카드 넘기는 속도 조절
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            // 타임라인:
            // 0%: 망원경 배경만
            // 8%: VISION 텍스트 등장
            // 10%~25%: snap (VISION 오래 머물기)
            // 28%~32%: VISION 페이드아웃 + 오버레이 (매우 빠르게)
            // 35%: 본문 + 카드 등장
            // 45%~90%: 카드 자동 넘기기 (자유 스크롤)
            // 90% 이상: 다음 섹션으로
            snap: {
              snapTo: (progress) => {
                if (progress < 0.06) return 0;        // 시작
                if (progress < 0.28) return 0.15;     // VISION 텍스트 상태에서 오래 머물기
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
              // VISION 텍스트 유지 (12% ~ 22%)
              else if (self.progress > 0.12 && self.progress <= 0.22) {
                gsap.set(growthVisionText, { opacity: 1 });
              }
              // 2. VISION 텍스트 점진적 페이드아웃 + 오버레이 점진적 등장 (22% ~ 32%)
              else if (self.progress > 0.22 && self.progress <= 0.32) {
                const fadeProgress = (self.progress - 0.22) / 0.10;
                const visionOpacity = Math.max(0, 1 - fadeProgress);
                const overlayOpacity = Math.min(1, fadeProgress);
                gsap.set(growthVisionText, { opacity: visionOpacity });
                gsap.set(growthOverlay, { opacity: overlayOpacity });
              } else if (self.progress > 0.32) {
                gsap.set(growthVisionText, { opacity: 0 });
                gsap.set(growthOverlay, { opacity: 1 });
              }

              // 3. 본문 등장 (35% 이상) - 부드러운 전환
              if (self.progress > 0.35 && !contentPlayed) {
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

              // 본문 되돌리기 (32% 이하)
              if (self.progress < 0.32 && contentPlayed) {
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

      // Section 6: Solution 01 - 나침반 배경 + DIRECTION 텍스트 → 마키 카드
      // [순서] 1. 배경 → 2. DIRECTION (오래 머물기) → 3. 오버레이 → 4. 텍스트 순차 → 5. 마키 한줄씩
      if (solution01Ref.current) {
        const directionText = solution01Ref.current.querySelector('.direction-text');
        const solutionOverlay = solution01Ref.current.querySelector('.solution-overlay');
        const solutionContent = solution01Ref.current.querySelector('.solution-content');
        const solutionLabel = solution01Ref.current.querySelector('.solution-label');
        const solutionTitle = solution01Ref.current.querySelector('.solution-title');
        const solutionDescription = solution01Ref.current.querySelector('.solution-description');
        const solutionGrids = solution01Ref.current.querySelectorAll('.solution-grid');

        gsap.set(directionText, { opacity: 0 });
        gsap.set(solutionOverlay, { opacity: 0 });
        gsap.set(solutionContent, { opacity: 0 });
        gsap.set([solutionLabel, solutionTitle, solutionDescription], { opacity: 0, y: 30 });
        gsap.set(solutionGrids, { opacity: 0, y: 20 });

        let textContentPlayed = false;

        gsap.timeline({
          scrollTrigger: {
            trigger: solution01Ref.current,
            start: 'top top',
            end: '+=1500%', // 체류 시간 더 길게
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            // 타임라인:
            // 0%: 나침반 배경만
            // 5%: DIRECTION 텍스트 등장
            // 5%~18%: snap (DIRECTION 오래 머물기 - Vision과 동일)
            // 20%~24%: DIRECTION 페이드아웃 + 오버레이
            // 26%: 라벨 등장
            // 28%: 제목 등장
            // 30%: 설명 등장
            // 35%~55%: 마키 카드 한 줄씩 등장
            snap: {
              snapTo: (progress) => {
                if (progress < 0.04) return 0;
                if (progress < 0.18) return 0.10;  // DIRECTION 텍스트 상태 (오래 머물기)
                if (progress >= 0.35 && progress < 0.50) return 0.42;  // 제목 + 첫번째 줄 상태 (오래 머물기)
                if (progress >= 0.90) return 1;
                return progress;
              },
              duration: { min: 0.3, max: 0.6 },
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              // 1. DIRECTION 텍스트 점진적 등장 (0% ~ 8%)
              if (self.progress >= 0 && self.progress <= 0.08) {
                const fadeInProgress = self.progress / 0.08;
                gsap.set(directionText, { opacity: fadeInProgress });
              }
              // DIRECTION 텍스트 유지 (8% ~ 15%)
              else if (self.progress > 0.08 && self.progress <= 0.15) {
                gsap.set(directionText, { opacity: 1 });
              }
              // 2. DIRECTION 텍스트 점진적 페이드아웃 + 오버레이 점진적 등장 (15% ~ 24%)
              else if (self.progress > 0.15 && self.progress <= 0.24) {
                const fadeProgress = (self.progress - 0.15) / 0.09;
                const directionOpacity = Math.max(0, 1 - fadeProgress);
                const overlayOpacity = Math.min(1, fadeProgress);
                gsap.set(directionText, { opacity: directionOpacity });
                gsap.set(solutionOverlay, { opacity: overlayOpacity });
              } else if (self.progress > 0.24) {
                gsap.set(directionText, { opacity: 0 });
                gsap.set(solutionOverlay, { opacity: 1 });
              }

              // 3. 텍스트 순차 등장 (26% 이상) - 부드러운 전환
              if (self.progress > 0.26 && !textContentPlayed) {
                textContentPlayed = true;
                gsap.to(solutionContent, { opacity: 1, duration: 0.5, ease: 'power2.out' });
                // 라벨 → 제목 → 설명 순차 (시간 기반, 더 부드럽게)
                gsap.to(solutionLabel, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                gsap.to(solutionTitle, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });
                gsap.to(solutionDescription, { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power2.out' });
              }

              // 텍스트 되돌리기 (24% 이하)
              if (self.progress < 0.24 && textContentPlayed) {
                textContentPlayed = false;
                gsap.to(solutionContent, { opacity: 0, duration: 0.3 });
                gsap.to([solutionLabel, solutionTitle, solutionDescription], { opacity: 0, y: 30, duration: 0.3 });
                gsap.to(solutionGrids, { opacity: 0, y: 20, duration: 0.3 });
              }

              // 4. 마키 카드 한 줄씩 등장 (35%~70% 구간, 스크롤 기반) - 더 느리게
              // 각 줄이 스크롤에 따라 부드럽게 fade-in + slide-up
              const gridStartPoint = 0.35;
              const gridEndPoint = 0.70;

              if (self.progress >= gridStartPoint && self.progress <= gridEndPoint) {
                const totalRange = gridEndPoint - gridStartPoint; // 35%
                const gridCount = 4;
                const perGridRange = totalRange / gridCount; // 각 줄당 약 8.75%

                solutionGrids.forEach((grid, index) => {
                  const gridStart = gridStartPoint + (index * perGridRange);
                  const gridEnd = gridStart + perGridRange;

                  if (self.progress < gridStart) {
                    // 아직 이 줄의 차례가 아님
                    gsap.set(grid, { opacity: 0, y: 20 });
                  } else if (self.progress >= gridStart && self.progress <= gridEnd) {
                    // 이 줄이 애니메이션 중
                    const gridLocalProgress = (self.progress - gridStart) / perGridRange;
                    const opacity = gridLocalProgress; // 선형으로 나타남
                    const y = 20 * (1 - gridLocalProgress);
                    gsap.set(grid, { opacity, y });
                  } else {
                    // 이 줄 애니메이션 완료
                    gsap.set(grid, { opacity: 1, y: 0 });
                  }
                });

                // 5. 4번째 줄(index 3)이 나타나기 시작할 때 타이틀/설명 페이드아웃
                // 4번째 줄 시작점: 0.35 + (3 * 0.0875) = 0.6125 (61.25%)
                const fourthGridStart = 0.6125;
                if (self.progress >= fourthGridStart) {
                  const fadeOutProgress = Math.min((self.progress - fourthGridStart) / perGridRange, 1);
                  const textOpacity = 1 - fadeOutProgress;
                  gsap.set([solutionLabel, solutionTitle, solutionDescription], { opacity: textOpacity });
                } else {
                  // 스크롤을 뒤로 올릴 때 텍스트 다시 표시
                  gsap.set([solutionLabel, solutionTitle, solutionDescription], { opacity: 1, y: 0 });
                }
              } else if (self.progress > gridEndPoint) {
                // 모든 그리드 표시, 텍스트 완전히 숨김
                solutionGrids.forEach((grid) => {
                  gsap.set(grid, { opacity: 1, y: 0 });
                });
                gsap.set([solutionLabel, solutionTitle, solutionDescription], { opacity: 0 });
              } else if (self.progress < gridStartPoint) {
                // 모든 그리드 숨김
                solutionGrids.forEach((grid) => {
                  gsap.set(grid, { opacity: 0, y: 20 });
                });
              }

            },
          },
        });
      }

      // Section 7: Solution 02 - 타임라인 그리드
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

        gsap.timeline({
          scrollTrigger: {
            trigger: solution02Ref.current,
            start: 'top top',
            end: '+=350%', // 시간 기반이므로 줄임
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            snap: {
              snapTo: (progress) => {
                if (progress < 0.08) return 0;
                if (progress < 0.9) return 0.55; // 애니메이션 완료 후 머무르기
                return 1;
              },
              duration: { min: 0.3, max: 0.6 },
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              // 콘텐츠 등장 (10% 이상) - 시간 기반 애니메이션
              if (self.progress > 0.10 && !solution02ContentPlayed) {
                solution02ContentPlayed = true;
                gsap.to(solution02Content, { opacity: 1, duration: 0.3, ease: 'power2.out' });
                // 라벨 → 제목 → 설명 순차 등장 (시간 기반)
                gsap.to(solution02Label, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
                gsap.to(solution02Title, { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: 'power2.out' });
                gsap.to(solution02Description, { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' });
                // 타임라인 컨테이너 등장
                gsap.to(timelineContainer, { opacity: 1, duration: 0.4, delay: 0.45, ease: 'power2.out' });

                // 스텝들 시간 기반 순차 등장 (0.6초 후부터 0.4초 간격)
                for (let i = 1; i <= 6; i++) {
                  gsap.delayedCall(0.6 + i * 0.4, () => {
                    setVisibleSteps(i);
                  });
                }
              }

              // 되돌리기 (8% 이하)
              if (self.progress < 0.08 && solution02ContentPlayed) {
                solution02ContentPlayed = false;
                gsap.to(solution02Content, { opacity: 0, duration: 0.3 });
                gsap.to([solution02Label, solution02Title, solution02Description], { opacity: 0, y: 30, duration: 0.3 });
                gsap.to(timelineContainer, { opacity: 0, duration: 0.3 });
                setVisibleSteps(0);
              }
            },
          },
        });
      }

      // Section 8: System - SYSTEM 대형 텍스트 → 라벨로 변환 → 헤드라인 + highlight 텍스트 + 비디오 축소 + 카드
      // [모션 순서]
      // 1단계: "SYSTEM" 대형 텍스트가 중앙에 크게 표시 (화면 바닥에서 올라옴)
      // 2단계: "SYSTEM" 텍스트가 상단 중앙으로 이동하면서 작아짐 (scale + y 이동)
      // 3단계: 상단에 "SYSTEM" 라벨 유지 + 헤드라인 등장 + 설명 텍스트 등장 (회색 상태)
      // 4단계: 설명 텍스트가 스크롤에 따라 highlight (회색 → 흰색) + 쉬는 시간
      // 5단계: SYSTEM 라벨 + 헤드라인 + 설명 페이드아웃
      // 6단계: 비디오 화면 중앙에 큰 상태로 등장 (화면의 4/6 크기, border-radius: 28.5px)
      // 7단계: 비디오 좌측으로 이동 + 좌우 축소
      // 8단계: 카드 등장 (스크롤 맨 위에서 시작)
      // 9단계: 카드 스크롤 가능
      if (systemRef.current) {
        const systemText = systemRef.current.querySelector('.system-text') as HTMLElement;
        const systemMainContent = systemRef.current.querySelector('.system-main-content');
        const systemHeadline = systemRef.current.querySelector('.system-headline');
        const systemDescriptionEl = systemRef.current.querySelector('.system-description') as HTMLElement | null;
        const systemVideoContainer = systemRef.current.querySelector('.system-video-container') as HTMLElement;
        const systemVideoWrapper = systemRef.current.querySelector('.system-video-wrapper') as HTMLElement;
        const systemCards = systemRef.current.querySelector('.system-cards') as HTMLElement;

        // 대형 텍스트 초기 위치 계산 (화면 바닥에서 시작)
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const textStartY = viewportHeight; // 화면 바닥에서 시작

        // 대형 텍스트 → 라벨 변환을 위한 목표 위치/스케일 계산
        const textRect = systemText?.getBoundingClientRect();
        const textCenterY = viewportHeight / 2;
        const labelTargetY = 0; // 라벨 최종 Y 위치 (상단 50px 위치, 헤드라인 100px - 간격 50px)
        const labelTargetScale = 0.09; // 265px → ~24px (약 0.09배) - 더 크게

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
        // 카드 왼쪽 가장자리 = viewportWidth - 64 - (0.35*viewportWidth - 96) = 0.65*viewportWidth + 32
        // 비디오 오른쪽 가장자리 = 64 + finalVideoWidth
        // 간격 64px: (0.65*viewportWidth + 32) - (64 + finalVideoWidth) = 64
        // finalVideoWidth = 0.65*viewportWidth - 96
        const finalVideoWidth = viewportWidth * 0.65 - 96;
        const finalVideoHeight = fullVideoHeight; // 높이는 동일하게 유지
        const finalBorderRadius = 24; // 항상 24px 유지
        // 최종 위치 (좌측 여백 없음)
        const finalVideoLeft = 0;

        // 비디오 이동을 위한 계산
        const finalVideoX = finalVideoWidth / 2 - viewportWidth / 2;
        // 시작 위치 (화면 바닥에서 시작 - SYSTEM 텍스트처럼)
        const videoStartY = viewportHeight;

        // 초기 상태 설정
        gsap.set(systemText, { opacity: 0, y: textStartY, scale: 1 }); // 화면 바닥에서 시작
        gsap.set(systemMainContent, { opacity: 0 }); // 메인 컨텐츠 컨테이너
        if (systemDescriptionEl) {
          gsap.set([systemHeadline, systemDescriptionEl], { opacity: 0, y: 30 });
        } else {
          gsap.set(systemHeadline, { opacity: 0, y: 30 });
        }
        gsap.set(systemVideoContainer, {
          opacity: 0,
          width: startVideoWidth,
          height: startVideoHeight,
          borderRadius: startBorderRadius,
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: videoStartY
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
        // 카드 스크롤 위치 초기화
        if (systemCards) {
          systemCards.scrollTop = 0;
        }

        let systemTextPlayed = false;
        let systemContentPlayed = false;
        let systemVideoPlayed = false;
        let systemCardsPlayed = false;

        gsap.timeline({
          scrollTrigger: {
            trigger: systemRef.current,
            start: 'top top',
            end: '+=1000%', // 더 길게 (비디오 확장 + 카드 스크롤 포함)
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            snap: {
              snapTo: (progress) => {
                if (progress < 0.05) return 0;        // 시작
                if (progress < 0.15) return 0.08;    // SYSTEM 대형 텍스트 등장 후 머무르기
                if (progress < 0.48) return 0.35;    // 콘텐츠 + highlight 완료 후 머무르기
                if (progress < 0.58) return 0.55;    // 비디오 등장 시작
                if (progress < 0.68) return 0.63;    // 비디오 풀스크린 상태에서 머무르기
                if (progress < 0.9) return 0.80;     // 비디오/카드 완료 상태
                return 1;
              },
              duration: { min: 0.3, max: 0.6 },
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              const progress = self.progress;
              const isMobile = window.innerWidth <= 768;

              // 모바일 전용 모션 타임라인
              if (isMobile) {
                const p = progress;

                // 1) SYSTEM 아래 → 중앙으로 이동 (0% ~ 15%)
                if (p >= 0 && p <= 0.15) {
                  const t = p / 0.15;
                  const currentY = textStartY * (1 - t);
                  gsap.set(systemText, {
                    opacity: t,
                    y: currentY,
                    scale: 1,
                  });
                }
                // 2) SYSTEM 중앙 대기 (15% ~ 25%)
                else if (p > 0.15 && p <= 0.25) {
                  gsap.set(systemText, { opacity: 1, y: 0, scale: 1 });
                }
                // 3) SYSTEM 상단 이동 + 축소 (25% ~ 35%)
                else if (p > 0.25 && p <= 0.35) {
                  const t = (p - 0.25) / 0.10;
                  const targetY = -textCenterY + labelTargetY + 120;
                  const currentY = targetY * t;
                  const currentScale = 1 - (1 - labelTargetScale) * t;
                  gsap.set(systemText, {
                    opacity: 1,
                    y: currentY,
                    scale: currentScale,
                  });
                }
                // 이후 구간에서는 라벨 상태 유지
                else if (p > 0.35) {
                  const targetY = -textCenterY + labelTargetY + 120;
                  gsap.set(systemText, { opacity: 1, y: targetY, scale: labelTargetScale });
                } else {
                  // 0% 부근 초기 상태
                  gsap.set(systemText, { opacity: 0, y: textStartY, scale: 1 });
                }

                // 4) 타이틀 + 서브 텍스트 fade-up (35% ~ 45%)
                if (p >= 0.35 && p <= 0.45) {
                  const t = (p - 0.35) / 0.10;
                  gsap.set(systemMainContent, { opacity: 1 });
                  if (systemDescriptionEl) {
                    gsap.set(systemHeadline, { opacity: t, y: 30 * (1 - t) });
                    gsap.set(systemDescriptionEl, { opacity: t, y: 30 * (1 - t) });
                  } else {
                    gsap.set(systemHeadline, { opacity: t, y: 30 * (1 - t) });
                  }
                } else if (p > 0.45) {
                  gsap.set(systemMainContent, { opacity: 1 });
                  if (systemDescriptionEl) {
                    gsap.set([systemHeadline, systemDescriptionEl], { opacity: 1, y: 0 });
                  } else {
                    gsap.set(systemHeadline, { opacity: 1, y: 0 });
                  }
                } else {
                  gsap.set(systemMainContent, { opacity: 0 });
                  if (systemDescriptionEl) {
                    gsap.set([systemHeadline, systemDescriptionEl], { opacity: 0, y: 30 });
                  } else {
                    gsap.set(systemHeadline, { opacity: 0, y: 30 });
                  }
                }

                // 5) 서브 텍스트 하이라이트 (45% ~ 70%)
                if (p >= 0.45 && p <= 0.7) {
                  const t = (p - 0.45) / 0.25;
                  setSystemHighlightProgress(Math.min(t * 100, 100));
                } else if (p < 0.45) {
                  setSystemHighlightProgress(0);
                } else {
                  setSystemHighlightProgress(100);
                }

                // 6) 텍스트 완료 상태 유지, 후반에 비디오 등장 (80% 이후)
                if (p < 0.8) {
                  gsap.set(systemVideoContainer, {
                    opacity: 0,
                    width: startVideoWidth,
                    height: startVideoHeight,
                    borderRadius: startBorderRadius,
                    xPercent: -50,
                    yPercent: -50,
                    x: 0,
                    y: videoStartY,
                  });
                  if (systemVideoWrapper) {
                    gsap.set(systemVideoWrapper, {
                      width: startVideoWidth,
                      height: startVideoHeight,
                      borderRadius: startBorderRadius
                    });
                  }
                  gsap.set(systemCards, { opacity: 0 });
                } else {
                  const t = Math.min((p - 0.8) / 0.2, 1);
                  gsap.set(systemVideoContainer, {
                    opacity: t,
                    width: fullVideoWidth,
                    height: fullVideoHeight,
                    borderRadius: fullBorderRadius,
                    xPercent: -50,
                    yPercent: -50,
                    x: 0,
                    y: 0,
                  });
                  if (systemVideoWrapper) {
                    gsap.set(systemVideoWrapper, {
                      width: fullVideoWidth,
                      height: fullVideoHeight,
                      borderRadius: fullBorderRadius
                    });
                  }
                  gsap.set(systemCards, { opacity: 0 });
                }

                return;
              }

              // 1. SYSTEM 대형 텍스트 등장 (3%~8% 스크롤 연동) - 화면 바닥에서 중앙으로
              if (progress >= 0.03 && progress <= 0.08) {
                const appearProgress = (progress - 0.03) / 0.05;
                const currentY = textStartY * (1 - appearProgress);
                gsap.set(systemText, {
                  opacity: appearProgress,
                  y: currentY,
                  scale: 1
                });
              } else if (progress > 0.08 && progress < 0.12) {
                // 중앙에서 머무르기
                gsap.set(systemText, { opacity: 1, y: 0, scale: 1 });
              }

              // 되돌리기 (3% 이하)
              if (progress < 0.03) {
                gsap.set(systemText, { opacity: 0, y: textStartY, scale: 1 });
              }

              // 2. SYSTEM 텍스트 상단으로 이동 + 축소 (12%~22% 스크롤 연동)
              if (progress >= 0.12 && progress <= 0.22) {
                const moveProgress = (progress - 0.12) / 0.10;
                // 대형 텍스트: 중앙(y:0) → 상단(y: -textCenterY + labelTargetY)으로 이동 + scale 축소
                const targetY = -textCenterY + labelTargetY + 120; // 상단으로 이동 (더 아래로)
                const currentY = targetY * moveProgress;
                const currentScale = 1 - (1 - labelTargetScale) * moveProgress;
                gsap.set(systemText, {
                  opacity: 1,
                  y: currentY,
                  scale: currentScale
                });
              } else if (progress > 0.22 && progress < 0.50) {
                // 최종 라벨 상태 유지 (50% 전까지)
                const targetY = -textCenterY + labelTargetY + 120;
                gsap.set(systemText, { opacity: 1, y: targetY, scale: labelTargetScale });
              }

              // 3. 헤드라인 + 설명 등장 (28% 이상) - 부드러운 전환
              if (progress > 0.28 && !systemContentPlayed) {
                systemContentPlayed = true;
                gsap.to(systemMainContent, { opacity: 1, duration: 0.5, ease: 'power2.out' });
                if (systemDescriptionEl) {
                  gsap.to(systemHeadline, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                  gsap.to(systemDescriptionEl, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.3,
                    ease: 'power2.out',
                  });
                } else {
                  gsap.to(systemHeadline, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                }
              }

              // 콘텐츠 되돌리기 (25% 이하)
              if (progress < 0.25 && systemContentPlayed) {
                systemContentPlayed = false;
                gsap.to(systemMainContent, { opacity: 0, duration: 0.3 });
                if (systemDescriptionEl) {
                  gsap.to([systemHeadline, systemDescriptionEl], {
                    opacity: 0,
                    y: 30,
                    duration: 0.3,
                  });
                } else {
                  gsap.to(systemHeadline, { opacity: 0, y: 30, duration: 0.3 });
                }
                setSystemHighlightProgress(0);
              }

              // 4. 설명 텍스트 highlight (32% ~ 45% 구간) + 이후 쉬는 시간 (45%~50%)
              if (progress >= 0.32 && progress <= 0.45) {
                const highlightPercent = ((progress - 0.32) / 0.13) * 100;
                setSystemHighlightProgress(Math.min(highlightPercent, 100));
              } else if (progress < 0.32) {
                setSystemHighlightProgress(0);
              } else if (progress > 0.45) {
                setSystemHighlightProgress(100);
              }

              // 5. SYSTEM 라벨 + 헤드라인 + 설명 페이드아웃 (50%~55%)
              if (progress >= 0.50 && progress <= 0.55) {
                const fadeProgress = (progress - 0.50) / 0.05;
                const targetY = -textCenterY + labelTargetY + 120;
                gsap.set(systemText, { opacity: 1 - fadeProgress, y: targetY, scale: labelTargetScale });
                gsap.set(systemMainContent, { opacity: 1 - fadeProgress });
              } else if (progress > 0.55) {
                gsap.set(systemText, { opacity: 0 });
                gsap.set(systemMainContent, { opacity: 0 });
              }

              // 6. 비디오 아래에서 올라오며 등장 (55%~60%) - opacity 0→1, y: 아래→중앙
              if (progress >= 0.55 && progress <= 0.60) {
                const appearProgress = (progress - 0.55) / 0.05;
                const currentY = videoStartY * (1 - appearProgress);
                gsap.set(systemVideoContainer, {
                  opacity: appearProgress,
                  width: startVideoWidth,
                  height: startVideoHeight,
                  borderRadius: startBorderRadius,
                  xPercent: -50,
                  yPercent: -50,
                  x: 0,
                  y: currentY
                });
                if (systemVideoWrapper) {
                  gsap.set(systemVideoWrapper, {
                    width: startVideoWidth,
                    height: startVideoHeight,
                    borderRadius: startBorderRadius
                  });
                }
              }

              // 7. 비디오 화면 꽉 채움 (60%~65%) - 작은 상태 → 풀스크린
              if (progress >= 0.60 && progress <= 0.65) {
                const expandProgress = (progress - 0.60) / 0.05;
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

              // 8. 비디오 좌측으로 이동 + 좌우 크롭 (65%~75%) - 비디오 크기 유지, 컨테이너와 wrapper만 줄어서 크롭
              if (progress >= 0.65 && progress <= 0.75) {
                const cropProgress = (progress - 0.65) / 0.10;
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
              } else if (progress > 0.75) {
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

              // 비디오 되돌리기 (55% 이하)
              if (progress < 0.55) {
                gsap.set(systemVideoContainer, {
                  opacity: 0,
                  width: startVideoWidth,
                  height: startVideoHeight,
                  borderRadius: startBorderRadius,
                  xPercent: -50,
                  yPercent: -50,
                  x: 0,
                  y: videoStartY
                });
                if (systemVideoWrapper) {
                  gsap.set(systemVideoWrapper, {
                    width: startVideoWidth,
                    height: startVideoHeight,
                    borderRadius: startBorderRadius
                  });
                }
              }

              // 8. 카드 등장 (75% 이상) - 시간 기반
              if (progress > 0.75 && !systemCardsPlayed) {
                systemCardsPlayed = true;
                // 카드 스크롤 위치 초기화 (맨 위에서 시작)
                if (systemCards) {
                  systemCards.scrollTop = 0;
                }
                gsap.to(systemCards, { opacity: 1, duration: 0.5, ease: 'power2.out' });
              }

              // 카드 되돌리기 (73% 이하)
              if (progress < 0.73 && systemCardsPlayed) {
                systemCardsPlayed = false;
                gsap.to(systemCards, { opacity: 0, duration: 0.3 });
              }
            },
          },
        });

        // System 설명 문장 스크롤 시 점차 볼드 + 컬러 변경 (섹션 내부에서 간단히 처리)
        if (systemDescriptionEl) {
          gsap.fromTo(
            systemDescriptionEl,
            { fontWeight: 500, color: '#747474' },
            {
              fontWeight: 700,
              color: '#ffffff',
              scrollTrigger: {
                trigger: systemDescriptionEl,
                start: 'top 80%',
                end: 'top 40%',
                scrub: 0.7,
              },
            }
          );
        }
      }

      // Section 9: Teamwork - 헤드라인 → 배경 이미지 → TEAMWORK 텍스트
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
        gsap.set(teamworkHeadline, { opacity: 0, y: headlineStartY });
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
                  y: currentY
                });
              } else if (self.progress > 0.15 && self.progress < 0.30) {
                gsap.set(teamworkHeadline, { opacity: 1, y: 0 });
              } else if (self.progress < 0.03) {
                gsap.set(teamworkHeadline, { opacity: 0, y: headlineStartY });
              }

              // 2. 헤드라인 페이드아웃 + 배경 페이드인 (30% ~ 45%)
              if (self.progress >= 0.30 && self.progress <= 0.45) {
                const transitionProgress = (self.progress - 0.30) / 0.15;
                gsap.set(teamworkHeadline, { opacity: 1 - transitionProgress, y: 0 });
                gsap.set(teamworkBackground, { opacity: transitionProgress });
              } else if (self.progress > 0.45) {
                gsap.set(teamworkHeadline, { opacity: 0 });
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

      // Section 10: Experts - 헤드라인 + 설명 + 슬라이더
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

        gsap.timeline({
          scrollTrigger: {
            trigger: expertsRef.current,
            start: 'top top',
            end: '+=300%',
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            snap: {
              snapTo: (progress) => {
                if (progress < 0.08) return 0;
                if (progress < 0.9) return 0.40;  // 콘텐츠 등장 후 머무르기
                return 1;
              },
              duration: { min: 0.3, max: 0.6 },
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              // 콘텐츠 등장 (10% 이상) - 부드러운 전환
              if (self.progress > 0.10 && !expertsContentPlayed) {
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

              // 되돌리기 (8% 이하)
              if (self.progress < 0.08 && expertsContentPlayed) {
                expertsContentPlayed = false;
                gsap.to(expertsHeadline, { opacity: 0, y: 30, duration: 0.3 });
                gsap.to(expertsDesc, { opacity: 0, y: 30, duration: 0.3 });
                gsap.to(expertsNav, { opacity: 0, duration: 0.3 });
                gsap.to(expertsCards, { opacity: 0, y: 30, duration: 0.3 });
              }
            },
          },
        });
      }

      // Section 11: Champagne - 비디오 배경 + 텍스트
      // [모션 순서] 텍스트 fade-up 등장
      if (champagneRef.current) {
        const champagneContent = champagneRef.current.querySelector('.champagne-content') as HTMLElement;

        // 초기 상태 설정
        gsap.set(champagneContent, { opacity: 0, y: 30 });

        let champagneContentPlayed = false;

        gsap.timeline({
          scrollTrigger: {
            trigger: champagneRef.current,
            start: 'top top',
            end: '+=200%',
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            snap: {
              snapTo: (progress) => {
                if (progress < 0.08) return 0;
                if (progress < 0.9) return 0.40;
                return 1;
              },
              duration: { min: 0.3, max: 0.6 },
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              // 콘텐츠 등장 (10% 이상)
              if (self.progress > 0.10 && !champagneContentPlayed) {
                champagneContentPlayed = true;
                gsap.to(champagneContent, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
              }

              // 되돌리기 (8% 이하)
              if (self.progress < 0.08 && champagneContentPlayed) {
                champagneContentPlayed = false;
                gsap.to(champagneContent, { opacity: 0, y: 30, duration: 0.3 });
              }
            },
          },
        });
      }

      // Section 12: Cruise - 배경 이미지 + 좌/우 텍스트
      // [모션 순서] 좌측 텍스트 → 우측 텍스트 순차 등장
      if (cruiseRef.current) {
        const cruiseLeftText = cruiseRef.current.querySelector('.cruise-left-text') as HTMLElement;
        const cruiseRightText = cruiseRef.current.querySelector('.cruise-right-text') as HTMLElement;

        // 초기 상태 설정
        gsap.set(cruiseLeftText, { opacity: 0, y: 30 });
        gsap.set(cruiseRightText, { opacity: 0, y: 30 });

        let cruiseLeftPlayed = false;
        let cruiseRightPlayed = false;

        gsap.timeline({
          scrollTrigger: {
            trigger: cruiseRef.current,
            start: 'top top',
            end: '+=200%',
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            onUpdate: (self) => {
              // 좌측 텍스트 등장 (10% 이상)
              if (self.progress > 0.10 && !cruiseLeftPlayed) {
                cruiseLeftPlayed = true;
                gsap.to(cruiseLeftText, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
              }

              // 우측 텍스트 등장 (25% 이상)
              if (self.progress > 0.25 && !cruiseRightPlayed) {
                cruiseRightPlayed = true;
                gsap.to(cruiseRightText, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
              }

              // 되돌리기 (8% 이하)
              if (self.progress < 0.08 && cruiseLeftPlayed) {
                cruiseLeftPlayed = false;
                cruiseRightPlayed = false;
                gsap.to(cruiseLeftText, { opacity: 0, y: 30, duration: 0.3 });
                gsap.to(cruiseRightText, { opacity: 0, y: 30, duration: 0.3 });
              }
            },
          },
        });
      }

      // Section 13: Final - 마지막 CTA 섹션
      if (finalRef.current) {
        const finalContent = finalRef.current.querySelector('.final-content') as HTMLElement;
        const finalTitle = finalRef.current.querySelector('.final-title') as HTMLElement;
        const finalSubtitle = finalRef.current.querySelector('.final-subtitle') as HTMLElement;
        const finalCta = finalRef.current.querySelector('.final-cta') as HTMLElement;

        // 초기 상태 설정
        gsap.set(finalTitle, { opacity: 0, y: 30 });
        gsap.set(finalSubtitle, { opacity: 0, y: 30 });
        gsap.set(finalCta, { opacity: 0, y: 30 });

        let finalContentPlayed = false;

        gsap.timeline({
          scrollTrigger: {
            trigger: finalRef.current,
            start: 'top top',
            end: '+=150%',
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            snap: {
              snapTo: (progress) => {
                if (progress < 0.08) return 0;
                if (progress < 0.9) return 0.40;
                return 1;
              },
              duration: { min: 0.3, max: 0.6 },
              ease: 'power2.out',
              inertia: false,
            },
            onUpdate: (self) => {
              // 콘텐츠 등장 (5% 이상) - 더 빠르게 시작
              if (self.progress > 0.05 && !finalContentPlayed) {
                finalContentPlayed = true;
                gsap.to(finalTitle, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
                gsap.to(finalSubtitle, { opacity: 1, y: 0, duration: 0.3, delay: 0.1, ease: 'power2.out' });
                gsap.to(finalCta, { opacity: 1, y: 0, duration: 0.3, delay: 0.2, ease: 'power2.out' });
              }

              // 되돌리기 (3% 이하)
              if (self.progress < 0.03 && finalContentPlayed) {
                finalContentPlayed = false;
                gsap.to(finalTitle, { opacity: 0, y: 30, duration: 0.3 });
                gsap.to(finalSubtitle, { opacity: 0, y: 30, duration: 0.3 });
                gsap.to(finalCta, { opacity: 0, y: 30, duration: 0.3 });
              }
            },
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
              <p>Acting as</p>
              <p>your partner.</p>
            </div>
          </div>
          <div className="growth-description">
            <p>고객의 성장은 우리의 성장입니다.</p>
            <p>고객의 어려움 앞에서 한발 더 다가가고,</p>
            <p>해결의 순간까지 함께 머무는 것 —</p>
            <p>그것이 우리가 &apos;내 회사처럼&apos; 일한다는 뜻입니다.</p>
          </div>
          <div className="cards-container" style={{ width: cardSlideWidth }}>
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
                transform: window.innerWidth <= 768
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

      {/* Section 6: Solution 01 - 나침반 배경 + DIRECTION 텍스트 → 마키 카드 */}
      <section ref={solution01Ref} className="motion-section section-solution01">
        <div className="direction-background">
          <img src={compassImg} alt="Compass" />
        </div>
        <h2 className="direction-text">DIRECTION</h2>
        <div className="solution-overlay" />
        <div className="solution-content">
          <span className="solution-label">Solution 01</span>
          <h2 className="solution-title">End-to-End <br className="mobile-br" />Strategic Solution</h2>
          <p className="solution-description">
            세무사의 전문성을 기반으로,<br className="mobile-br" /> 보험·펀드·신탁·법인 재무까지 아우르는<br />
            통합형 실무 트레이닝 시스템을 제공합니다.<br />
            세무사의 판단력과 실행력을 동시에 강화합니다.
          </p>
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
      </section>

      {/* Section 7: Solution 02 - 타임라인 그리드 */}
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

      {/* Section 8: System - highlight 텍스트 + 비디오 + 카드 */}
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
              // 앞뒤에 공백을 모두 넣어서 'DB 와 실전' 사이가 확실히 띄어지도록 처리
              const line3 = " 실전 케이스로 당신의 지식을 ";
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

      {/* Section 9: Teamwork - 헤드라인 → 배경 이미지 → TEAMWORK 텍스트 */}
      <section ref={teamworkRef} className="motion-section section-teamwork">
        <div className="teamwork-background">
          <img src={teamworkImg} alt="Teamwork - People collaborating on ship" />
        </div>
        <div className="teamwork-headline">
          <p>이제는 전문가들과</p>
          <p>함께 협업하는</p>
          <p>팀워크의 시대</p>
        </div>
        <h2 className="teamwork-text">
          <span className="teamwork-text-line">TEAM</span>
          <span className="teamwork-text-line">WORK</span>
        </h2>
      </section>

      {/* Section 10: Experts - 헤드라인 + 슬라이더 */}
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
      </section>

      {/* Section 11: Champagne - 비디오 배경 + 텍스트 */}
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

      {/* Section 12: Cruise - 배경 이미지 + 좌/우 텍스트 */}
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

      {/* Section 13: Final - 마지막 CTA 섹션 */}
      <section ref={finalRef} className="motion-section section-final">
        <div className="final-content">
          <h2 className="final-title">모두가 함께하고 있습니다.</h2>
          <h2 className="final-subtitle">이제, 당신만 오시면 완성됩니다</h2>
          <button className="final-cta">모두컨설팅과 함께하기 &gt;</button>
        </div>
        <Footer />
      </section>
    </div>
  );
};

export default TestMotion;

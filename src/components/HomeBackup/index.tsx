import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/dist/Flip';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Header, { HeaderVariant } from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';

// GSAP Flip 플러그인 등록
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip);
}

// Swiper 스타일
import 'swiper/css';

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
const mainHeroVideo = '/videos/crew.mp4';

// 이미지 경로 (public 폴더)
const binocularsImg = '/images/main/sections/binoculars.jpg';
const compassImg = '/images/main/sections/compass.png';
const teamworkImg = '/images/main/sections/teamwork.jpg';
const cruiseImg = '/images/main/sections/cruise.png';

// 전문가 이미지
const expert1Img = '/images/main/experts/expert1.png';
const expert2Img = '/images/main/experts/expert2.png';
const expert3Img = '/images/main/experts/expert3.png';

// 버튼 이미지
const btnLeftActive = '/images/main/buttons/btn-left-active.png';
const btnLeftInactive = '/images/main/buttons/btn-left-inactive.png';
const btnRightActive = '/images/main/buttons/btn-right-active.png';
const btnRightInactive = '/images/main/buttons/btn-right-inactive.png';

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

// 타임라인 데이터 (Solution 02)
const TIMELINE_STEPS = [
  { step: '01', title: '통합적 관점', tags: ['One-Stop Learning'], cols: 1 },
  { step: '02', title: '실무 중심 커리큘럼', tags: ['Work-ready', '커리큘럼명'], cols: 2 },
  { step: '03', title: '크로스펑셔널 멘토링', tags: ['전문가 네트워크'], cols: 3 },
  { step: '04', title: '프로세스 기반 교육', tags: ['문제 해결 프레임워크', '커리큘럼명'], cols: 3 },
  { step: '05', title: '평가-성과 연계', tags: ['학습 → 실적 전환'], cols: 4 },
  { step: '06', title: '유연한 전달 방식', tags: ['On-Off Line', '하이브리드'], cols: 5, highlight: true },
];

// 전문가 카드 데이터
const EXPERTS_CARDS = [
  { name: '박준서', role: '세무사', quote: '창업 초기부터 성장 단계까지,\n든든한 파트너가 되겠습니다.', image: expert1Img },
  { name: '박준서', role: '세무사', quote: '체계적이고\n신뢰할 수 있는 회계 관리', image: expert2Img },
  { name: '박준서', role: '세무사', quote: '적용할 수 있는 실질적인\n세무 서비스를 제공합니다.', image: expert3Img },
  { name: '박준서', role: '세무사', quote: '창업 초기부터 성장 단계까지,\n든든한 파트너가 되겠습니다.', image: expert1Img },
  { name: '박준서', role: '세무사', quote: '체계적이고\n신뢰할 수 있는 회계 관리', image: expert2Img },
];

const Home: React.FC = () => {
  const [headerVariant, setHeaderVariant] = useState<HeaderVariant>('white');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 카드 슬라이더 상태
  const [cardIndex, setCardIndex] = useState(0);
  const [cardSlideWidth, setCardSlideWidth] = useState(695);
  const [expertsCardIndex, setExpertsCardIndex] = useState(0);
  const [expertsCardSlideWidth, setExpertsCardSlideWidth] = useState(316);

  // 하이라이트 진행률
  const [highlightProgress, setHighlightProgress] = useState(0);
  const [systemHighlightProgress, setSystemHighlightProgress] = useState(0);

  // 슬라이드별 Refs
  const slideRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Hero 확장 애니메이션용 Refs
  const crewPillRef = useRef<HTMLDivElement>(null);
  const visionRowRef = useRef<HTMLDivElement>(null);
  const growthRowRef = useRef<HTMLDivElement>(null);
  const crewRowRef = useRef<HTMLDivElement>(null);

  // 반응형 슬라이드 너비 업데이트
  useEffect(() => {
    const updateSlideWidth = () => {
      const vw = window.innerWidth;
      if (vw <= 768) {
        setCardSlideWidth(316);
        setExpertsCardSlideWidth(252);
      } else if (vw <= 1024) {
        setCardSlideWidth(432);
        setExpertsCardSlideWidth(316);
      } else {
        setCardSlideWidth(695);
        setExpertsCardSlideWidth(316);
      }
    };

    updateSlideWidth();
    window.addEventListener('resize', updateSlideWidth);
    return () => window.removeEventListener('resize', updateSlideWidth);
  }, []);

  // 슬라이드 변경 시 애니메이션 실행
  const handleSlideChange = useCallback((swiper: SwiperType) => {
    const index = swiper.activeIndex;
    setActiveIndex(index);

    // 헤더 색상 업데이트
    if (index === 0) {
      setHeaderVariant('white');
    } else {
      setHeaderVariant('transparent');
    }

    // 현재 슬라이드 요소 가져오기
    const currentSlide = slideRefs.current[index];
    if (!currentSlide) return;

    // 애니메이션 요소들
    const animateElements = currentSlide.querySelectorAll('[data-animate]');

    // 초기 상태로 설정
    gsap.set(animateElements, { opacity: 0, y: 30 });

    // 순차적으로 애니메이션
    gsap.to(animateElements, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
    });

    // 특수 애니메이션 처리
    if (index === 5) {
      // Vision 슬라이드 - 하이라이트 애니메이션
      gsap.to({ progress: 0 }, {
        progress: 100,
        duration: 1,
        ease: 'power1.inOut',
        onUpdate: function () {
          setHighlightProgress(this.targets()[0].progress);
        }
      });
    } else if (index === 9) {
      // System 슬라이드 - 하이라이트 애니메이션
      gsap.to({ progress: 0 }, {
        progress: 100,
        duration: 0.8,
        ease: 'power1.inOut',
        onUpdate: function () {
          setSystemHighlightProgress(this.targets()[0].progress);
        }
      });
    }
  }, []);

  // 첫 슬라이드 초기 애니메이션
  useEffect(() => {
    const firstSlide = slideRefs.current[0];
    if (firstSlide) {
      const animateElements = firstSlide.querySelectorAll('[data-animate]');
      gsap.fromTo(animateElements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.3 }
      );
    }
  }, []);

  // CREW pill 확장 애니메이션 (첫 번째 -> 두 번째 슬라이드 전환 시) - GSAP Flip 사용
  // [Animation Flow]
  // 1. 진입: VISION, GROWTH 등 주변 요소 Fade Out
  // 2. 이동: CREW 캡슐만 화면 정중앙으로 이동
  // 3. 확장: 캡슐이 화면 전체로 확장 (border-radius 펴짐)
  // 4. 텍스트 등장: 오버레이 + 텍스트 순차 Fade Up
  const handleSlideTransitionStart = useCallback((swiper: SwiperType) => {
    // Slide 0 -> Slide 1 로 넘어갈 때
    if (swiper.previousIndex === 0 && swiper.activeIndex === 1) {
      if (!crewPillRef.current) return;

      const pill = crewPillRef.current;
      const nextSlide = slideRefs.current[1];

      // ========== [Stage 1] 주변 요소 Fade Out ==========
      const fadeOutTl = gsap.timeline();

      if (visionRowRef.current) {
        fadeOutTl.to(visionRowRef.current, {
          opacity: 0,
          x: -80,
          duration: 0.4,
          ease: 'power2.out'
        }, 0);
      }

      if (growthRowRef.current) {
        fadeOutTl.to(growthRowRef.current, {
          opacity: 0,
          x: 80,
          duration: 0.4,
          ease: 'power2.out'
        }, 0);
      }

      if (crewRowRef.current) {
        const crewText = crewRowRef.current.querySelector('.hero-text');
        if (crewText) {
          fadeOutTl.to(crewText, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
          }, 0);
        }
      }

      // ========== [Stage 2] CREW 캡슐 화면 중앙으로 이동 ==========
      // 현재 상태 캡처
      const stateBeforeCenter = Flip.getState(pill);

      // 중앙 위치 클래스 부착
      pill.classList.add('is-centered');

      // Flip 애니메이션으로 중앙 이동
      Flip.from(stateBeforeCenter, {
        duration: 0.6,
        ease: 'power2.inOut',
        absolute: true,
        zIndex: 9999,
        onComplete: () => {
          // ========== [Stage 3] 화면 전체로 확장 ==========
          // 중앙 상태 캡처
          const stateBeforeExpand = Flip.getState(pill);

          // 전체 화면 클래스로 변경
          pill.classList.remove('is-centered');
          pill.classList.add('is-fullscreen');

          // Flip 애니메이션으로 확장
          Flip.from(stateBeforeExpand, {
            duration: 0.8,
            ease: 'power3.inOut',
            absolute: true,
            zIndex: 9999,
            onComplete: () => {
              // ========== [Stage 4] 오버레이 + 텍스트 순차 등장 ==========
              if (nextSlide) {
                // 배경 비디오 표시
                const expandingVideo = nextSlide.querySelector('.expanding-video') as HTMLElement;
                if (expandingVideo) {
                  gsap.set(expandingVideo, { opacity: 1, visibility: 'visible' });
                }

                // 텍스트 순차 등장 애니메이션
                const mainTitle = nextSlide.querySelector('.ship-text-animated .main-title') as HTMLElement;
                const subTitle = nextSlide.querySelector('.ship-text-animated .sub-title') as HTMLElement;

                const textTl = gsap.timeline();

                if (mainTitle) {
                  textTl.to(mainTitle, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                  }, 0.2);
                }

                if (subTitle) {
                  textTl.to(subTitle, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                  }, 0.5); // 약간의 시차
                }
              }
            }
          });
        }
      });
    }
  }, []);

  // Slide 1 -> Slide 0 으로 돌아올 때 (원복 로직)
  const handleSlideTransitionEnd = useCallback((swiper: SwiperType) => {
    if (swiper.activeIndex === 0) {
      // 1. 캡슐 상태 원복
      if (crewPillRef.current) {
        crewPillRef.current.classList.remove('is-centered');
        crewPillRef.current.classList.remove('is-fullscreen');
        // Flip으로 인해 남은 인라인 스타일 제거
        gsap.set(crewPillRef.current, { clearProps: 'all' });
      }

      // 2. 주변 텍스트 다시 보이기
      if (visionRowRef.current) gsap.to(visionRowRef.current, { opacity: 1, x: 0, duration: 0.5 });
      if (growthRowRef.current) gsap.to(growthRowRef.current, { opacity: 1, x: 0, duration: 0.5 });
      if (crewRowRef.current) {
        const crewText = crewRowRef.current.querySelector('.hero-text');
        if (crewText) gsap.to(crewText, { opacity: 1, duration: 0.5 });
      }

      // 3. Slide 1의 요소들 초기화
      const nextSlide = slideRefs.current[1];
      if (nextSlide) {
        // 배경 비디오 숨기기
        const expandingVideo = nextSlide.querySelector('.expanding-video') as HTMLElement;
        if (expandingVideo) {
          gsap.set(expandingVideo, { opacity: 0, visibility: 'hidden' });
        }

        // 텍스트 초기 상태로 리셋
        const mainTitle = nextSlide.querySelector('.ship-text-animated .main-title') as HTMLElement;
        const subTitle = nextSlide.querySelector('.ship-text-animated .sub-title') as HTMLElement;

        if (mainTitle) gsap.set(mainTitle, { opacity: 0, y: 30 });
        if (subTitle) gsap.set(subTitle, { opacity: 0, y: 30 });
      }
    }
  }, []);

  return (
    <div className="home-container">
      <Header
        variant={headerVariant}
        onMenuClick={() => setIsMenuOpen(true)}
        isFixed={true}
      />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <Swiper
        direction="vertical"
        slidesPerView={1}
        speed={500}
        mousewheel={{
          sensitivity: 1,
          thresholdDelta: 50,
        }}
        keyboard={{
          enabled: true,
        }}
        modules={[Mousewheel, Keyboard]}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        onSlideChange={handleSlideChange}
        onSlideChangeTransitionStart={handleSlideTransitionStart}
        onSlideChangeTransitionEnd={handleSlideTransitionEnd}
        className="home-swiper"
      >
        {/* Slide 0: Hero 초기 - VISION/GROWTH/CREW */}
        <SwiperSlide>
          <div className="slide-content hero-section hero-initial" ref={(el) => { slideRefs.current[0] = el; }}>
            <div className="hero-content">
              <div className="text-row" data-animate ref={visionRowRef}>
                <div className="video-pill">
                  <video autoPlay muted loop playsInline>
                    <source src={visionVideo} type="video/mp4" />
                  </video>
                </div>
                <h2 className="hero-text">VISION</h2>
              </div>

              <div className="text-row" data-animate ref={growthRowRef}>
                <h2 className="hero-text">GROWTH</h2>
                <div className="video-pill">
                  <video autoPlay muted loop playsInline>
                    <source src={growthVideo} type="video/mp4" />
                  </video>
                </div>
              </div>

              <div className="text-row" data-animate ref={crewRowRef}>
                <div className="video-pill" ref={crewPillRef}>
                  <video autoPlay muted loop playsInline>
                    <source src={crewVideo} type="video/mp4" />
                  </video>
                </div>
                <h2 className="hero-text">CREW</h2>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 1: Hero 비디오 확장 + 텍스트 */}
        <SwiperSlide>
          <div className="slide-content hero-section hero-video" ref={(el) => { slideRefs.current[1] = el; }}>
            <div className="expanding-video">
              <video autoPlay muted loop playsInline className="hero-background-video">
                <source src={mainHeroVideo} type="video/mp4" />
              </video>
              <div className="video-overlay" />
            </div>
            {/* 확장 후 순차적으로 등장할 텍스트 */}
            <div className="ship-text-content ship-text-animated">
              <h1 className="main-title">모두 컨설팅과 함께라면,</h1>
              <h2 className="sub-title">세무사의 항해는<br className="mobile-br" />1등의 여정이 됩니다.</h2>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2: Hero Ship 텍스트 */}
        <SwiperSlide>
          <div className="slide-content hero-section hero-ship" ref={(el) => { slideRefs.current[2] = el; }}>
            <div className="expanding-video">
              <video autoPlay muted loop playsInline className="hero-background-video">
                <source src={mainHeroVideo} type="video/mp4" />
              </video>
              <div className="video-overlay" />
            </div>
            <div className="ship-text-content">
              <h1 className="main-title" data-animate>모두 컨설팅과 함께라면,</h1>
              <h2 className="sub-title" data-animate>세무사의 항해는<br className="mobile-br" />1등의 여정이 됩니다.</h2>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3: Hero Finance */}
        <SwiperSlide>
          <div className="slide-content hero-section hero-finance" ref={(el) => { slideRefs.current[3] = el; }}>
            <div className="finance-overlay">
              <div className="finance-video-background">
                <video autoPlay muted loop playsInline>
                  <source src={financeVideo} type="video/mp4" />
                </video>
              </div>
              <div className="finance-content">
                <div className="left-content" data-animate>
                  <h2 className="finance-title">복잡한 재무의 바다,<br />혼자라면<br />길을 잃기 쉽습니다.</h2>
                </div>
                <div className="right-content" data-animate>
                  <p className="right-title">하지만 함께라면,<br />그 길은 곧<br /><strong>수익의 항로</strong>로 이어집니다.</p>
                  <div className="right-description">보험·펀드·신탁·법인자산관리까지<br />세무사의 전문성을 확장시키는<br />종합 재무설계 트레이닝 플랫폼.<br />배움이 생산성을 만들고,<br />생산성이 곧 자연스러운 수익으로 이어집니다.</div>
                  <p className="right-cta">당신의 첫 항해,<br />지금 함께 시작하세요.</p>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 4: Hero Yacht */}
        <SwiperSlide>
          <div className="slide-content hero-section hero-yacht" ref={(el) => { slideRefs.current[4] = el; }}>
            <div className="yacht-overlay">
              <div className="yacht-video-background">
                <video autoPlay muted loop playsInline>
                  <source src={yachtVideo} type="video/mp4" />
                </video>
              </div>
              <div className="yacht-content" data-animate>
                <h2 className="yacht-title">최고가 되는 공식,<br />우리는 그 답을 알고 있습니다</h2>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 5: Hero Vision */}
        <SwiperSlide>
          <div className="slide-content hero-section hero-vision-slide" ref={(el) => { slideRefs.current[5] = el; }}>
            <div className="vision-content">
              <h2 className="vision-title" data-animate>우리는 단순히<br className="mobile-br" /><span className="nowrap">멀리 보는 것이 아니라,</span><br /><span className="mobile-spacer" />정확히 &apos;어디로<br className="mobile-br" /><span className="nowrap">향해야 하는지&apos; 를 봅니다</span></h2>
              <div className="vision-description" data-animate>
                {(() => {
                  const lines = [
                    "모두컨설팅의 비전은",
                    "세무사의 경쟁력을 현재의 지식이 아닌",
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
                          <span key={currentIndex} className={`highlight-char ${currentIndex < highlightedChars ? 'active' : ''}`}>
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
          </div>
        </SwiperSlide>

        {/* Slide 6: Growth */}
        <SwiperSlide>
          <div className="slide-content growth-section" ref={(el) => { slideRefs.current[6] = el; }}>
            <div className="growth-background">
              <img src={binocularsImg} alt="Binoculars looking at the sea" />
            </div>
            <div className="growth-overlay" />
            <div className="growth-content">
              <div className="growth-left-content" data-animate>
                <div className="growth-main-title">
                  <p>Thinking like</p>
                  <p>your company.</p>
                  <p>Acting as your partner.</p>
                </div>
                <div className="growth-description">
                  <p>고객의 성장은 우리의 성장입니다.</p>
                  <p>고객의 어려움 앞에서 한발 더 다가가고,</p>
                  <p>해결의 순간까지 함께 머무는 것 —</p>
                  <p>그것이 우리가 &apos;내 회사처럼&apos; 일한다는 뜻입니다.</p>
                </div>
              </div>
              <div className="cards-container" data-animate>
                <div className="cards-navigation">
                  <button
                    className="nav-button"
                    disabled={cardIndex === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardIndex(Math.max(0, cardIndex - 1));
                    }}
                  >
                    <img src={cardIndex === 0 ? btnLeftInactive : btnLeftActive} alt="Previous" />
                  </button>
                  <button
                    className="nav-button"
                    disabled={cardIndex >= SERVICE_CARDS.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardIndex(Math.min(SERVICE_CARDS.length - 1, cardIndex + 1));
                    }}
                  >
                    <img src={cardIndex >= SERVICE_CARDS.length - 1 ? btnRightInactive : btnRightActive} alt="Next" />
                  </button>
                </div>
                <div className="cards-wrapper" style={{ transform: `translateX(-${cardIndex * cardSlideWidth}px)` }}>
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
          </div>
        </SwiperSlide>

        {/* Slide 7: Direction */}
        <SwiperSlide>
          <div className="slide-content direction-section" ref={(el) => { slideRefs.current[7] = el; }}>
            <div className="direction-background">
              <img src={compassImg} alt="Compass" />
            </div>
            <div className="solution-overlay" />
            <div className="solution-content">
              <span className="solution-label" data-animate>Solution 01</span>
              <h2 className="solution-title" data-animate>End-to-End<br className="mobile-br" />Strategic Solution</h2>
              <p className="solution-description" data-animate>
                세무사의 전문성을 기반으로,<br className="mobile-br" /> 보험·펀드·신탁·법인 재무까지 아우르는<br />
                통합형 실무 트레이닝 시스템을 제공합니다.<br />
                세무사의 판단력과 실행력을 동시에 강화합니다.
              </p>
              <div className="solution-grid solution-grid-left" data-animate>
                <div className="solution-marquee-wrapper">
                  {[...SOLUTION_ROW1, ...SOLUTION_ROW1].map((card, index) => (
                    <div className="solution-card" key={index}>
                      <h4 className="solution-card-title" style={{ whiteSpace: 'pre-line' }}>{card.title}</h4>
                      <ul className="solution-card-items">
                        {card.items.map((item, i) => (<li key={i}>{item}</li>))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="solution-grid solution-grid-right" data-animate>
                <div className="solution-marquee-wrapper">
                  {[...SOLUTION_ROW2, ...SOLUTION_ROW2].map((card, index) => (
                    <div className="solution-card" key={index}>
                      <h4 className="solution-card-title" style={{ whiteSpace: 'pre-line' }}>{card.title}</h4>
                      <ul className="solution-card-items">
                        {card.items.map((item, i) => (<li key={i}>{item}</li>))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="solution-grid solution-grid-left" data-animate>
                <div className="solution-marquee-wrapper">
                  {[...SOLUTION_ROW3, ...SOLUTION_ROW3].map((card, index) => (
                    <div className="solution-card" key={index}>
                      <h4 className="solution-card-title" style={{ whiteSpace: 'pre-line' }}>{card.title}</h4>
                      <ul className="solution-card-items">
                        {card.items.map((item, i) => (<li key={i}>{item}</li>))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="solution-grid solution-grid-right" data-animate>
                <div className="solution-marquee-wrapper">
                  {[...SOLUTION_ROW4, ...SOLUTION_ROW4].map((card, index) => (
                    <div className="solution-card" key={index}>
                      <h4 className="solution-card-title" style={{ whiteSpace: 'pre-line' }}>{card.title}</h4>
                      <ul className="solution-card-items">
                        {card.items.map((item, i) => (<li key={i}>{item}</li>))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 8: Solution 02 */}
        <SwiperSlide>
          <div className="slide-content solution02-section" ref={(el) => { slideRefs.current[8] = el; }}>
            <div className="solution02-background" />
            <div className="solution02-content">
              <span className="solution02-label" data-animate>Solution 02</span>
              <h2 className="solution02-title" data-animate>Integrated Strategic Solution</h2>
              <p className="solution02-description" data-animate>
                고객의 여정을 처음부터 끝까지 함께하며, 완전한 수익 창출 솔루션을 제시합니다.
              </p>

              <div className="timeline-container" data-animate>
                <div className="timeline-grid">
                  {/* 컬럼 헤더 */}
                  <div className="timeline-header">
                    {[1, 2, 3, 4, 5].map((num, index) => (
                      <div key={index} className="timeline-column-header">
                        DAY 0{num}
                      </div>
                    ))}
                  </div>

                  {/* 세로 구분선 */}
                  <div className="timeline-edge-line timeline-edge-left" />
                  <div className="timeline-edge-line timeline-edge-right" />
                  <div className="timeline-columns">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <div key={index} className="timeline-column-line" />
                    ))}
                  </div>

                  {/* 타임라인 스텝들 */}
                  <div className="timeline-steps">
                    {TIMELINE_STEPS.map((step, index) => (
                      <div
                        key={index}
                        className={`timeline-step timeline-step-${index + 1}`}
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
                              className={`step-tag ${step.highlight && tagIndex === step.tags.length - 1 ? 'highlight' : ''}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 9: System */}
        <SwiperSlide>
          <div className="slide-content system-section" ref={(el) => { slideRefs.current[9] = el; }}>
            <div className="system-background" />

            <div className="system-main-content" data-animate>
              <h3 className="system-headline">
                가장 짧은 시간에<br className="mobile-br" /> 가장 빠른 속도로<br />
                본업의 성장과<br className="mobile-br" /> 소득 증대 시스템 구축
              </h3>

              <p className="system-description">
                {(() => {
                  const line1 = "모두 컨설팅은 전문직 맞춤형 법인 ";
                  const dbText = "DB";
                  const line2 = "와";
                  const line3 = "실전 케이스로 당신의 지식을";
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

            <div className="system-video-container" data-animate>
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

            <div className="system-cards" data-animate>
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
          </div>
        </SwiperSlide>

        {/* Slide 10: Teamwork */}
        <SwiperSlide>
          <div className="slide-content teamwork-section" ref={(el) => { slideRefs.current[10] = el; }}>
            <div className="teamwork-background">
              <img src={teamworkImg} alt="Teamwork - People collaborating on ship" />
            </div>

            <h2 className="teamwork-text" data-animate>
              <span className="teamwork-text-line">TEAM</span>
              <span className="teamwork-text-line">WORK</span>
            </h2>
          </div>
        </SwiperSlide>

        {/* Slide 11: Experts */}
        <SwiperSlide>
          <div className="slide-content experts-section" ref={(el) => { slideRefs.current[11] = el; }}>
            <div className="experts-headline" data-animate>
              <h2>세무사·회계사·노무사·변호사 등</h2>
              <h2>각 분야의 전문가들과 협업하여</h2>
              <h2>입체적인 재무 설계 솔루션을</h2>
              <h2>제공합니다.</h2>
            </div>

            <div className="experts-desc" data-animate>
              <p>
                VIP 고객은 이제 단편적 자문이 아니라<br />
                다각적 전략 컨설팅을 원합니다.<br />
                모두컨설팅은 이 시대의 요구에 맞는<br />
                &apos;팀 단위의 항해&apos; 플랫폼을 제공합니다.
              </p>
            </div>

            <div className="experts-nav" data-animate>
              <button
                className="nav-button"
                disabled={expertsCardIndex === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpertsCardIndex(Math.max(0, expertsCardIndex - 1));
                }}
              >
                <img src={expertsCardIndex === 0 ? btnLeftInactive : btnLeftActive} alt="Previous" />
              </button>
              <button
                className="nav-button"
                disabled={expertsCardIndex >= EXPERTS_CARDS.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpertsCardIndex(Math.min(EXPERTS_CARDS.length - 1, expertsCardIndex + 1));
                }}
              >
                <img src={expertsCardIndex >= EXPERTS_CARDS.length - 1 ? btnRightInactive : btnRightActive} alt="Next" />
              </button>
            </div>

            <div className="experts-cards" data-animate>
              <div
                className="experts-cards-wrapper"
                style={{ transform: `translateX(-${expertsCardIndex * expertsCardSlideWidth}px)` }}
              >
                {EXPERTS_CARDS.map((expert, index) => (
                  <div className="expert-card" key={index}>
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
          </div>
        </SwiperSlide>

        {/* Slide 12: Champagne */}
        <SwiperSlide>
          <div className="slide-content champagne-section" ref={(el) => { slideRefs.current[12] = el; }}>
            <video
              className="champagne-video"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={champagneVideo} type="video/mp4" />
            </video>
            <div className="champagne-content" data-animate>
              <h2>입증된 전문성,</h2>
              <h2>성과로 이어지는 수익 구조</h2>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 13: Cruise */}
        <SwiperSlide>
          <div className="slide-content cruise-section" ref={(el) => { slideRefs.current[13] = el; }}>
            <div className="cruise-background">
              <img src={cruiseImg} alt="Cruise ship at sunset" />
            </div>
            <div className="cruise-left-text" data-animate>
              <p>모두컨설팅은</p>
              <p>누적된 실적, 데이터,</p>
              <p>네트워크를 기반으로</p>
            </div>
            <div className="cruise-right-text" data-animate>
              <p>당신의 브랜드를</p>
              <p>&apos;1등 세무사&apos;로 완성합니다</p>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 14: Final */}
        <SwiperSlide>
          <div className="slide-content final-section" ref={(el) => { slideRefs.current[14] = el; }}>
            <div className="final-content">
              <h2 className="final-title" data-animate>모두가 함께하고 있습니다.</h2>
              <h2 className="final-subtitle" data-animate>이제, 당신만 오시면 완성됩니다</h2>
              <button className="final-cta" data-animate>모두컨설팅과 함께하기 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8.85156 5L16.0016 11.5L8.85156 18" stroke="#2D2D2D" stroke-width="1.6" stroke-linecap="round" />
              </svg></button>
            </div>
            <Footer />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Home;

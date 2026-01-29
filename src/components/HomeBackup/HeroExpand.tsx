import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from './HeroExpand.module.scss';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const HeroExpand = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pillMainRef = useRef<HTMLDivElement>(null);
  const otherPillsRef = useRef<HTMLDivElement[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !pillMainRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=2000', // Adjust scroll distance as needed
        scrub: 1,
        pin: true,
        // markers: true, // Remove in production
      },
    });

    // 1. Expand the main pill
    tl.to(pillMainRef.current, {
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
      duration: 1,
      ease: 'power2.inOut',
    }, 0);

    // 2. Move/Fade out other pills
    otherPillsRef.current.forEach((pill, index) => {
        if(pill) {
             tl.to(pill, {
                opacity: 0,
                x: index < 1 ? -200 : 200, // Move left or right depending on position
                duration: 0.5,
                ease: 'power2.out'
            }, 0);
        }
    });
    
    // 3. Optional: Content fade in after expansion
    tl.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
    }, 0.8);


  }, { scope: containerRef });

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !otherPillsRef.current.includes(el)) {
      otherPillsRef.current.push(el);
    }
  };

  return (
    <section ref={containerRef} className={styles.container}>
      <div ref={wrapperRef} className={styles.pillWrapper}>
        {/* Left Pill (Decorative) */}
        <div ref={addToRefs} className={styles.pill}>
             {/* Semantic placeholder */}
        </div>

        {/* Center Main Pill (Expands) */}
        <div ref={pillMainRef} className={`${styles.pill} ${styles.pillMain}`}>
           {/* In a real app, use <Image> or <video> here */}
           {/* For now using CSS gradient in module */}
           <div ref={contentRef} className={styles.content}>
             <h1 className={styles.headline}>GLOBAL LEADER</h1>
             <p className={styles.subheadline}>Smart Logistics Solution</p>
           </div>
        </div>

         {/* Right Pill (Decorative) */}
        <div ref={addToRefs} className={styles.pill}>
             {/* Semantic placeholder */}
        </div>
      </div>
    </section>
  );
};

export default HeroExpand;

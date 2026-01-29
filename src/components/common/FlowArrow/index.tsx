import React from 'react';
import styles from './styles.module.scss';

export type ArrowDirection = 'right' | 'down';
export type ArrowStyle = 'single' | 'double';

export interface FlowArrowProps {
  /** 화살표 방향 */
  direction?: ArrowDirection;
  /** 화살표 스타일 */
  style?: ArrowStyle;
  /** 너비 (px) */
  width?: number;
  /** 클래스명 */
  className?: string;
}

/**
 * FlowArrow 컴포넌트
 * 플로우차트에서 사용되는 화살표 요소
 */
const FlowArrow: React.FC<FlowArrowProps> = ({
  direction = 'right',
  style: arrowStyle = 'single',
  width = 40,
  className = '',
}) => {
  const containerClass = [
    styles.arrowContainer,
    styles[`direction-${direction}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerStyle = {
    width: direction === 'right' ? `${width}px` : '100%',
    height: direction === 'down' ? `${width}px` : 'auto',
  };

  if (arrowStyle === 'single') {
    return (
      <div className={containerClass} style={containerStyle}>
        {direction === 'right' ? (
          // 오른쪽 화살표
          <svg
            width="100%"
            height="7"
            viewBox="0 0 40 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 3.46094H38.5M38.5 3.46094L35.5 0.460938M38.5 3.46094L35.5 6.46094"
              stroke="white"
              strokeOpacity="0.3"
            />
          </svg>
        ) : (
          // 아래쪽 화살표
          <svg
            width="7"
            height="100%"
            viewBox="0 0 7 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M3.46094 0V38.5M3.46094 38.5L0.460938 35.5M3.46094 38.5L6.46094 35.5"
              stroke="white"
              strokeOpacity="0.3"
            />
          </svg>
        )}
      </div>
    );
  }

  // Double arrow (with dots)
  return (
    <div className={containerClass} style={containerStyle}>
      <div className={styles.doubleLine}>
        <div className={styles.line} />
        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <div className={styles.line} />
      </div>
    </div>
  );
};

export default FlowArrow;





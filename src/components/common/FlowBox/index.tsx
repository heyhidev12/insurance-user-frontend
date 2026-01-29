import React from 'react';
import styles from './styles.module.scss';

export type FlowBoxVariant = 'primary' | 'secondary' | 'tertiary' | 'result';
export type FlowBoxSize = 'small' | 'medium' | 'large' | 'auto';

export interface FlowBoxProps {
  /** 텍스트 내용 */
  children: React.ReactNode;
  /** 박스 스타일 변형 */
  variant?: FlowBoxVariant;
  /** 박스 크기 */
  size?: FlowBoxSize;
  /** 고정 너비 (px) */
  width?: number;
  /** 클래스명 */
  className?: string;
}

/**
 * FlowBox 컴포넌트
 * 플로우차트에서 사용되는 박스 요소
 */
const FlowBox: React.FC<FlowBoxProps> = ({
  children,
  variant = 'tertiary',
  size = 'auto',
  width,
  className = '',
}) => {
  const boxClass = [
    styles.flowBox,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style = width ? { width: `${width}px` } : undefined;

  return (
    <div className={boxClass} style={style}>
      <span className={styles.text}>{children}</span>
    </div>
  );
};

export default FlowBox;





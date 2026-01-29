import React from 'react';
import styles from './styles.module.scss';

export interface FlowRowProps {
  /** 플로우 행 내용 */
  children: React.ReactNode;
  /** 배경색 사용 여부 */
  background?: boolean;
  /** 클래스명 */
  className?: string;
}

/**
 * FlowRow 컴포넌트
 * 플로우차트의 한 행을 나타내는 컴포넌트
 */
const FlowRow: React.FC<FlowRowProps> = ({
  children,
  background = false,
  className = '',
}) => {
  const rowClass = [
    styles.flowRow,
    background && styles.withBackground,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={rowClass}>{children}</div>;
};

export default FlowRow;





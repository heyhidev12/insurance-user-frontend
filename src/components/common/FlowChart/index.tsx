import React from 'react';
import styles from './styles.module.scss';

export interface FlowChartProps {
  /** 플로우차트 내용 */
  children: React.ReactNode;
  /** 클래스명 */
  className?: string;
}

/**
 * FlowChart 컴포넌트
 * 플로우차트 전체를 감싸는 컨테이너
 */
const FlowChart: React.FC<FlowChartProps> = ({ children, className = '' }) => {
  return <div className={`${styles.flowChart} ${className}`}>{children}</div>;
};

export default FlowChart;





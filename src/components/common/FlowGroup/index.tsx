import React from 'react';
import styles from './styles.module.scss';

export interface FlowGroupProps {
  /** 플로우 그룹 내용 */
  children: React.ReactNode;
  /** 배경 스타일 */
  background?: 'dark' | 'none';
  /** 클래스명 */
  className?: string;
}

/**
 * FlowGroup 컴포넌트
 * 플로우 요소들을 그룹화하는 컴포넌트
 */
const FlowGroup: React.FC<FlowGroupProps> = ({
  children,
  background = 'none',
  className = '',
}) => {
  const groupClass = [
    styles.flowGroup,
    background === 'dark' && styles.darkBackground,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={groupClass}>{children}</div>;
};

export default FlowGroup;





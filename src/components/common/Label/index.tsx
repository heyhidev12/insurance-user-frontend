import React from 'react';
import './styles.scss';

export type LabelColor = 'skyblue' | 'navy' | 'gray' | 'red' | 'white';
export type LabelSize = 's' | 'm';

export interface LabelProps {
  /** 라벨 색상 */
  color?: LabelColor;
  /** 라벨 크기 */
  size?: LabelSize;
  /** 라벨 텍스트 */
  children: React.ReactNode;
  /** 클래스명 */
  className?: string;
}

/**
 * Label 컴포넌트
 * 상태 표시용 라벨/뱃지
 */
const Label: React.FC<LabelProps> = ({
  color = 'skyblue',
  size = 's',
  children,
  className = '',
}) => {
  return (
    <div className={`label label--${color} label--${size} ${className}`}>
      <span className="label__text">{children}</span>
    </div>
  );
};

export default Label;

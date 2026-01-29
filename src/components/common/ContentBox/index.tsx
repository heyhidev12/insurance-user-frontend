import React from 'react';
import styles from './styles.module.scss';

export interface ContentBoxProps {
  /** 박스 제목 */
  title?: string;
  /** 박스 내용 */
  children: React.ReactNode;
  /** 클래스명 */
  className?: string;
}

/**
 * ContentBox 컴포넌트
 * 체크포인트, 함께 실행방안, 케이스 섹션의 콘텐츠를 담는 박스
 */
const ContentBox: React.FC<ContentBoxProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`${styles.contentBox} ${className}`}>
      {title && (
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      )}
      <div className={styles.contentSection}>{children}</div>
    </div>
  );
};

export default ContentBox;


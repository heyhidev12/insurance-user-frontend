import React from 'react';
import './styles.scss';

export interface ImageCardProps {
  /** 이미지 소스 */
  imageSrc: string;
  /** 타이틀 텍스트 */
  title?: string;
  /** 비활성화 (오버레이 적용) */
  disabled?: boolean;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 클래스명 */
  className?: string;
  /** 이미지 대체 텍스트 */
  alt?: string;
}

/**
 * ImageCard 컴포넌트
 * 이미지와 타이틀이 있는 카드
 */
const ImageCard: React.FC<ImageCardProps> = ({
  imageSrc,
  title = '든든한 동반자',
  disabled = false,
  onClick,
  className = '',
  alt = '',
}) => {
  return (
    <div
      className={`image-card ${disabled ? 'image-card--disabled' : ''} ${onClick ? 'image-card--clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <p className="image-card__title">{title}</p>
      <div className="image-card__image-container">
        <img
          src={imageSrc}
          alt={alt || title}
          className="image-card__image"
        />
        {disabled && <div className="image-card__overlay" />}
      </div>
    </div>
  );
};

export default ImageCard;

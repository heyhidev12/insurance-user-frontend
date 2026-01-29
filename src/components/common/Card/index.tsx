import React from 'react';

export type CardVariant =
  | 'column'      // 기본: 이미지 + 제목 + 날짜
  | 'column2'     // 카테고리 포함: 이미지 + 카테고리 + 제목 + 작성자·날짜
  | 'column3'     // 설명 포함: 이미지 + 카테고리 + 제목 + 설명 + 작성자·날짜
  | 'education'   // 교육 카드: 이미지 + 라벨들 + 제목 + 위치 + 교육일정
  | 'youtube'     // 유튜브: 이미지 + 날짜(위) + 제목
  | 'horizontal'  // 가로형: 이미지 왼쪽 + 내용 오른쪽
  | 'profile'     // 프로필: 사진 + 이름/직책 + 연락처 + 태그들
  | 'testimonial'; // 인용 프로필: 이미지 배경 + 인용문 + 이름|직책

export type CardSize = 'web' | 'mobile';

export interface CardLabel {
  text: string;
  color?: 'red' | 'white' | 'gray';
}

export interface ProfileTag {
  label: string;
  level: string; // "■■■" 같은 형태
}

export interface CardProps {
  // 공통
  title: string;
  imageUrl?: string;
  variant?: CardVariant;
  size?: CardSize;
  onClick?: () => void;
  className?: string;

  // 날짜/작성자 관련
  date?: string;
  author?: string;

  // 카테고리 (column2, column3, horizontal)
  category?: string;

  // 설명 (column3, horizontal)
  description?: string;

  // 교육 카드 전용
  labels?: CardLabel[];
  location?: string;
  schedule?: string;

  // 프로필 카드 전용
  position?: string;  // 직책
  tel?: string;
  email?: string;
  tags?: ProfileTag[];

  // 인용 프로필 카드 전용
  quote?: string;
}

// 캘린더 아이콘 SVG
const CalendarIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.61621 8.51748V3.74034C2.61621 3.25919 3.00626 2.86914 3.48741 2.86914H12.833C13.3142 2.86914 13.7042 3.25919 13.7042 3.74034V13.2946C13.7042 13.7758 13.3142 14.1658 12.833 14.1658H3.48762C3.00639 14.1658 2.61631 13.7756 2.61643 13.2944L2.61781 7.63916" stroke="#D8D8D8" strokeWidth="0.8" strokeMiterlimit="10"/>
    <path d="M13.7042 6.28027H2.61621" stroke="#D8D8D8" strokeWidth="0.8" strokeMiterlimit="10"/>
    <path d="M5.61328 1.31445V4.25579" stroke="#D8D8D8" strokeWidth="0.8" strokeMiterlimit="10"/>
    <path d="M10.7041 1.31445V4.25579" stroke="#D8D8D8" strokeWidth="0.8" strokeMiterlimit="10"/>
  </svg>
);

// 구분점 컴포넌트
const Dot: React.FC = () => (
  <span className="card__dot" />
);

// 인용 아이콘 SVG
const QuoteIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.06897 11.681C7.06897 12.5638 6.7931 13.2259 6.24138 13.7776C5.68966 14.3293 5.02759 14.55 4.25517 14.55C3.26207 14.55 2.48965 14.1638 1.88276 13.3914C1.27586 12.619 1 11.7362 1 10.6328C1 8.7569 1.44138 7.04655 2.43448 5.44655C3.42759 3.84655 4.69655 2.63276 6.24138 1.75L6.90345 2.63276C5.96552 3.23966 5.13793 4.06724 4.47586 5.06034C3.81379 6.10862 3.42759 7.10172 3.37241 8.09483C3.15172 8.86724 3.31724 9.19828 3.86897 9.08793C4.03448 9.03276 4.2 8.97759 4.36552 8.97759H4.86207C5.46897 9.08793 5.96552 9.41897 6.4069 9.86035C6.84828 10.3569 7.06897 10.9638 7.06897 11.681ZM15.3448 11.681C15.3448 12.5638 15.069 13.2259 14.5172 13.7776C13.9655 14.3293 13.3034 14.55 12.531 14.55C11.5379 14.55 10.7655 14.1638 10.1586 13.3914C9.49655 12.619 9.22069 11.7362 9.22069 10.6328C9.22069 8.81207 9.71724 7.10172 10.7103 5.44655C11.7035 3.84655 12.9724 2.63276 14.5172 1.75L15.1793 2.63276C14.2414 3.23966 13.4138 4.06724 12.7517 5.06034C12.0897 6.10862 11.7035 7.10172 11.5931 8.09483C11.4276 8.81207 11.5931 9.14311 12.1448 9.08793C12.2552 9.03276 12.4207 8.97759 12.5862 8.97759H13.1379C13.7448 9.08793 14.2414 9.41897 14.6828 9.86035C15.1241 10.3569 15.3448 10.9638 15.3448 11.681Z" fill="white"/>
  </svg>
);

const Card: React.FC<CardProps> = ({
  title,
  imageUrl,
  variant = 'column',
  size = 'web',
  onClick,
  className = '',
  date,
  author,
  category,
  description,
  labels,
  location,
  schedule,
  position,
  tel,
  email,
  tags,
  quote,
}) => {
  // 프로필 카드
  if (variant === 'profile') {
    return (
      <article
        className={`card card--profile card--${size} ${className}`}
        onClick={onClick}
      >
        <div className="card__image-wrapper">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="card__image" />
          ) : (
            <div className="card__image-placeholder" />
          )}
        </div>
        <div className="card__content">
          <div className="card__profile-info">
            <div className="card__profile-header">
              <h3 className="card__profile-name">{title}</h3>
              {position && <span className="card__profile-position">{position}</span>}
            </div>
            <div className="card__profile-contact">
              {tel && (
                <div className="card__profile-row">
                  <span className="card__profile-label">TEL</span>
                  <span className="card__profile-value">{tel}</span>
                </div>
              )}
              {email && (
                <div className="card__profile-row">
                  <span className="card__profile-label">EMAIL</span>
                  <span className="card__profile-value">{email}</span>
                </div>
              )}
            </div>
          </div>
          {tags && tags.length > 0 && (
            <div className="card__profile-tags">
              {tags.map((tag, index) => (
                <span key={index} className="card__profile-tag">
                  {tag.label} {tag.level}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    );
  }

  // 인용 프로필 카드 (testimonial)
  if (variant === 'testimonial') {
    return (
      <article
        className={`card card--testimonial card--${size} ${className}`}
        onClick={onClick}
      >
        <div className="card__testimonial-bg">
          {imageUrl && (
            <img src={imageUrl} alt={title} className="card__testimonial-image" />
          )}
          <div className="card__testimonial-overlay" />
        </div>
        <div className="card__testimonial-content">
          <div className="card__testimonial-quote-section">
            <QuoteIcon />
            {quote && <p className="card__testimonial-quote">{quote}</p>}
          </div>
          <div className="card__testimonial-author">
            <span className="card__testimonial-name">{title}</span>
            <span className="card__testimonial-divider" />
            {position && <span className="card__testimonial-position">{position}</span>}
          </div>
        </div>
      </article>
    );
  }

  // 가로형 카드
  if (variant === 'horizontal') {
    return (
      <article
        className={`card card--horizontal card--${size} ${className}`}
        onClick={onClick}
      >
        <div className="card__image-wrapper">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="card__image" />
          ) : (
            <div className="card__image-placeholder" />
          )}
        </div>
        <div className="card__content">
          {category && <p className="card__category">{category}</p>}
          <h3 className="card__title">{title}</h3>
          {description && <p className="card__description">{description}</p>}
          <div className="card__meta">
            {author && <span className="card__author">{author}</span>}
            {author && date && <Dot />}
            {date && <span className="card__date">{date}</span>}
          </div>
        </div>
      </article>
    );
  }

  // 세로형 카드들 (column, column2, column3, education, youtube)
  return (
    <article
      className={`card card--${variant} card--${size} ${className}`}
      onClick={onClick}
    >
      <div className="card__image-wrapper">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="card__image" />
        ) : (
          <div className="card__image-placeholder" />
        )}
      </div>
      <div className="card__content">
        {/* YouTube: 날짜가 위에 */}
        {variant === 'youtube' && date && (
          <p className="card__date card__date--top">{date}</p>
        )}

        {/* Education: 라벨들 */}
        {variant === 'education' && labels && labels.length > 0 && (
          <div className="card__labels">
            {labels.map((label, index) => (
              <span
                key={index}
                className={`card__label card__label--${label.color || 'white'}`}
              >
                {label.text}
              </span>
            ))}
          </div>
        )}

        {/* Column2, Column3: 카테고리 */}
        {(variant === 'column2' || variant === 'column3') && category && (
          <p className="card__category">{category}</p>
        )}

        {/* 제목 */}
        <h3 className="card__title">{title}</h3>

        {/* Column3: 설명 */}
        {variant === 'column3' && description && (
          <p className="card__description">{description}</p>
        )}

        {/* Education: 위치 */}
        {variant === 'education' && location && (
          <p className="card__location">{location}</p>
        )}

        {/* Education: 교육일정 */}
        {variant === 'education' && schedule && (
          <div className="card__schedule">
            <CalendarIcon />
            <span>{schedule}</span>
          </div>
        )}

        {/* Column, Column2, Column3: 날짜/작성자 (하단) */}
        {variant !== 'youtube' && variant !== 'education' && (
          <div className="card__meta">
            {author && <span className="card__author">{author}</span>}
            {author && date && <Dot />}
            {date && <span className="card__date">{date}</span>}
          </div>
        )}
      </div>
    </article>
  );
};

export default Card;

import React from 'react';
// styles는 _app.tsx에서 import됨

export type TabStyle = 'fill' | 'box' | 'line' | 'menu';
export type TabSize = 'small' | 'medium' | 'large';

export interface TabItem {
  id: string;
  label: string;
}

export interface TabProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  style?: TabStyle;
  size?: TabSize;
  showActiveDot?: boolean;
  className?: string;
  fullWidth?: boolean;
}

// 화살표 아이콘 SVG
const ArrowIcon: React.FC<{ color?: string }> = ({ color = '#555' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.25 15.25L12.75 10.25L7.25 5.25" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const Tab: React.FC<TabProps> = ({
  items,
  activeId,
  onChange,
  style = 'box',
  size = 'medium',
  showActiveDot = true,
  className = '',
  fullWidth = false,
}) => {
  // box, line, menu 스타일에서 dot 표시
  const shouldShowDot = showActiveDot && (style === 'box' || style === 'line' || style === 'menu');

  return (
    <div
      className={`tab tab--${style} tab--${size} ${fullWidth ? 'tab--full-width' : ''} ${className}`}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            className={`tab__item ${isActive ? 'tab__item--active' : ''}`}
            onClick={() => onChange(item.id)}
            type="button"
          >
            <div className="tab__content">
              {shouldShowDot && isActive && (
                <span className="tab__dot" />
              )}
              <span className="tab__label">{item.label}</span>
            </div>
            {style === 'menu' && (
              <ArrowIcon color={isActive ? '#fff' : '#555'} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tab;

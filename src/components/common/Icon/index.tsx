import React from 'react';
// styles는 _app.tsx에서 import됨

export type IconSize = 16 | 20 | 24 | 40 | 48;

export type IconType =
  // Check icons
  | 'check'
  | 'check-gray'
  | 'check-white'
  | 'check-blue'
  | 'check-gray-light'
  // Close icons
  | 'close'
  | 'close-white'
  | 'circle-close'
  // Search
  | 'search'
  // User icons
  | 'user'
  | 'user-white'
  // Arrows (chevron style)
  | 'arrow-up'
  | 'arrow-up-white'
  | 'arrow-down'
  | 'arrow-down-white'
  | 'arrow-right'
  | 'arrow-right-gray'
  | 'arrow-right-white'
  | 'arrow-left'
  | 'arrow-left-gray'
  | 'arrow-left-white'
  // Chevron (dropdown style)
  | 'chevron-down'
  | 'chevron-down-white'
  // Arrow with line (navigation)
  | 'arrow-left2-green'
  | 'arrow-left2-gray'
  | 'arrow-left2-white'
  | 'arrow-right2-green'
  | 'arrow-right2-gray'
  | 'arrow-right2-white'
  // Plus & Minus
  | 'plus'
  | 'plus-gray'
  | 'minus'
  | 'minus-gray'
  // Document & Write
  | 'document'
  | 'download'
  | 'download-white'
  | 'vcard'
  | 'pdf'
  | 'share'
  | 'resume'
  // Eye
  | 'eye'
  | 'eye-white'
  // List
  | 'list-white'
  | 'list-green'
  // Info/Status
  | 'info'
  | 'info-gray'
  | 'error'
  | 'error-white'
  // Contact/Location
  | 'call'
  | 'location'
  | 'mail'
  | 'map'
  | 'map-green'
  | 'calendar'
  | 'calendar-white'
  // Large icons (40px)
  | 'menu'
  | 'menu-white'
  | 'add'
  | 'add-white'
  | 'close-large'
  | 'close-large-white';

export interface IconProps {
  type: IconType;
  size?: IconSize;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ type, size = 24, className = '', onClick, style }) => {
  // 40px 아이콘들
  const is40pxIcon = ['menu', 'menu-white', 'add', 'add-white', 'close-large', 'close-large-white'].includes(type);
  // 16px 전용 아이콘들
  const is16pxIcon = ['info', 'info-gray', 'error', 'map', 'map-green', 'calendar'].includes(type);
  // 20px 전용 아이콘들
  const is20pxIcon = ['arrow-up', 'arrow-up-white', 'arrow-down', 'arrow-down-white', 'arrow-right', 'arrow-right-gray', 'arrow-left', 'arrow-left-gray', 'chevron-down', 'chevron-down-white', 'check', 'check-gray', 'check-white', 'check-blue', 'check-gray-light', 'plus', 'plus-gray', 'minus', 'minus-gray', 'call', 'location', 'mail', 'document', 'download', 'download-white', 'error-white', 'search', 'vcard', 'pdf', 'share', 'resume'].includes(type);
  // 24px 전용 아이콘들 (arrow-right2 시리즈)
  const is24pxIcon = ['arrow-right2-gray', 'arrow-right2-white', 'arrow-right2-green', 'arrow-left2-gray', 'arrow-left2-white', 'arrow-left2-green'].includes(type);

  const getViewBox = () => {
    if (is40pxIcon) return '0 0 40 40';
    if (is24pxIcon) return '0 0 24 24';
    if (is16pxIcon) return '0 0 16 16';
    // location, call, mail 아이콘은 18x18 viewBox 사용
    if (['location', 'call', 'mail'].includes(type)) return '0 0 18 18';
    if (is20pxIcon) return '0 0 20 20';
    return '0 0 20 20';
  };

  const renderIcon = () => {
    switch (type) {
      // Check icons (20px viewBox)
      case 'check':
        return (
          <path d="M15.8869 5.99998L8.62897 13.2577L5 9.62885" stroke="#151515" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        );
      case 'check-gray':
        return (
          <path d="M15.8869 5.99998L8.62897 13.2577L5 9.62885" stroke="#8E8E8E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        );
      case 'check-white':
        return (
          <path d="M15.8869 5.99998L8.62897 13.2577L5 9.62885" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        );
      case 'check-blue':
        return (
          <path d="M15.8869 6L8.62897 13.2577L5 9.62886" stroke="#94B9E3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        );
      case 'check-gray-light':
        return (
          <path d="M15.8869 5.99999L8.62897 13.2577L5 9.62885" stroke="#717171" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        );

      // Close icons
      case 'close':
        return (
          <>
            <path d="M11.6499 0.649994L1.0794 11.2205" stroke="#2D2D2D" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M0.649902 0.649994L11.2204 11.2205" stroke="#2D2D2D" strokeWidth="1.3" strokeLinecap="round"/>
          </>
        );
      case 'close-white':
        return (
          <>
            <path d="M11.6499 0.649994L1.0794 11.2205" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M0.649902 0.649994L11.2204 11.2205" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
          </>
        );
      case 'circle-close':
        return (
          <>
            <circle cx="9" cy="9" r="9" fill="#555555"/>
            <path d="M6.41016 11.69L11.6902 6.41003" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M6.40945 6.41003L11.6895 11.69" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          </>
        );

      // Search (20px viewBox)
      case 'search':
        return (
          <>
            <path d="M6.58325 12.5002C9.85098 12.5002 12.5 9.85116 12.5 6.58343C12.5 3.3157 9.85098 0.666687 6.58325 0.666687C3.31552 0.666687 0.666504 3.3157 0.666504 6.58343C0.666504 9.85116 3.31552 12.5002 6.58325 12.5002Z" stroke="#151515" strokeWidth="1.33333" strokeMiterlimit="10" fill="none"/>
            <path d="M15.2093 15.2868C15.4697 15.5471 15.8918 15.5471 16.1521 15.2868C16.4125 15.0264 16.4125 14.6043 16.1521 14.344L15.6807 14.8154L15.2093 15.2868ZM10.9253 10.0599L10.4539 10.5313L15.2093 15.2868L15.6807 14.8154L16.1521 14.344L11.3967 9.58853L10.9253 10.0599Z" fill="#151515"/>
          </>
        );

      // User icons
      case 'user':
        return (
          <>
            <path d="M6.69008 5.112C7.93604 5.112 8.94608 4.10195 8.94608 2.856C8.94608 1.61005 7.93604 0.599998 6.69008 0.599998C5.44413 0.599998 4.43408 1.61005 4.43408 2.856C4.43408 4.10195 5.44413 5.112 6.69008 5.112Z" stroke="#2D2D2D" strokeWidth="1.2" strokeLinejoin="bevel" fill="none"/>
            <path d="M12.7729 10.3056V9.56959C12.7729 7.94719 11.4449 6.61919 9.8225 6.61919H3.5505C1.9281 6.61919 0.600098 7.94719 0.600098 9.56959V10.3056" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="bevel" fill="none"/>
          </>
        );
      case 'user-white':
        return (
          <>
            <path d="M8.25994 6.29003C9.81738 6.29003 11.0799 5.02747 11.0799 3.47003C11.0799 1.91258 9.81738 0.650024 8.25994 0.650024C6.7025 0.650024 5.43994 1.91258 5.43994 3.47003C5.43994 5.02747 6.7025 6.29003 8.25994 6.29003Z" stroke="white" strokeWidth="1.3" strokeLinejoin="bevel" fill="none"/>
            <path d="M15.8659 12.7824V11.8624C15.8659 9.83444 14.2059 8.17444 12.1779 8.17444H4.3379C2.3099 8.17444 0.649902 9.83444 0.649902 11.8624V12.7824" stroke="white" strokeWidth="1.3" strokeLinejoin="bevel" fill="none"/>
          </>
        );

      // Arrow up/down (20px viewBox)
      case 'arrow-up':
        return <path d="M15 13L10 7.5L5 13" stroke="#555555" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-up-white':
        return <path d="M15 13L10 7.5L5 13" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-down':
        return <path d="M5 7.5L10 13L15 7.5" stroke="#555555" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-down-white':
        return <path d="M5 7.5L10 13L15 7.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;

      // Arrow left/right (20px viewBox)
      case 'arrow-right':
        return <path d="M7.25 15.25L12.75 10.25L7.25 5.25" stroke="#555555" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-right-gray':
        return <path d="M7.25 15.25L12.75 10.25L7.25 5.25" stroke="#BEBEC7" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-right-white':
        return <path d="M7.25 15.25L12.75 10.25L7.25 5.25" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-left':
        return <path d="M12.75 15.25L7.25 10.25L12.75 5.25" stroke="#555555" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-left-gray':
        return <path d="M12.75 15.25L7.25 10.25L12.75 5.25" stroke="#BEBEC7" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-left-white':
        return <path d="M12.75 15.25L7.25 10.25L12.75 5.25" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;

      // Chevron (dropdown style) - 20px viewBox
      case 'chevron-down':
        return <path d="M5 7.5L10 12.5L15 7.5" stroke="#94B9E3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>;
      case 'chevron-down-white':
        return <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>;

      // Arrow with line (navigation arrows)
      case 'arrow-left2-white':
        return (
          <>
            <path d="M20.25 12L3.75 12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.5 5.25L3.75 12L10.5 18.75" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        );
      case 'arrow-left2-gray':
        return (
          <>
            <path d="M20.25 12L3.75 12" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.5 5.25L3.75 12L10.5 18.75" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        );
      case 'arrow-left2-green':
        return (
          <>
            <path d="M20.25 12L3.75 12" stroke="#006462" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.5 5.25L3.75 12L10.5 18.75" stroke="#006462" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        );
      case 'arrow-right2-white':
        return (
          <>
            <path d="M3.75 12L20.25 12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.5 5.25L20.25 12L13.5 18.75" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        );
      case 'arrow-right2-gray':
        return (
          <>
            <path d="M3.75 12L20.25 12" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.5 5.25L20.25 12L13.5 18.75" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        );
      case 'arrow-right2-green':
        return (
          <>
            <path d="M3.75 12L20.25 12" stroke="#006462" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.5 5.25L20.25 12L13.5 18.75" stroke="#006462" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        );

      // Plus/Minus (20px viewBox)
      case 'plus':
        return (
          <>
            <path d="M15.48 10L4.91998 10" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M10.2007 4.72L10.2007 15.28" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round"/>
          </>
        );
      case 'plus-gray':
        return (
          <>
            <path d="M15.48 10L4.91998 10" stroke="#BEBEC7" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M10.2007 4.72L10.2007 15.28" stroke="#BEBEC7" strokeWidth="1.2" strokeLinecap="round"/>
          </>
        );
      case 'minus':
        return <path d="M15.48 10L4.91998 10" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round"/>;
      case 'minus-gray':
        return <path d="M15.48 10L4.91998 10" stroke="#BEBEC7" strokeWidth="1.2" strokeLinecap="round"/>;

      // Document (20px viewBox)
      case 'document':
        return (
          <path d="M16.3333 6.16667V6C16.3333 4.59987 16.3333 3.8998 16.0608 3.36502C15.8212 2.89462 15.4387 2.51217 14.9683 2.27248C14.4335 2 13.7335 2 12.3333 2H7C5.59987 2 4.8998 2 4.36502 2.27248C3.89462 2.51217 3.51217 2.89462 3.27248 3.36502C3 3.8998 3 4.59987 3 6V14.6667C3 16.0668 3 16.7669 3.27248 17.3016C3.51217 17.772 3.89462 18.1545 4.36502 18.3942C4.8998 18.6667 5.59987 18.6667 7 18.6667H10.0833M10.0833 9.5H6.33333M9.25 12.8333H6.33333M13 6.16667H6.33333M14.6667 15.3333V10.75C14.6667 10.0596 15.2263 9.5 15.9167 9.5C16.607 9.5 17.1667 10.0596 17.1667 10.75V15.3333C17.1667 16.714 16.0474 17.8333 14.6667 17.8333C13.286 17.8333 12.1667 16.714 12.1667 15.3333V12" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        );

      // Download (20px viewBox)
      case 'download':
      case 'download-white':
        return (
          <>
            <path d="M9.5 11.3359L6.16602 7.96387C5.92357 7.7186 5.92606 7.32279 6.1709 7.08008C6.41631 6.83749 6.81201 6.83969 7.05469 7.08496L9.33887 9.39551L9.33887 1.45605C9.33887 1.11088 9.61869 0.831054 9.96387 0.831054C10.309 0.831098 10.5889 1.1109 10.5889 1.45605L10.5889 9.35645L12.833 7.08496C13.0757 6.83953 13.4713 6.83744 13.7168 7.08008C13.962 7.32276 13.9643 7.71846 13.7217 7.96387L10.3887 11.3359L9.94434 11.7852L9.5 11.3359Z" fill="white"/>
            <path d="M3.33203 8.40625V17.5112H16.6654V8.40625" stroke="white" strokeWidth="1.25" strokeLinecap="round"/>
          </>
        );

      // VCard (연락처 저장) - resume_1388261 1.svg
      case 'vcard':
        return (
          <>
            <path d="M17.1445 5.91406H13.5898C12.7269 5.91406 12.0273 5.21449 12.0273 4.35156V0.796875" stroke="white" strokeWidth="1.3" strokeMiterlimit="10" strokeLinejoin="round" fill="none"/>
            <path d="M17.1441 5.91449V17.668C17.1441 18.5309 16.4446 19.2305 15.5816 19.2305H4.41406C3.55113 19.2305 2.85156 18.5309 2.85156 17.668V2.35547C2.85156 1.4925 3.55113 0.792971 4.41406 0.792971H12.0486L17.1441 5.91449Z" stroke="white" strokeWidth="1.3" strokeMiterlimit="10" fill="none"/>
            <path d="M5.23438 16.1055H14.8047" stroke="white" strokeWidth="1.3" strokeMiterlimit="10"/>
            <path d="M6.01562 13.7227C6.01562 12.2125 7.23984 10.9883 8.75 10.9883C10.2602 10.9883 11.4844 12.2125 11.4844 13.7227" stroke="white" strokeWidth="1.3" strokeMiterlimit="10" strokeLinejoin="round" fill="none"/>
            <path d="M7.22656 9.42578C7.22656 8.56281 7.92613 7.86328 8.78906 7.86328C9.65199 7.86328 10.3516 8.56281 10.3516 9.42578C10.3516 10.2888 9.65199 10.9883 8.78906 10.9883C7.92613 10.9883 7.22656 10.2888 7.22656 9.42578Z" stroke="white" strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </>
        );

      // PDF (PDF 다운로드) - resume_1388261 2.svg
      case 'pdf':
        return (
          <>
            <path d="M17.1445 5.91406H13.5898C12.7269 5.91406 12.0273 5.21449 12.0273 4.35156V0.796875" stroke="white" strokeWidth="1.3" strokeMiterlimit="10" strokeLinejoin="round" fill="none"/>
            <path d="M17.1441 5.91449V17.668C17.1441 18.5309 16.4446 19.2305 15.5816 19.2305H4.41406C3.55113 19.2305 2.85156 18.5309 2.85156 17.668V2.35547C2.85156 1.4925 3.55113 0.792971 4.41406 0.792971H12.0486L17.1441 5.91449Z" stroke="white" strokeWidth="1.3" strokeMiterlimit="10" fill="none"/>
            <path d="M5.4375 15.8928V11.8125H6.44973C7.00877 11.8125 7.46193 12.2657 7.46193 12.8247C7.46193 13.3837 7.00874 13.8369 6.44973 13.8369H5.4375" stroke="white" strokeWidth="1.008" strokeMiterlimit="10" fill="none"/>
            <path d="M14.6845 13.8359H12.6602" stroke="white" strokeWidth="1.008" strokeMiterlimit="10"/>
            <path d="M10.063 15.3888H9.05078V11.8125H10.063C10.622 11.8125 11.0752 12.2657 11.0752 12.8247V14.3766C11.0752 14.9356 10.622 15.3888 10.063 15.3888Z" stroke="white" strokeWidth="1.008" strokeMiterlimit="10" fill="none"/>
            <path d="M12.6602 15.8928V11.8125H15.1886" stroke="white" strokeWidth="1.008" strokeMiterlimit="10" fill="none"/>
          </>
        );

      // Share (공유하기/업로드) - icon_24_5.svg
      case 'share':
        return (
          <>
            <path d="M10.3867 1.28516L13.7207 4.65723C13.9632 4.90251 13.9607 5.2983 13.7158 5.54102C13.4704 5.7836 13.0747 5.7814 12.832 5.53613L10.5479 3.22559V11.1641C10.5479 11.5092 10.268 11.7891 9.92285 11.7891C9.57773 11.789 9.29785 11.5092 9.29785 11.1641V3.26465L7.05371 5.53613C6.81105 5.78156 6.41539 5.78365 6.16992 5.54102C5.92467 5.29834 5.92246 4.90264 6.16504 4.65723L9.49805 1.28516L9.94238 0.835938L10.3867 1.28516Z" fill="white"/>
            <path d="M3.33203 8.41406V17.519H16.6654V8.41406" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
          </>
        );

      // Resume (이력서) - Frame 1321319662.svg
      case 'resume':
        return (
          <path d="M2.92943 1C2.57638 1.00141 2.29051 1.28728 2.28906 1.64036V18.3596C2.29047 18.7127 2.57634 18.9986 2.92943 19L13.2176 18.995C13.388 18.9963 13.5519 18.9299 13.6734 18.8104L17.5268 14.957C17.6481 14.8364 17.7163 14.6724 17.7164 14.5013V1.64036C17.7149 1.28728 17.4291 1.00141 17.076 1L2.92943 1ZM3.57481 2.28696H16.4294V13.8559H13.2176C12.8607 13.8545 12.5709 14.1442 12.5723 14.5012V17.7092L3.57481 17.7142V2.28696ZM6.75767 6.14409C5.9003 6.18523 5.96186 7.47219 6.81919 7.43105H13.2176C14.075 7.43105 14.075 6.14409 13.2176 6.14409H6.81919C6.79866 6.14313 6.77824 6.14313 6.75767 6.14409ZM6.71123 8.71676C5.91682 8.81033 5.97303 9.98061 6.77274 9.99745H13.1611C14.0904 10.0759 14.0904 8.63829 13.1611 8.71676H6.77274C6.75221 8.7158 6.7318 8.7158 6.71123 8.71676ZM6.78656 11.2832C6.43118 11.2832 6.14306 11.5713 6.14306 11.9267C6.14306 12.2821 6.43114 12.5702 6.78656 12.5702H9.99959C10.355 12.5702 10.6431 12.2821 10.6431 11.9267C10.6431 11.5713 10.355 11.2832 9.99959 11.2832H6.78656ZM13.858 15.1416H15.5216L13.858 16.804V15.1416Z" fill="white"/>
        );

      // Eye icons
      case 'eye':
      case 'eye-white':
        return (
          <>
            <path d="M15.8335 5.83331C15.8335 6.83331 12.4752 10.8333 8.3335 10.8333C4.19183 10.8333 0.833496 6.83331 0.833496 5.83331C0.833496 4.83331 4.19183 0.833313 8.3335 0.833313C12.4752 0.833313 15.8335 4.83331 15.8335 5.83331Z" stroke="white" strokeWidth="1.66667" fill="none"/>
            <path d="M10.8335 5.83331C10.8335 6.49635 10.5701 7.13224 10.1013 7.60108C9.63242 8.06992 8.99654 8.33331 8.3335 8.33331C7.67045 8.33331 7.03457 8.06992 6.56573 7.60108C6.09689 7.13224 5.8335 6.49635 5.8335 5.83331C5.8335 5.17027 6.09689 4.53439 6.56573 4.06555C7.03457 3.5967 7.67045 3.33331 8.3335 3.33331C8.99654 3.33331 9.63242 3.5967 10.1013 4.06555C10.5701 4.53439 10.8335 5.17027 10.8335 5.83331Z" stroke="white" strokeWidth="1.66667" fill="none"/>
          </>
        );

      // List icons
      case 'list-white':
        return (
          <>
            <path d="M0.649902 0.650024H14.6499" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M0.649902 5.65002H14.6499" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M0.649902 10.65H14.6499" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
          </>
        );
      case 'list-green':
        return (
          <>
            <path d="M0.649902 0.650024H14.6499" stroke="#006462" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M0.649902 5.65002H14.6499" stroke="#006462" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M0.649902 10.65H14.6499" stroke="#006462" strokeWidth="1.3" strokeLinecap="round"/>
          </>
        );

      // Info icons (16px viewBox)
      case 'info':
        return (
          <>
            <path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z" stroke="#151515" strokeMiterlimit="10" fill="none"/>
            <path d="M8 11L8 7.5" stroke="#151515" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 5.5C7.86193 5.5 7.75 5.38807 7.75 5.25C7.75 5.11193 7.86193 5 8 5C8.13807 5 8.25 5.11193 8.25 5.25C8.25 5.38807 8.13807 5.5 8 5.5Z" fill="#151515" stroke="#151515"/>
          </>
        );
      case 'info-gray':
        return (
          <>
            <path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z" stroke="#929299" strokeMiterlimit="10" fill="none"/>
            <path d="M8 11L8 7.5" stroke="#929299" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 5.5C7.86193 5.5 7.75 5.38807 7.75 5.25C7.75 5.11193 7.86193 5 8 5C8.13807 5 8.25 5.11193 8.25 5.25C8.25 5.38807 8.13807 5.5 8 5.5Z" fill="#929299" stroke="#929299"/>
          </>
        );

      // Error icons
      case 'error':
        return (
          <>
            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#F35064" strokeMiterlimit="10" fill="none"/>
            <path d="M8 5V8.5" stroke="#F35064" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 11.5C8.41421 11.5 8.75 11.1642 8.75 10.75C8.75 10.3358 8.41421 10 8 10C7.58579 10 7.25 10.3358 7.25 10.75C7.25 11.1642 7.58579 11.5 8 11.5Z" fill="#F35064"/>
          </>
        );
      case 'error-white':
        return (
          <>
            <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="white" strokeWidth="1.3" strokeMiterlimit="10" fill="none"/>
            <path d="M10 6.25V10.625" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14.375C10.5178 14.375 10.9375 13.9553 10.9375 13.4375C10.9375 12.9197 10.5178 12.5 10 12.5C9.48223 12.5 9.0625 12.9197 9.0625 13.4375C9.0625 13.9553 9.48223 14.375 10 14.375Z" fill="white"/>
          </>
        );

      // Call (20px viewBox)
      case 'call':
        return (
          <path d="M12.9456 9.40421C12.8016 9.27304 12.6122 9.20307 12.4175 9.20909C12.2228 9.21511 12.038 9.29665 11.9024 9.43646L10.1076 11.2822C9.67562 11.1997 8.80712 10.929 7.91312 10.0372C7.01912 9.14246 6.74837 8.27171 6.66812 7.84271L8.51237 6.04721C8.65218 5.91155 8.73372 5.72682 8.73974 5.53211C8.74576 5.3374 8.67578 5.14799 8.54462 5.00396L5.77337 1.95671C5.64215 1.81222 5.45978 1.72458 5.26498 1.7124C5.07019 1.70022 4.87832 1.76445 4.73012 1.89146L3.10262 3.28721C2.97295 3.41734 2.89556 3.59054 2.88512 3.77396C2.87387 3.96146 2.65937 8.40296 6.10337 11.8485C9.10787 14.8522 12.8714 15.072 13.9079 15.072C14.0594 15.072 14.1524 15.0675 14.1771 15.066C14.3604 15.0551 14.5333 14.9775 14.6631 14.8477L16.0581 13.2195C16.1852 13.0714 16.2496 12.8795 16.2375 12.6847C16.2255 12.49 16.138 12.3075 15.9936 12.1762L12.9456 9.40421Z" fill="#94B9E3"/>
        );

      // Location (20px viewBox)
      case 'location':
        return (
          <path d="M9 1.64844C10.7902 1.64844 12.5071 2.3596 13.773 3.62547C15.0388 4.89134 15.75 6.60823 15.75 8.39844C15.75 11.1929 13.62 14.1209 9.45 17.2484C9.32018 17.3458 9.16228 17.3984 9 17.3984C8.83772 17.3984 8.67982 17.3458 8.55 17.2484C4.38 14.1209 2.25 11.1929 2.25 8.39844C2.25 6.60823 2.96116 4.89134 4.22703 3.62547C5.4929 2.3596 7.20979 1.64844 9 1.64844ZM9 6.14844C8.40326 6.14844 7.83097 6.38549 7.40901 6.80745C6.98705 7.2294 6.75 7.8017 6.75 8.39844C6.75 8.99517 6.98705 9.56747 7.40901 9.98943C7.83097 10.4114 8.40326 10.6484 9 10.6484C9.59674 10.6484 10.169 10.4114 10.591 9.98943C11.0129 9.56747 11.25 8.99517 11.25 8.39844C11.25 7.8017 11.0129 7.2294 10.591 6.80745C10.169 6.38549 9.59674 6.14844 9 6.14844Z" fill="#94B9E3"/>
        );

      // Mail (20px viewBox)
      case 'mail':
        return (
          <>
            <path d="M16.1653 3.00136C16.0972 2.99434 16.0285 2.99434 15.9603 3.00136H1.96031C1.87058 3.00274 1.78145 3.0162 1.69531 3.04136L8.92031 10.2364L16.1653 3.00136Z" fill="#94B9E3"/>
            <path d="M16.9048 3.69531L9.62484 10.9453C9.43748 11.1316 9.18403 11.2361 8.91984 11.2361C8.65566 11.2361 8.40221 11.1316 8.21484 10.9453L0.999844 3.75031C0.977663 3.83183 0.965903 3.91584 0.964844 4.00031V14.0003C0.964844 14.2655 1.0702 14.5199 1.25774 14.7074C1.44527 14.895 1.69963 15.0003 1.96484 15.0003H15.9648C16.2301 15.0003 16.4844 14.895 16.672 14.7074C16.8595 14.5199 16.9648 14.2655 16.9648 14.0003V4.00031C16.9609 3.89614 16.9406 3.79323 16.9048 3.69531ZM2.64984 14.0003H1.95484V13.2853L5.58984 9.68031L6.29484 10.3853L2.64984 14.0003ZM15.9548 14.0003H15.2548L11.6098 10.3853L12.3148 9.68031L15.9498 13.2853L15.9548 14.0003Z" fill="#94B9E3"/>
          </>
        );

      // Map (16px viewBox)
      case 'map':
        return (
          <path d="M6.10667 11.3867L2 13.7333V4.34665L6.10667 1.99998M6.10667 11.3867L10.2133 13.7333M6.10667 11.3867V1.99998M10.2133 13.7333L13.7333 11.3867V1.99998L10.2133 4.34665M10.2133 13.7333V4.34665M10.2133 4.34665L6.10667 1.99998" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        );
      case 'map-green':
        return (
          <path d="M6.21232 11.1755L2.35205 13.3813V4.55787L6.21232 2.35201M6.21232 11.1755L10.0726 13.3813M6.21232 11.1755V2.35201M10.0726 13.3813L13.3814 11.1755V2.35201L10.0726 4.55787M10.0726 13.3813V4.55787M10.0726 4.55787L6.21232 2.35201" stroke="#6BCDC7" strokeWidth="1.128" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        );

      // Calendar (16px viewBox)
      case 'calendar':
        return (
          <>
            <path d="M2.61621 7.91778V3.14064C2.61621 2.65949 3.00626 2.26944 3.48741 2.26944H12.833C13.3142 2.26944 13.7042 2.65949 13.7042 3.14064V12.6949C13.7042 13.1761 13.3142 13.5661 12.833 13.5661H3.48762C3.00639 13.5661 2.61631 13.1759 2.61643 12.6947L2.61781 7.03946" stroke="#2D2D2D" strokeWidth="1.2" strokeMiterlimit="10" fill="none"/>
            <path d="M13.7042 5.6799H2.61621" stroke="#2D2D2D" strokeWidth="1.2" strokeMiterlimit="10"/>
            <path d="M5.61328 0.713989V3.65532" stroke="#2D2D2D" strokeWidth="1.2" strokeMiterlimit="10"/>
            <path d="M10.7041 0.713989V3.65532" stroke="#2D2D2D" strokeWidth="1.2" strokeMiterlimit="10"/>
          </>
        );
      case 'calendar-white':
        return (
          <>
            <path d="M0.714844 10.0053V3.3704C0.714844 2.70214 1.25658 2.1604 1.92484 2.1604H14.9048C15.5731 2.1604 16.1148 2.70214 16.1148 3.3704V16.6402C16.1148 17.3085 15.5731 17.8502 14.9048 17.8502H1.92514C1.25676 17.8502 0.714977 17.3083 0.715141 16.6399L0.717071 8.78543" stroke="white" strokeWidth="1.43" strokeMiterlimit="10" fill="none"/>
            <path d="M16.1148 6.89709H0.714844" stroke="white" strokeWidth="1.43" strokeMiterlimit="10"/>
            <path d="M4.87842 0V4.08519" stroke="white" strokeWidth="1.43" strokeMiterlimit="10"/>
            <path d="M11.9487 0V4.08519" stroke="white" strokeWidth="1.43" strokeMiterlimit="10"/>
          </>
        );

      // Large icons (40px viewBox)
      case 'menu':
        return (
          <>
            <path d="M7.3999 11H32.5999" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7.3999 20H32.5999" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7.3999 29H32.5999" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
          </>
        );
      case 'menu-white':
        return (
          <>
            <path d="M7.3999 11H32.5999" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7.3999 20H32.5999" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7.3999 29H32.5999" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </>
        );
      case 'add':
        return (
          <>
            <path d="M35 20L5 20" stroke="#2D2D2D" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M20 35L20 5" stroke="#2D2D2D" strokeWidth="1.4" strokeLinecap="round"/>
          </>
        );
      case 'add-white':
        return (
          <>
            <path d="M35 20L5 20" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M20 35L20 5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
          </>
        );
      case 'close-large':
        return (
          <>
            <path d="M32.6001 32.6012L7.39881 7.39995" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7.3999 32.6012L32.6012 7.39996" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
          </>
        );
      case 'close-large-white':
        return (
          <>
            <path d="M32.6001 32.6012L7.39881 7.39995" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7.3999 32.6012L32.6012 7.39996" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <svg
      className={`icon icon--${size} ${className}`}
      width={size}
      height={size}
      viewBox={getViewBox()}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      style={style}
      role={onClick ? 'button' : 'img'}
      aria-label={type}
    >
      {renderIcon()}
    </svg>
  );
};

export default Icon;

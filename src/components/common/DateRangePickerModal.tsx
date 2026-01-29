import React, { useState, useEffect } from 'react';
import styles from './DateRangePickerModal.module.scss';

interface DateRangePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
  position?: { top: number; left: number };
  datePickerType?: 'start' | 'end';
}

const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialStartDate,
  initialEndDate,
  position,
  datePickerType = 'start',
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (isOpen) {
      // 초기 날짜 설정 - datePickerType에 따라 start 또는 end 날짜 사용
      const initialDate = datePickerType === 'start' ? initialStartDate : initialEndDate;
      if (initialDate) {
        const parts = initialDate.split('.');
        if (parts.length === 3) {
          const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          setSelectedDate(date);
          setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
        }
      } else {
        setSelectedDate(null);
      }
    }
  }, [isOpen, initialStartDate, initialEndDate, datePickerType]);

  if (!isOpen) return null;

  // 현재 월의 첫 날과 마지막 날
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // 이전/다음 월 이동
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // 날짜 포맷팅 (YYYY.MM.DD)
  const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  // 날짜 선택
  const selectDate = (date: Date) => {
    const dateStr = formatDate(date);
    
    if (datePickerType === 'start') {
      // 시작 날짜 선택
      onConfirm(dateStr, initialEndDate || dateStr);
    } else {
      // 종료 날짜 선택
      onConfirm(initialStartDate || dateStr, dateStr);
    }
    
    // 모달 닫기
    onClose();
  };

  // 현재 선택된 날짜인지 확인
  const isSelectedDate = (date: Date): boolean => {
    if (!selectedDate) return false;
    return formatDate(date) === formatDate(selectedDate);
  };

  // 확인 버튼 클릭 (더 이상 사용하지 않음, handleDateRangeConfirm 사용)

  // 달력 그리드 생성
  const calendarDays: (Date | null)[] = [];
  
  // 이전 달의 마지막 날들 (빈 칸)
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // 현재 달의 날들
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthYear = `${monthNames[month]} ${year}`;

  const modalStyle: React.CSSProperties = position
    ? {
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'none',
        right: 'auto',
        bottom: 'auto',
      }
    : {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal} style={modalStyle}>
        <div className={styles.content}>
          <div className={styles.calendar}>
            <div className={styles.monthHeader}>
              <button className={styles.monthNav} onClick={goToPreviousMonth}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="#E4E4E4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <h3 className={styles.monthYear}>{monthYear}</h3>
              <button className={styles.monthNav} onClick={goToNextMonth}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#E4E4E4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className={styles.weekDays}>
              {weekDays.map((day) => (
                <div key={day} className={styles.weekDay}>
                  {day}
                </div>
              ))}
            </div>

            <div className={styles.calendarGrid}>
              {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, rowIndex) => {
                const rowDays = calendarDays.slice(rowIndex * 7, (rowIndex + 1) * 7);
                const paddedRowDays = [...rowDays];
                while (paddedRowDays.length < 7) {
                  paddedRowDays.push(null);
                }
                
                return (
                  <div key={rowIndex} className={styles.calendarRow}>
                    {paddedRowDays.map((date, cellIndex) => {
                      const index = rowIndex * 7 + cellIndex;
                      if (!date) {
                        return <div key={`empty-${index}`} className={styles.calendarCellEmpty} />;
                      }

                      const isSelected = isSelectedDate(date);

                      return (
                        <button
                          key={formatDate(date)}
                          className={`${styles.calendarCell} ${isSelected ? styles.selected : ''}`}
                          onClick={() => selectDate(date)}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DateRangePickerModal;

